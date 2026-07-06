import "server-only";
import type { PromptDefinition } from "./prompts";
import type { AIResponse } from "./types";

const stripJson = (value: string) =>
  value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

async function requestModel(prompt: PromptDefinition<unknown, unknown>, input: unknown, retryNote = "") {
  const apiKey = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model =
    prompt.model === "reasoning"
      ? process.env.AI_REASONING_MODEL || "deepseek-reasoner"
      : process.env.AI_FAST_MODEL || process.env.DEEPSEEK_MODEL || "deepseek-chat";

  if (!apiKey) {
    throw new Error(
      "未配置 AI API Key。请在 .env.local 中设置 AI_API_KEY 或 DEEPSEEK_API_KEY。",
    );
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: prompt.model === "reasoning" ? 0.2 : 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "严格遵守用户提示中的输出格式和证据约束，只输出合法 JSON。",
        },
        { role: "user", content: retryNote ? `${prompt.build(input)}\n\n上一次输出未通过校验：${retryNote}\n请只输出修正后的合法 JSON。` : prompt.build(input) },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`模型请求失败：${response.status} ${detail.slice(0, 300)}`);
  }

  const body = await response.json();
  const content = body?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("模型返回内容为空");
  }
  return { model, content };
}

export async function runPrompt<I, O>(
  definition: PromptDefinition<I, O>,
  input: I,
  evidence: string[],
): Promise<AIResponse<O>> {
  const traceId = crypto.randomUUID();
  const generatedAt = new Date().toISOString();
  let lastError: unknown;
  let retryNote = "";

  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const { model, content } = await requestModel(
          definition as PromptDefinition<unknown, unknown>,
          input,
          retryNote,
        );
        const parsed = definition.schema.safeParse(JSON.parse(stripJson(content)));
        if (!parsed.success) {
          throw new Error(
            `模型输出未通过结构校验：${parsed.error.issues[0]?.message || "未知结构错误"}`,
          );
        }
        return {
          mode: "live",
          traceId,
          promptVersion: definition.version,
          model,
          generatedAt,
          evidence,
          data: parsed.data,
        };
      } catch (error) {
        lastError = error;
        retryNote = error instanceof Error ? error.message : "JSON 或 schema 校验失败";
      }
    }
    throw lastError;
  } catch (error) {
    return {
      mode: "fallback",
      traceId,
      promptVersion: definition.version,
      model: definition.model,
      generatedAt,
      evidence,
      data: definition.fallback(input),
      error: error instanceof Error ? error.message : "AI 请求失败",
    };
  }
}
