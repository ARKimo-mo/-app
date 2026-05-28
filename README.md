# 职前副本 AI

面向大学生的 AI 求职预体验 MVP Web Demo。

核心理念：投递前，先试玩你的未来工作。

## 功能

- 首页 Landing Page
- 职业画像输入
- 职业画像与职业副本推荐
- AI 产品经理副本任务体验
- 成长报告、能力诊断、4 周学习路径与简历表达

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:5173
```

也可以运行 Windows 演示脚本：

```bat
start-demo.bat
```

## AI 接口预留

当前 AI 输出使用 mock 数据模拟，后续可替换 `src/services/aiService.ts` 中的函数实现，接入真实大模型 API。
