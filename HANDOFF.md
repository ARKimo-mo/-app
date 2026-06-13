# 职前副本 AI V4 开发交接说明

## 1. 交接版本

- GitHub 仓库：`https://github.com/ARKimo-mo/-app.git`
- 当前开发分支：`codex/v4-ai-backend`
- V4 页面入口：`/v4`
- V4 是目前应继续开发的完整版本。
- V2/V3 用于保留历史界面与功能对照，继续开发时不要直接覆盖。

拉取并切换分支：

```bash
git clone https://github.com/ARKimo-mo/-app.git
cd ./-app
git switch codex/v4-ai-backend
npm install
```

## 2. 产品定位与核心闭环

产品面向大学生，核心闭环为：

```text
填写资料与目标
  -> AI 生成职业数字分身
  -> 搜索并匹配公开岗位
  -> 根据岗位与能力缺口生成定制副本
  -> 用户完成开放任务
  -> AI 评估并引用回答证据
  -> 更新能力、作品与求职材料
```

当前 V4 已完成该闭环的主要前端交互和 AI API Demo，但尚未接入数据库、用户账号、真实自动投递与文件解析。

## 3. 技术栈

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Zod
- DeepSeek OpenAI-compatible API
- Tavily Search API

## 4. 环境变量

只在项目根目录创建 `.env.local`：

```env
AI_API_KEY=
AI_BASE_URL=https://api.deepseek.com
AI_FAST_MODEL=
AI_REASONING_MODEL=
TAVILY_API_KEY=
```

注意：

- `.env.local` 已被 `.gitignore` 忽略。
- API Key 只能由 Next.js 服务端 API Routes 读取。
- 前端网络响应不会返回 API Key。
- 部署到 Vercel 等平台时，需要在平台项目设置中配置同名环境变量。
- 修改 `.env.local` 后需要重启 Next.js 服务。

## 5. 版本关系

| 路由 | 说明 | 主要入口 |
| --- | --- | --- |
| `/v2` | 原始 11 页面高保真 Demo | `src/components/v2/app.tsx` |
| `/v3` | JD 定制、岗位雷达、投递中心演示 | `src/components/v3/app.tsx` |
| `/v4` | V2/V3 完整功能 + 真实 AI | `V4App` in `src/components/v3/app.tsx` |

`V3App` 与 `V4App` 共用组件文件，但通过 `aiEnabled` 区分。修改 AI 功能时应只影响 V4 分支逻辑。

## 6. AI 架构

统一响应：

```ts
type AIResponse<T> = {
  mode: "live" | "fallback";
  traceId: string;
  promptVersion: string;
  model: string;
  generatedAt: string;
  evidence: string[];
  data: T;
  error?: string;
};
```

执行流程：

```text
前端提交结构化输入
  -> Next.js API Route
  -> Prompt Registry 构造提示词
  -> DeepSeek / Tavily
  -> Zod Schema 校验
  -> 校验失败自动重试一次
  -> 仍失败返回 fallback
  -> 前端更新状态并展示 AI 过程信息
```

关键文件：

- `src/lib/ai/types.ts`：统一数据类型。
- `src/lib/ai/schemas.ts`：Zod 输出校验。
- `src/lib/ai/prompts.ts`：集中管理提示词、模型类型和 fallback。
- `src/lib/ai/server.ts`：DeepSeek 服务端模型网关、重试与统一响应。

模型分工：

- Fast：职业分身、岗位搜索结果整理与匹配。
- Reasoning：定制副本生成、开放回答评估。

## 7. API 路由

### `POST /api/ai/avatar/profile`

根据引导问卷、目标岗位、偏好和经历生成职业数字分身。

### `POST /api/ai/mission/generate`

根据职业分身、目标岗位和可选 JD 生成三个动态副本任务。

### `POST /api/ai/mission/evaluate`

根据动态任务评分标准评估用户开放回答，返回百分制评分、引用证据、改进建议和能力增量。

### `POST /api/ai/jobs/search`

使用 Tavily 搜索公开招聘网页，再由 DeepSeek 进行结构化整理与职业分身匹配。

当前优先域名：

- `zhaopin.com`
- `jobs.51job.com`
- `liepin.com`
- `bosszhipin.com`

岗位雷达不会模拟登录、绕过验证码或直接自动投递。

## 8. V4 前端状态

V4 当前使用 React state 和 `localStorage`，没有数据库。

主要本地键：

- `career-copy-ai-v4`：职业资料、分身、副本和评估结果。
- `career-copy-ai-v4-onboarded`：是否完成首次引导。

设置页提供：

- 重新开始 AI 引导
- 清除本地 AI 数据

AI 过程面板会显示：

- `live` 或 `fallback`
- 模型名称
- Prompt 版本
- Trace ID
- 输入依据
- 生成时间和降级原因

## 9. 已验证能力

已完成以下验证：

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- DeepSeek Fast 职业分身返回 `live`
- DeepSeek Reasoning 定制副本生成返回 `live`
- DeepSeek Reasoning 开放回答评估返回 `live`
- Tavily + DeepSeek 岗位雷达返回 `live`，并保留招聘来源
- AI 请求失败或模型输出非法 JSON 时返回 fallback
- `.env.local` 不会进入 Git

构建时 Recharts 可能显示静态预渲染尺寸提示，不影响页面运行。

## 10. 当前限制

- 没有账号系统和数据库，多设备无法同步。
- 没有 PDF/Word 简历解析。
- JD 工作台的部分按钮仍是演示交互，尚未全部接入真实 AI。
- AI 评估结果尚未真正写回 V2 能力图谱、作品集和成长复盘数据。
- 岗位搜索依赖公开网页结果，来源可能缺少薪资、城市或完整 JD。
- 智能投递仅为待确认流程演示，不会真实投递。
- Prompt 和 API 尚未加入限流、成本统计、缓存和内容安全审查。

## 11. 推荐接力顺序

1. 将 AI 评估结果真正写回能力成长、成长复盘和作品集。
2. 让 JD 工作台直接调用 AI，并将 JD 传入副本与简历生成。
3. 增加数据库、账号系统和服务端持久化。
4. 增加 PDF/Word 简历解析与版本管理。
5. 增加岗位收藏、来源去重、搜索缓存和用户确认投递流程。
6. 增加 API 限流、日志脱敏、成本监控和 Prompt 版本评测。
7. 部署到 Vercel 或其他公网环境，并配置环境变量。

## 12. 开发约定

- 不要提交 `.env.local` 或任何 API Key。
- 不要直接删除 V2/V3；V4 应向后兼容已有功能。
- 新 AI 能力必须使用 Prompt Registry、Zod Schema 与 `AIResponse<T>`。
- AI 结论必须展示依据；资料不足时必须明确说明。
- 所有关键操作必须有 loading、错误和 fallback 状态。
- 修改完成后至少运行 lint、TypeScript 检查和生产构建。
