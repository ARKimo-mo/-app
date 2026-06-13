import "server-only";
import type { PromptDefinition } from "./prompts";
import type { AIResponse } from "./types";

const stripJson = (value: string) => value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

async function requestModel(prompt: PromptDefinition<unknown, unknown>, input: unknown) {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || "https://api.deepseek.com";
  const model = prompt.model === "reasoning"
    ? process.env.AI_REASONING_MODEL || "deepseek-reasoner"
    : process.env.AI_FAST_MODEL || "deepseek-chat";
  if (!apiKey) throw new Error("AI_API_KEY 未配置");
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, temperature: prompt.model === "reasoning" ? 0.2 : 0.4, response_format: { type: "json_object" }, messages: [{ role: "system", content: "严格遵守用户提示中的输出格式和证据约束。" }, { role: "user", content: prompt.build(input) }] }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`模型请求失败：${response.status}`);
  const body = await response.json();
  return { model, content: body?.choices?.[0]?.message?.content as string };
}

export async function runPrompt<I, O>(definition: PromptDefinition<I, O>, input: I, evidence: string[]): Promise<AIResponse<O>> {
  const traceId = crypto.randomUUID();
  const generatedAt = new Date().toISOString();
  let lastError: unknown;
  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const { model, content } = await requestModel(definition as PromptDefinition<unknown, unknown>, input);
        const parsed = definition.schema.safeParse(JSON.parse(stripJson(content)));
        if (!parsed.success) throw new Error("模型输出未通过结构校验");
        return { mode: "live", traceId, promptVersion: definition.version, model, generatedAt, evidence, data: parsed.data };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  } catch (error) {
    return { mode: "fallback", traceId, promptVersion: definition.version, model: definition.model, generatedAt, evidence, data: definition.fallback(input), error: error instanceof Error ? error.message : "AI 请求失败" };
  }
}
