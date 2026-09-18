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
- `apply_patch` 的 `update_file` 对 `src/content/data/*.ts`、`src/content/data/index.ts`、`MEMORY.md` 可正常命中；若某次上下文匹配失败，退回 PowerShell `[System.IO.File]::WriteAllText` 整文件重写，保持 UTF-8 无 BOM。
- 公式 LaTeX 里的反斜杠在写 patch 时需在 JSON 中转义为 `\\`，落到文件里仍是单个反斜杠。

## v1 完成情况（2026-08-25）
- 已实现全部 6 章：第 1 章 7 概念、第 2 章 9、第 3 章 7、第 4 章 7、第 5 章 7、第 6 章 4，共 41 个概念节点，含公式 / 推导边 / 经典题型 / 解题决策树。
- 生产校验全部通过：`typecheck`、`lint`、`build`（仅 chunk 体积警告）、Playwright QA（6 章地图节点、公式、决策树分支均渲染，无错误 / 无警告 / 无横向溢出）。
- 预览服务：`npm run preview -- --port 4173 --host 127.0.0.1`，访问 `http://127.0.0.1:4173/`。
- 第 1–3 章内容已按用户提供的浙江考点小标题落地；第 4–6 章内容为按标准浙江专升本大纲结构起草并接线，**用户尚未提供第 4–6 章考点小标题**，后续收到后按实际考点微调覆盖即可。

## 非机密运维备注
- 2026-09-17 起本机环境不再限制文件系统沙箱，`build` / `preview` / QA（`node scripts/qa.mjs`）可直接运行；若重新出现沙箱报错再改用提权。
- 2026-09-12：源码仓库迁至 GitHub `main` 分支：https://github.com/zbw4588/zhuanshengben-gaoshu-map
- 2026-09-12：正式 Netlify 项目为 GitHub 账号关联的 `zhuanshengben-gaoshu`，通过 Netlify GitHub App 持续部署；推送到 `main` 自动生产构建，正式站：https://zhuanshengben-gaoshu.netlify.app
- 早先创建的 Netlify 项目 `zhuanshengben-gaoshu-map` 仅保留作备份，不再作为正式发布地址。
- 自动部署不依赖本地 Netlify CLI 登录或本地关联文件；仓库只保存 `netlify.toml`，不存凭据。
- `.gitignore` 已忽略 `node_modules/`、`dist/`、`*.local`、`.DS_Store`、`.netlify`。

## 迭代备注
- 用户反馈后：地图改为按章节独立树状图（每章一个图，跨章依赖只在详情面板展示，不混入单章地图）；知识卡片设为不可拖动，仅点按查看详情（消除拖拽灵敏度过高的问题）。
- 2026-08-26：应要求，在第六章「平面及其方程」的公式列表末尾新增「两平行平面间距离」公式 `d=|D1-D2|/√(A²+B²+C²)`（新增后平面节点共 7 个公式）；已重建 dist 并通过 typecheck/build/QA 与节点级浏览器验证。
- 2026-09-17：新增知识点「泰勒公式与麦克劳林公式」（8 公式 + 1 决策树），含泰勒公式 / 麦克劳林公式及其拉格朗日余项，以及 eˣ、sin x、cos x、ln(1+x) 的带余项展开。
- 2026-09-17：修复渲染层缺口 —— `Formula.note` 在 `types.ts` 里有定义但 `ConceptPanel.tsx` 从未渲染，导致全部 11 处 note（含第四章泰勒级数、交错级数等）一直不可见；现与 `conditions` 同样以 `.formula-cond` 样式展示。
- 已知未改：决策树嵌套到第 3–4 层时列宽很窄、文字逐字换行（洛必达、凹凸等旧题同样）。根因是 `src/styles.css` 的 `.dt-branches` 用 `grid-template-columns: 1fr 1fr` 逐层对半、`.dt-branch` 又设了 `min-width: 0`，面板宽度被逐层切分；要改善需改 DecisionTree 布局（深层改纵向堆叠或设最小宽度）。
- 2026-09-18：经用户确认，泰勒 / 麦克劳林公式归属第四章无穷级数。概念定义已从 `derivatives.ts` 移到 `series.ts`，ID 由 `c2-taylor` 改为 `c4-taylor`（题型 Id 同步改为 `c4-taylor-limit`）；章内推导边改为 `c4-power` → `c4-taylor` → `c4-expansion`（原 `c4-power` → `c4-expansion` 关系由这条链传递保留），跨章前置保留 `c2-higher`、`c2-mvt` → `c4-taylor`。
- 布局已知问题：`layoutChapter` 按最长路径分层、同行且跳层的长连线不做避让，全站现有 5 处连线从节点卡片下穿过（第三章 2、第四章 2、第六章 1）。检测时需用 `getScreenCTM` 把路径采样点换算到屏幕坐标；直接拿 `getPointAtLength` 的点跟节点 `getBoundingClientRect` 比会误报“无重叠”。
- 2026-09-18：第二章「曲线的凹凸性与拐点」原本只有一条占位文字 `\text{水平/垂直/斜渐近线}`，不是可用公式。已换成三条判定式：垂直 x=x₀ 由 lim f(x)=∞ 判定、水平 y=b 由 lim f(x)=b 判定（x→+∞ 与 x→−∞ 分别求）、斜 y=kx+b 由 k=lim f(x)/x（k 存在且 k≠0）与 b=lim [f(x)−kx] 判定；同时新增题型「求曲线的渐近线」决策树（4 分支，已把求 b 那步并进结论以减少一层嵌套），summary 也补上了渐近线说明。斜渐近线公式改为 KaTeX 两行 `aligned`，避免桌面详情面板内部横向溢出；并移除旧边 `c2-derivative → c4-expansion`，高阶导数跨章依赖统一落在 `c2-higher → c4-taylor`。
- 2026-09-18：新增全局公式检索。`src/lib/formulaSearch.ts` 在模块加载时建立静态索引，按公式名、章节、知识点、条件/备注和 LaTeX 原文匹配；`FormulaSearch.tsx` 在顶栏展示 KaTeX 结果预览，点击后切换章节、打开知识点并将 `focusFormulaId` 传给 `ConceptPanel` 定位高亮。Playwright QA 已覆盖中文名称和 LaTeX 关键词、桌面/移动端、详情抽屉内的搜索层级；`scripts/qa.mjs` 已加入对应断言。
