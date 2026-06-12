# 11 页参考图生成规范

## Design Read

面向大学生的桌面端 AI 求职成长 SaaS。视觉年轻但不幼稚，以高信息密度、明确层级和可信产品感为主；使用克制蓝紫色、浅灰紫背景、柔和阴影和统一圆角，避免泛滥渐变、过度玻璃拟态与卡片套卡片。

## 全局规范

- 画布：独立横向页面，`1448 x 1086`。
- 布局：左侧固定导航约 224px，顶部状态栏约 64px，主内容三列或两列自适应。
- 品牌：`职前副本 AI`；Slogan：`先试岗，再成长，拿证据证明自己`。
- 色彩：背景 `#F6F7FC`；主色 `#6258F5`；深紫 `#4538E6`；浅紫 `#EEECFF`；成功 `#28B67A`；警告 `#F2A341`。
- 卡片：白色或极浅紫；圆角 14-18px；1px 冷灰描边；轻柔阴影。
- 字体：中文无衬线；页面标题 26-32px；卡片标题 16-18px；正文 12-14px。
- 图表：蓝紫主线，浅紫填充；真实坐标、标签和图例。
- 数字分身：统一为黑发、紫色卫衣、手持平板的青年 3D 半身形象。
- 必须生成独立页面，不得将多个页面拼在一张图中。

## 页面规范

### 01 Dashboard

顶部欢迎 Hero、右侧分身、今日评分 92；中部成长路径和目标岗位；下部最近副本、进度概览、快捷入口、能力雷达图。视觉重心在 Hero 与成长评分。

### 02 Avatar

大幅职业分身画像与身份标签；五项核心特质进度条；职业倾向和偏好；右侧分身摘要、优势、风险与建议；底部四张推荐角色方向卡。

### 03 Recommend

顶部标题与分身；筛选栏；主区 2x3 岗位副本卡，每卡包含场景封面、匹配度、指标、难度、标签和按钮；右侧推荐总结、Top3 和试岗提示。

### 04 SkillGrowth

目标岗位与阶段概览；中心六边形能力图谱；右侧成长数据、趋势折线和训练任务；底部五阶段成长路径和 CTA。

### 05 Mission

副本 Hero、分身和 2/5 关卡进度；AI 导师提示；三项关卡目标；左侧任务清单、中间复盘输入、右侧 AI 评分；奖励与能力雷达；底部进度流程。

### 06 Review

本次副本概览；主观反馈与客观评价雷达；任务完成情况；三张成长洞察卡；下一步行动和简历/面试材料；右侧 S 级总览、里程碑与收获。

### 07 Portfolio

作品集标题、分类 tabs 和搜索；主区双列八张项目卡，使用独立项目封面；右侧项目总数、能力覆盖、导出分享和创作建议；项目卡明确可点击。

### 08 Learning

学习阶段 Hero 和总进度；四个推荐模块；任务清单与时间轴并排；知识卡片与案例；右侧岗位匹配、本周目标和推荐练习。

### 09 Resume

四个 tabs；目标岗位条；左侧简历模块编辑列表；右侧真实简历纸张预览和导出操作；底部匹配度、关键词建议和优化 CTA。

### 10 Interview

AI 面试官 Hero；模拟面试/专项训练 tabs；岗位、类型和设置；左侧题目进度，中间当前问题与语音波形，右侧表现、优势、建议和 STAR 提示；底部下一题操作。

### 11 Settings

沿用相同布局。页面标题“设置”；左侧设置分类；主区显示个人资料、账号、目标岗位、偏好、通知、隐私、AI 个性化和数据导出；使用开关、选择器、输入框和保存反馈；危险操作“退出登录”放在独立低强调区域。

## 生成提示词模板

```text
Use case: ui-mockup
Asset type: full desktop SaaS dashboard reference
Primary request: Generate the standalone {PAGE_NAME} page for the Chinese product “职前副本 AI”.
Style: youthful, polished AI career-growth SaaS; restrained violet; high information clarity.
Composition: 1448x1086 desktop canvas, fixed 224px sidebar, top status bar, dense but breathable card grid.
Constraints: preserve Chinese labels, realistic interactive controls, consistent design system, no browser chrome, no watermark, no page collage.
```

