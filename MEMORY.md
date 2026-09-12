# MEMORY.md — 长期项目上下文

## 项目目标
解决专升本高数「学多、学久、前面就忘」：全局地图 + 推导链条 + 经典题型决策树，既是查询也是复习工具。

## 关键决策
- 形态定为可分享静态网页（无后端/免登录/本地进度），选型 Vite + React + TS + React Flow + KaTeX。
- 内容用结构化 typed schema（`src/content/types.ts`），不做硬编码 HTML，加内容只改数据。
- v1 内容覆盖浙江专升本全部 6 章：函数极限连续 / 一元微分 / 一元积分 / 无穷级数 / 常微分方程 / 向量代数与空间解析几何。
- 进度 v1 仅做「已掌握/待复习」本地标记；SRS 记忆热力 + 每日推题延后二期，v1 不做。

## 目录与内容位置
- 内容接口：`src/content/types.ts`
- 章节内容：`src/content/data/`（按章节拆 TS 模块：`limits.ts`/`derivatives.ts`/`integrals.ts`/`series.ts`/`ode.ts`/`vectorGeometry.ts`）
- 章节注册与推导边：`src/content/data/index.ts`
- 进度封装：`src/lib/progress.ts`
- 地图视图：`src/components/GraphMap.tsx` 等
- 设计文档：`PRD.md`、`Tech-Spec.md`

## 踩坑 / 注意
- 没有从 `~/.codex/templates/` 生成启动模板（该目录为空），`AGENTS.md`、`MEMORY.md` 为新建。
- npm 为包管理器，重装依赖用 `npm install`。
- 决策树节点 ID 若含连字符，TS 对象字面量键必须加引号。
- React Flow v12：`ConceptNodeData` 需要 `[key: string]: unknown` 索引签名；`setCenter` 需第三个参数 `{ zoom: 1 }`；MiniMap 的 `nodeColor` 用 `(n.data as unknown as ConceptNodeData).color`。
- KaTeX 字符串用 `String.raw` 避免反斜杠转义问题。
- **本环境 `apply_patch` 的 `update_file` 上下文匹配全部失败（含纯 ASCII 文件），但 `add_file` 可用**；对含中文路径的仓库改文件改用 PowerShell `[System.IO.File]::WriteAllText` 整文件重写，保持 UTF-8 无 BOM。
- 本环境对 `src/content/data/*.ts` 的 `apply_patch` `update_file` 可正常命中；若某次上下文匹配失败，退回 PowerShell `[System.IO.File]::WriteAllText` 整文件重写，保持 UTF-8 无 BOM。

## v1 完成情况（2026-08-25）
- 已实现全部 6 章：第 1 章 7 概念、第 2 章 9、第 3 章 7、第 4 章 6、第 5 章 7、第 6 章 4，共 40 个概念节点，含公式 / 推导边 / 经典题型 / 解题决策树。
- 生产校验全部通过：`typecheck`、`lint`、`build`（仅 chunk 体积警告）、Playwright QA（6 章地图节点、公式、决策树分支均渲染，无错误 / 无警告 / 无横向溢出）。
- 预览服务：`npm run preview -- --port 4173 --host 127.0.0.1`，访问 `http://127.0.0.1:4173/`。
- 第 1–3 章内容已按用户提供的浙江考点小标题落地；第 4–6 章内容为按标准浙江专升本大纲结构起草并接线，**用户尚未提供第 4–6 章考点小标题**，后续收到后按实际考点微调覆盖即可。

## 非机密运维备注
- 沙箱内跑 `build` / `preview` / QA 需提权；失败命令重跑时用 `require_escalated`。
- 2026-09-12：源码仓库迁至 GitHub `main` 分支：https://github.com/zbw4588/zhuanshengben-gaoshu-map
- 2026-09-12：正式 Netlify 项目为 GitHub 账号关联的 `zhuanshengben-gaoshu`，通过 Netlify GitHub App 持续部署；推送到 `main` 自动生产构建，正式站：https://zhuanshengben-gaoshu.netlify.app
- 早先创建的 Netlify 项目 `zhuanshengben-gaoshu-map` 仅保留作备份，不再作为正式发布地址。
- 自动部署不依赖本地 Netlify CLI 登录或本地关联文件；仓库只保存 `netlify.toml`，不存凭据。
- `.gitignore` 已忽略 `node_modules/`、`dist/`、`*.local`、`.DS_Store`、`.netlify`。

## 迭代备注
- 用户反馈后：地图改为按章节独立树状图（每章一个图，跨章依赖只在详情面板展示，不混入单章地图）；知识卡片设为不可拖动，仅点按查看详情（消除拖拽灵敏度过高的问题）。
- 2026-08-26：应要求，在第六章「平面及其方程」的公式列表末尾新增「两平行平面间距离」公式 `d=|D1-D2|/√(A²+B²+C²)`（新增后平面节点共 7 个公式）；已重建 dist 并通过 typecheck/build/QA 与节点级浏览器验证。
