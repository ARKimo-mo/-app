# 职前副本 AI

面向大学生的 AI 求职成长平台高保真 Demo。用户可以生成职业数字分身、搜索并匹配公开岗位、生成岗位定制副本、提交开放回答并获得 AI 评估。

## 当前版本

- `/v2`：原始高保真产品 Demo。
- `/v3`：加入 JD 定制、岗位雷达和智能投递界面的演示版本。
- `/v4`：当前完整版本。在 V2/V3 功能基础上接入 DeepSeek 与 Tavily。

V4 AI 能力：

- AI 职业数字分身
- AI 定制副本生成
- AI 开放回答评估
- Tavily 公开岗位搜索与 DeepSeek 匹配
- JSON Schema 校验、失败重试和 fallback 降级
- AI 过程面板、证据引用和浏览器本地持久化

## 本地运行

```bash
npm install
```

在项目根目录创建 `.env.local`：

```env
AI_API_KEY=你的 DeepSeek Key
AI_BASE_URL=https://api.deepseek.com
AI_FAST_MODEL=你的快速模型 ID
AI_REASONING_MODEL=你的推理模型 ID
TAVILY_API_KEY=你的 Tavily Key
```

启动开发环境：

```bash
npm run dev -- --port 3012
```

打开：

- V4：<http://127.0.0.1:3012/v4>
- V3：<http://127.0.0.1:3012/v3>
- V2：<http://127.0.0.1:3012/v2>

生产模式：

```bash
npm run build
npm run start -- --port 3012
```

## 验证

```bash
npm run lint
npx tsc --noEmit
npm run build
```

详细架构、文件说明、接口和后续开发建议见 [HANDOFF.md](./HANDOFF.md)。

> `.env.local` 已被 Git 忽略。不要将 API Key 写入前端组件、提交记录或聊天内容。
