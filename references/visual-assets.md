# 独立视觉素材清单

## 生成状态

- 已完成：11 张独立页面参考图，位于 `generated-pages/`。
- 已完成：统一学生数字分身、AI 面试官、AI 助手机器人透明 PNG。
- 已完成：6 张岗位副本封面。
- 已完成：8 张作品集项目封面。
- 已发布：上述新素材已复制到 `public/assets/`，前端会通过代码组件使用。
- 已完成：能力核心徽记与 S 级勋章透明 PNG。
- 待生成：关卡奖励与成长徽章的高清独立版本。

## 提取原则

只有无法通过 HTML/CSS、Lucide 和 Recharts 高保真实现的视觉内容才单独生成图片。图表、图标、按钮、卡片和文字不得栅格化。

## P0 核心素材

| 文件建议 | 素材 | 页面 | 规格建议 |
|---|---|---|---|
| `avatar-student-tablet.png` | 黑发紫色卫衣、手持平板的 3D 学生半身像 | 01-09 | 透明 PNG，1400px 高 |
| `avatar-student-profile.png` | 同角色头像近景 | 全局用户卡 | 透明 PNG，512x512 |
| `avatar-interviewer-suit.png` | 黑发青年 AI 面试官，深色西装 | 10 | 透明 PNG，1400px 高 |
| `assistant-robot.png` | 蓝紫色 AI 助手机器人 | 01、05、09 | 透明 PNG，700px |
| `ability-core-hex.png` | 发光六边形“产品经理核心能力”徽记 | 04 | 透明 PNG，900px |
| `grade-s-medal.png` | 蓝紫色 S 级成长勋章 | 06 | 透明 PNG，700px |

## P1 岗位副本封面

独立横向封面，比例约 16:7，不含文字、水印和 UI：

1. `job-product-manager.png`：产品经理在数据看板前分析。
2. `job-frontend-engineer.png`：前端工程师与代码屏幕。
3. `job-data-analyst.png`：数据分析师与蓝紫色图表。
4. `job-content-operations.png`：内容运营人员写作策划。
5. `job-ui-designer.png`：UI 设计师操作界面原型。
6. `job-market-specialist.png`：市场专员进行提案展示。

## P1 作品集封面

独立横向封面，比例约 4:3，允许包含抽象界面但不要可读正文：

1. `portfolio-campus-market.png`
2. `portfolio-ecommerce-analysis.png`
3. `portfolio-feature-launch.png`
4. `portfolio-brand-strategy.png`
5. `portfolio-learning-competitor.png`
6. `portfolio-retention-analysis.png`
7. `portfolio-community-review.png`
8. `portfolio-integrated-marketing.png`

## P2 奖励与装饰素材

- 三枚统一风格成长徽章：探索、成长、成就。
- 三个关卡奖励：洞察之眼、方案之星、产品思维卡。
- 一套非常克制的浅紫抽象背景纹理，仅用于 Hero 背景。
- 简历优化横幅中的机器人插画，可复用 `assistant-robot.png`。

## 必须代码绘制

- 左侧导航和顶部状态栏。
- 所有 Lucide 风格功能图标。
- 环形评分、进度条、雷达图、折线图、能力图谱连线。
- 状态标签、筛选器、tabs、搜索、开关、表单和弹窗。
- 所有中文文字与数字。

## 素材生成统一提示

```text
Create a polished 3D illustration asset for the Chinese AI career-growth product “职前副本 AI”.
Use a consistent youthful blue-violet visual world, soft studio lighting, rounded forms and premium SaaS illustration quality.
No text, no logo, no watermark. Keep the subject isolated with generous padding.
```
