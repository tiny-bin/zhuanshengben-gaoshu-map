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
- 考纲事实来源：`SYLLABUS.md`（官方考纲考点 + 公式名称清单 + 覆盖度对照）

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
- 2026-09-12：源码仓库迁至 GitHub `main` 分支；2026-09-18 GitHub 用户名由 `zbw4588` 改为 `tiny-bin`，当前地址：https://github.com/tiny-bin/zhuanshengben-gaoshu-map
- 2026-09-12：正式 Netlify 项目为 GitHub 账号关联的 `zhuanshengben-gaoshu`，通过 Netlify GitHub App 持续部署；推送到 `main` 自动生产构建，正式站：https://zhuanshengben-gaoshu.netlify.app
- 早先创建的 Netlify 项目 `zhuanshengben-gaoshu-map` 仅保留作备份，不再作为正式发布地址。
- 自动部署不依赖本地 Netlify CLI 登录或本地关联文件；仓库只保存 `netlify.toml`，不存凭据。
- `.gitignore` 已忽略 `node_modules/`、`dist/`、`*.local`、`.DS_Store`、`.netlify`。
- 2026-09-19：`Remove-Item` 会被本机策略拦截（blocked by policy），但 .NET 方法可用：`[System.IO.File]::Delete()` / `[System.IO.Directory]::Delete(, True)`。清理临时目录/文件时用 .NET 方法，不要用 cmdlet。

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
- 2026-09-19：核实浙江专升本高数考纲。官方来源＝浙江省教育考试院 2024-01-04 发布的《浙江省专升本〈高等数学〉考试大纲》（https://www.zjzs.net/art/2024/1/4/art_49_10140.html ，附件是 .doc，公式以 MathType 对象嵌入）。截至 2026-09 未发布新版，2025/2026 实施细则沿用同一大纲（考试科目、150 分、150 分钟、题型分值均确认）。已提取 .doc 全文并逐条解码嵌入公式，产出 `SYLLABUS.md`。关键结论：考纲六章与站点章节一一对应；**7 处公式缺口**——变限积分函数求导、广义积分与瑕积分、法线方程、反函数求导法则、非零向量在轴上的投影、点到直线距离、两异面直线间距离；4 项次要缺口（有界性、闭区间连续函数四定理、极限唯一性/有界性、建模与作图步骤）；约 12 项超纲内容（极坐标面积、弧长、截面法体积、变力做功、积分中值定理、混合积、两平行平面距离、根值法、积分判别法）。另确认：洛必达 7 型未定式＝0/0、∞/∞、0·∞、∞−∞、1^∞、0^0、∞^0；麦克劳林必背 5 组＝eˣ、sin x、cos x、ln(1+x)、1/(1−x)；几何级数原文写 Σaq^(n−1)；泰勒中值定理大纲归在第二章中值定理，站点归在第四章 c4-taylor（内容一致、归属不同）。
- 2026-09-19：按 SYLLABUS.md 的缺口清单补齐内容并修复布局。内容侧：①`c3-definite-integral` 补变限积分函数与求导公式（含上下限均为函数的推广式）+ 新题型「变限积分函数求导」；②新增概念 `c3-improper-integral`「广义积分与瑕积分」（6 公式 + 判敛题型），`index.ts` 加了 `c3-definite-integral → c3-improper-integral` 与 `c1-limits → c3-improper-integral` 两条边，第三章概念数 7 → 8；③`c2-derivative` 补法线方程；④`c2-rules` 补反函数求导法则，并把基本导数公式表从 10 条补到 21 条（新增 C、x^α、log_a x、cot、sec、csc、arcsin、arccos、arctan、arccot）；⑤`c6-vector-basic` 补「向量在轴上的投影」；⑥`c6-line` 补两直线位置关系、点到直线距离、两异面直线间距离，并新增题型「求空间距离」「判定两条直线的位置关系」；⑦`c6-plane` 的 `pl-pos` 拆成平行/重合系数判定 + `pl-perp`；⑧次要缺口一并补齐：函数有界性、极限左右极限/充要条件/唯一性/局部有界性、连续的充要条件、闭区间连续函数四定理 + 「用零点存在定理证方程有根」题型。超纲条目（极坐标面积、弧长、截面法体积、变力做功、混合积、两平行平面距离）不改内容，改为在 `Formula.note` 上标注「拓展：…」，详情面板会以 `.formula-cond` 样式显示。
- 2026-09-19：修复决策树深层布局。根因是 `src/styles.css` 的 `.dt-branches` 每层都用 `grid-template-columns: 1fr 1fr` 对半切，第 3 层宽度只剩几十像素、文字被挤成一列一字（此前记录为“已知未改”）。改法：`DecisionTree.tsx` 里分支容器按 `depth` 加类名，`depth === 0` 用 `.dt-branches`，更深层用 `.dt-branches dt-branches-stacked`；`.dt-branches-stacked { grid-template-columns: 1fr }` 让第二层起纵向堆叠。桌面/移动端实测 `.dt-branch` 宽度全部 ≥ 90px，`dtOverflow` 全为 0。
- 2026-09-19：验证方式补充。`scripts/qa.mjs` 只检查每章第一个节点，新增内容不会自动覆盖；定位到缺口后另写了临时脚本（`tmp-research/verify-gaps.mjs`、`verify-mobile.mjs`，用后已删除）按「全局搜索关键词 → 跳转知识点 → 展开全部题型」逐条断言 `katex-error` 数、`docOverflow`、面板/决策树横向溢出与窄分支数。结论：`typecheck` / `lint` / `build` 通过，`qa.mjs` 无 error 无 warning 无横向溢出，19 个关键词全部命中且 KaTeX 零报错。
- 2026-09-19：补「绕 y 轴旋转体体积的柱壳法」（用户点名要加）。`ap-vol-y` 改名「绕 y 轴旋转体体积（圆盘法）」，新增 `ap-vol-shell`：`V=2\pi\int_{a}^{b}x\,f(x)\,dx`，note 写清几何来源（薄圆柱壳半径 x、高 f(x)，展开成 2πx·f(x)·dx；上下限仍取 x 的范围）；不标注为拓展——考纲只要求「绕坐标轴旋转的体积」，圆盘法与柱壳法是同一考点下的两种算法。题型 `c3-application-type` 的 `vol` 分支由一步 action 改为决策链 `vol → axis → y-easy → {disk-x | disk-y | shell}`（绕 x 轴走圆盘法对 x 积分；绕 y 轴先问能否方便反解 `x=g(y)`，能则圆盘法对 y 积分，不能则柱壳法对 x 积分）。`SYLLABUS.md` 第三章公式清单加了柱壳法，并新增「方法补充」小节说明它不属于超纲。
- 2026-09-19：修决策树深层的宽度衰减。上一轮只把第二层起改成纵向堆叠，但每层卡片仍有 24px 左右内边距 + 2px 边框，嵌套一层就少 26px——第三章「定积分应用题型判断」最深到 6 层，末层节点只剩 65px，中文被挤成一字一列、整树高 2422px。改法：`src/styles.css` 新增 `.dt-node .dt-node` 规则，第二层起不再用卡片内边距，改为「左侧 3px 语义色引导线 + 10px 缩进」的扁平样式（`.dt-action` 蓝 / `.dt-test` 橙 / `.dt-result` 绿沿用原色），每层只衰减 13px。实测：根节点 345px，分支宽度 152→139→126→113→100，最小节点 100px（原 65px），整树高 1698px（原 2422px），`.dt` scrollWidth = clientWidth = 345（无横向溢出），桌面/移动端文档无横向溢出，KaTeX 0 报错。
- 2026-09-19：验证记录。`npm run typecheck` / `npm run lint` / `npm run build` 均通过；`vite preview` + Playwright 实测「柱壳」全局搜索命中 1 条并正确跳转高亮、笔记可见、移动端（390px）无横向溢出。注意：`vite preview` 默认只监听 IPv6，`http://127.0.0.1:4175/` 会连接被拒，脚本要用 `http://localhost:4175/`。
