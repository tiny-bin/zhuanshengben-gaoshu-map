# AGENTS.md — 专升本高数学习网站

## 项目概览
静态学习工具：把专升本高等数学做成一章一图、概念用推导链条串联的学习网站。面向中文用户，无后端、免登录、本地存进度，可分享给同学。

## 常用命令
- 安装依赖：`npm install`
- 启动开发服务器：`npm run dev`
- 类型检查：`npm run typecheck`（`tsc --noEmit`）
- 代码检查：`npm run lint`（`eslint .`）
- 构建：`npm run build`
- 预览构建产物：`npm run preview`

## 技术栈与约定
- Vite + React + TypeScript（严格类型，禁用 `any`）
- 地图：`@xyflow/react`（React Flow）
- 公式：`KaTeX`，数学内容一律用 LaTeX 字符串
- 进度持久化：`localStorage`
- 包管理器：npm（锁定 `package-lock.json`）

## 内容模型（单一事实来源）
- `Chapter → Concept → { Formula | DerivationEdge | ProblemType }`
- `DerivationEdge`：概念间推导链（derives / prerequisite / application）
- `ProblemType`：决策树，由 `DecisionNode`（test 分支 / action / result）构成，用于「A 方案不行跳 B 方案」的解题路径
- 内容数据放在 `src/content/`，用带类型的 TS 模块，接口定义在 `src/content/types.ts`；加内容只改数据，不碰渲染层

## 架构与编码标准
- 组件小而清晰，优先函数式与声明式，避免 class
- 状态分层：UI 临时状态留在组件内；进度/复习状态用 `localStorage`，通过 `src/lib/progress.ts` 封装读写
- 前后端无接口（纯静态）；数据契约以 `types.ts` 为唯一事实来源
- 注释解释「为什么」，对 public 函数、复杂业务逻辑用 JSDoc；中文界面文案，英文标识符/文件名

## 视觉与交互
- 「安静、适合长时间刷题」方向；桌面为地图 + 右侧详情面板，移动端为全屏地图 + 底部抽屉
- 交付前做桌面/移动端截图自查，检查图表渲染、公式显示、文字溢出/遮挡

## 安全
- 不硬编码凭据；纯静态站点无外部网络数据请求，trusted content 仅来自本地 `src/content/`

## 部署
- 生产站点部署到 Netlify，源码仓库托管在 GitHub；推送到 `main` 分支自动触发生产构建
- 正式站：https://zhuanshengben-gaoshu.netlify.app； GitHub 仓库：https://github.com/zbw4588/zhuanshengben-gaoshu-map
- Netlify GitHub App 负责拉取私有仓库并监听 `main` 推送，不依赖本地开发服务器或本地 Netlify CLI 登录
- Netlify 配置以根目录 `netlify.toml` 为单一事实来源：构建命令 `npm run build`，发布目录 `dist`，Node.js 22
- `dist/` 是构建产物，不提交到 Git；Netlify 在每次部署时重新生成
- 发布前必须先通过 `npm run typecheck`、`npm run lint`、`npm run build`
