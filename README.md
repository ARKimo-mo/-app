# 职跃 CareerCraft

面向大学生和转岗求职者的 AI 职业成长应用。

产品通过一个持续成长的数字分身，把求职过程串成完整闭环：

1. 根据简历、职业偏好问卷和 MBTI 推荐匹配岗位。
2. 为目标岗位整理公开学习资源并生成学习计划。
3. 通过测验和岗位项目积累可验证的能力证据。
4. 根据真实项目交付物生成简历项目经历和面试讲述。

> 不是替你包装成适合岗位的人，而是陪你真正成长为适合岗位的人。

## 当前功能

- 数字分身和职业成长路线
- Top 3 岗位匹配与能力缺口报告
- AI 产品经理完整培养路线
- 公开课程、文章和面经检索
- 三周学习计划与能力测验
- AI 求职助手项目作品包
- 项目评审、成长证据和能力变化
- 简历项目经历与面试讲述生成
- 浏览器本地进度保存
- 无 API Key 时的离线演示数据

算法工程师、数据分析师和 AI 运营/增长目前提供岗位匹配及路线预览。

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Framer Motion
- Lucide React
- Tavily Search API
- 兼容 OpenAI Chat Completions 协议的大模型接口

## 下载项目

需要先安装：

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20 或更高版本

```bash
git clone https://github.com/ARKimo-mo/-app.git
cd ./-app
npm install
```

## 本地运行

```bash
npm run dev
```

浏览器打开：

```text
http://localhost:3000
```

## 局域网运行

让同一 Wi-Fi 下的手机或其他电脑访问：

```bash
npm run dev -- -H 0.0.0.0 -p 3000
```

然后使用运行电脑的局域网 IP，例如：

```text
http://192.168.1.10:3000
```

Windows 可使用 `ipconfig` 查看 IPv4 地址。如果无法访问，需要允许 Node.js 通过 Windows 防火墙。

## 配置 AI 与搜索

项目不配置密钥也能使用完整演示流程。需要真实联网能力时：

1. 复制 `.env.example` 为 `.env.local`。
2. 填入所使用服务的密钥和模型。

```env
AI_API_KEY=
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=
TAVILY_API_KEY=
```

`AI_BASE_URL` 可以替换为任何兼容 OpenAI Chat Completions 协议的服务地址。

请勿提交 `.env.local` 或任何真实 API Key。

## 构建生产版本

```bash
npm run build
npm run start
```

## 两人协作建议

开始新功能前，从最新 `main` 创建自己的分支：

```bash
git switch main
git pull
git switch -c feature/功能名称
```

完成后提交并推送：

```bash
git add .
git commit -m "feat: 简要描述本次修改"
git push -u origin feature/功能名称
```

随后在 GitHub 创建 Pull Request，由另一位成员检查后合并到 `main`。

推荐分支命名：

- `feature/...`：新功能
- `fix/...`：问题修复
- `docs/...`：文档
- `design/...`：视觉与交互

提交前至少运行：

```bash
npm run build
```

## 项目结构

```text
src/
  app/                 页面、样式和服务端 API
  lib/                 岗位模板、匹配与成长逻辑
public/
  assets/              页面使用的静态资源
```

## 素材说明

当前像素人物基础素材来自
[Hylsy 64x64 Pixel Art Character](https://hylsy.itch.io/64x64-pixel-art-character1)，
按作者页面说明使用 CC0 许可，并在项目中进行了裁剪和阶段化视觉处理。

## 历史版本

仓库原有的 Vite MVP 会保留在 `legacy-vite` 分支，方便查看和回溯。
