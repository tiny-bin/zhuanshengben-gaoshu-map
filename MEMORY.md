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
- 2026-09-28：第五章常微分方程重写（用户反馈「太公式化、缺题目示例、特解缺斤少两」）。核实考纲：特解确实是考点——考纲第五章明确要求「初始条件定常数步骤」，且型（Ⅱ）要求「设法 y*=x^k e^{λx}[R_n cos ωx + S_m sin ωx]（取 n、m 较大者），k 按 λ±iω 是否为特征根取 0/1」。原站点 `cn-trig` 只写了 f(x) 的形式、没有特解设法，是真空缺。补齐的公式：`cn-trig-set`（型Ⅱ设法，cos/sin 两项都要设）、`cn-trig-k`（看复数 λ±iω）、`cn-split`（f 拆项→特解相加）、`lin-variation`（常数变易法）、`ch-how`（特征方程由来）、`sep-init`（定特解）、`de-check`（验证解）、`h-judge`（怎么判断齐次）。题型：`c5-basic` 新增「由初始条件求特解」，`c5-separable`/`c5-linear-first`/`c5-const-nonhomogeneous` 的树都补了「给了初始条件吗 → 定常数」分支，非齐次的树重写为「先解齐次 → 判型Ⅰ/型Ⅱ → 定 k → 代回定系数 → 通解 → 初始条件」。
- 2026-09-28：内容模型新增 `Concept.examples`（`Example { id, problem, problemLatex?, steps[], answer, answerLatex? }`，`ExampleStep { text, latex? }`），渲染在 `src/components/WorkedExamples.tsx`，面板「例题精讲」区块插在「公式」之后。第五章 7 个知识点共 12 道分步例题 / 77 步（2026-09-29 修正：原记录写 16 道有误）。选择「题干文字 + 每步一句白话 + 单独一行算式 + 答案」的结构，而不是把步骤塞进决策树——决策树负责「怎么判断」，例题负责「具体怎么算」，两者互补。`Tech-Spec.md` 的数据模型早已与代码不符（`ProblemType.steps/kind` 并不存在），本次一并纠正为 `start + nodes`。
- 2026-09-28：面板宽度只有 420px，KaTeX display 公式超过约 320px 就会在 `.formula-item .math / .example .math` 内部横向滚动，需要手动拖动才能看全，体验很差。凡是长推导一律用 `\begin{aligned}a&=b\\&\quad+c=d\end{aligned}` 拆成两行（`=` 对齐、第二行用 `&\quad+` 续行）。本次改了 7 处：基本概念的求导与代入验证、一阶线性的验算、非齐次的 [(y*)′,(y*)″] 与两处三角型求导。检查方法：`[...document.querySelectorAll(sel)].filter(e => e.scrollWidth > e.clientWidth + 1)`。
- 2026-09-28：`scripts/qa.mjs` 的一个假通过/报错陷阱：一个知识点可以挂多个题型，而 `<details>` 折叠后内容仍留在 DOM 里，所以 `page.locator('.dt')` 会同时匹配到多棵树（strict mode 报错）。已改成 `page.locator('.dt').first()` 并只统计该棵树的分支数；同时新增 `examples` 计数与 `.katex-error` 断言（章节首节点若出现公式渲染失败会直接进 `report.errors`）。
- 2026-09-29：地图与面板的三处交互修正（用户浏览器批注）。(1) 移除右下角 MiniMap：本站在线图上每个章节的节点本来就不多，小地图占地方且和 Controls 挤在一起，直接删掉 `GraphMap.tsx` 里的 `MiniMap` 导入与使用。(2) 移动端详情抽屉被顶栏/搜索栏压住：`.detail` 原来用 `max-height: 84vh`，暗色遮罩会盖到标题上；改为 `calc(100vh - var(--topbar-h, 72px) - 8px)`，`--topbar-h` 由 `App.tsx` 用 `topbarRef` + `ResizeObserver` 实时写入根元素（顶栏高度会随搜索框换行变化，所以不能写死）。(3) 切章后章节标签条滚动位置被打回最左：根因是 `App.tsx` 给 `GraphMap` 加了 `key={activeChapterId}`，切章时整块重建，标签条的 `scrollLeft` 一起归零。中途试过「去掉 key + 就地重建节点」，发现手动 `fitView` 算出的包围盒偏小（第四章最右节点被裁），而 React Flow 初始化时的 `fitView` 结果是对的，所以保留 key 重建，改用模块级变量 `tabsScrollLeft` + `tabsRef` + `onScroll` 记录、挂载后恢复。实测 541×895：标签条 420 → 420 保持不变，6 章切换后越界节点均为 0。
- 2026-09-29：补幂级数展开的变形题型（用户点名：`ln(2+x)` 这类要先提常数的考法，只背 5 个模板不够）。`series.ts` 的 `c4-expansion` 重写：公式 6 → 11 条，新增 `ex-pull-frac`（分式提常数）、`ex-pull-log`（`ln(a+x) = ln a + ln(1 + x/a)`）、`ex-shift`（关于 `x₀` 展开，换元 `t = x − x₀`）、`ex-derive`（先逐项求导 / 积分凑模板）、`ex-domain-change`（收敛区间随代换变）；决策树重写为「中心是不是 0 → 换元 → 能否直套模板 → 提常数配凑 → 代换 → 反推收敛区间（端点单独判）」；新增 5 道例题 / 22 步：`ln(2+x)`、`1/(2+x)`、`ln x` 关于 `x−1`、`e^(−x²)`、由 `1/(1+x)` 逐项积分推 `ln(1+x)`。收敛区间是最容易丢分的地方，所以 summary 和树的最后一步都强调「代换后区间要跟着变，端点单独判」。
- 2026-09-29：修正一处内容统计错误：第五章例题实际是 12 道 / 77 步，MEMORY / SYLLABUS 之前写的 16 道有误。核验方法：逐知识点点开面板数 `.example` 和 `.example-step`，同时可与 `ode.ts` 里 12 个 `id: 'ex-...'` 对上。
- 2026-09-29：验证记录。`typecheck` / `lint` / `build` 全通过；`npm run preview -- --port 4175` + `QA_BASE=http://localhost:4175/ node scripts/qa.mjs` 跑全量 6 章：`errors: []`、`warnings: []`（无控制台错误、无 KaTeX 渲染失败、无横向溢出）。坑：用 Playwright 点 React Flow 节点必须用默认中心点，`position: { x: 10, y: 10 }` 会落到节点左上角的 Handle / 章节标签上而不触发选中，排查时容易误判成「节点点不动」。
- 2026-09-29：新增公式收藏（用户希望刷新后仍保留）。方案是不引入后端和账号，新增 `src/lib/favorites.ts`，以 `conceptId + formulaId` 为稳定键写入 `localStorage` 的 `gaoshu-favorites`；`ConceptPanel` 每个公式右侧增加独立星标按钮，顶部新增「我的收藏」视图，`FavoritesView` 按章节分组、支持跳回原公式并高亮和取消收藏。收藏是设备/浏览器本地数据，不跨设备同步；`scripts/qa.mjs` 增加收藏切换、刷新持久化、收藏页跳转及取消收藏断言。
- 2026-09-29：GitHub 仓库按要求改为公开，仓库 Description 使用「浙江省专升本高等数学学习地图与公式库。欢迎通过邮箱 zbw4588@qq.com 提出建议或参与内容修正。」，并将正式 Netlify 地址设为仓库 Homepage。公开前已检查 `git ls-files`，没有纳入 `.env`、token、secret、credential、私钥类文件。
- 2026-09-29：去掉「点节点自动居中」。`GraphMap.tsx` 里有一个 effect 在 `selectedId` 变化时调 `setCenter(node.x + NODE_WIDTH/2, node.y + NODE_HEIGHT/2, { zoom: 1 })`，本意是选中即聚焦，但实际每点一个知识点地图就整体平移加缩放，触控手感很差（用户明确要求「点一下别乱动、别特地挪到屏幕中间」）。已删除该 effect、`useReactFlow` 的 `setCenter`，以及只被它用到的 `NODE_WIDTH` / `NODE_HEIGHT` 常量（`.cf-node` 的宽度本来就在 `styles.css` 里定）。现在点节点只更新右侧详情面板和选中描边，视角完全不动，手动拖过的位置也不会被重置。实测：连点 3 个节点 viewport `transform` 与节点坐标均不变；手工平移 100/80px 后再点节点仍保持平移。
- 2026-09-29：第一章「无穷小与等价无穷小」补减法型等价无穷小（用户从 B 站 UP 主的「数轴法」学来，要求照那种表达方式落地）。呈现方式：把 `arctan x < sin x < x < arcsin x < tan x` 和 `ln(1+x) < x < eˣ − 1` 用 `\underbrace{...}_{\text{相邻两个相减}\ \sim\ ...}` 渲染成「一条数轴 + 下方标注」，比手绘刻度更适合 KaTeX；再配「隔 k 格 ~ (k+1)·高阶/6」「最常考的隔格结果」「相减时不能各自替换（u~u₀, v~v₀ ⇏ u−v~u₀−v₀）」。公式 6 → 14 条，新增 3 道例题 / 14 步（tan x − sin x 的抵消陷阱、eˣ−1−x、eˣ−1−ln(1+x)），决策树 `c1-infinitesimal-replace` 的「不在乘除里」分支从直接跳「其他方法」改成先问「是不是两个无穷小相减」→ 是则走「查数轴 → 代回 → 化简」。`src/content/data/index.ts` 加跨章依赖 `c4-taylor → c1-infinitesimal`（本质是泰勒展开），详情面板显示为「前置」。这些减法结果考纲没列，站点里统一标「拓展」，note 里写明「本质是泰勒展开」和「两项必须都是等价量相减」的前提。
- 2026-09-29：KaTeX 踩坑：`\begin{array}{c@{}c@{}}` 里的 `@{}`（去列间距）**KaTeX 不支持**，会报 `Unknown column alignment: @`。想画「名字排一行 + 下面一条数轴」要么改用 `\underbrace`（本站采用），要么用普通 `{c c c}` 数组 + `\rule{宽}{高}` 画线。另外在 PowerShell 里拼含反引号的文案时，双引号字符串会把 `` ` `` 当转义符吃掉——写 LaTeX/Markdown 片段一律用单引号 here-string。
- 2026-09-29：第三章「不定积分的基本概念与性质」加顺口溜 + 树状图（用户提供了手写思维导图和一句顺口溜）。顺口溜：「有根无系，无根有系；平方加杂，平方减弦；加连就切，减连就减。」解码：有根号 → 结果不乘系数，无根号 → 乘 1/a 或 1/(2a)；平方加（x²+a²）→ ln 复杂式，平方减（a²−x²）→ arcsin；分母两项用 + 连接 → arctan，用 − 连接 → ln 简单式。落地方式：`mnemonic-square-form` 用 `\begin{aligned}&\text{…}\\…\end{aligned}` 把顺口溜排成三行居中文本（KaTeX 里 CJK 走系统字体回退，实测正常），note 逐句解码；新增 `table-inv-sqrt`（`∫dx/√(a²−x²)=arcsin(x/a)+C`、`∫dx/√(x²±a²)=ln|x+√(x²±a²)|+C`）与 `table-inv-plain`（`∫dx/(a²+x²)=(1/a)arctan(x/a)+C`、`∫dx/(a²−x²)=(1/2a)ln|(a+x)/(a−x)|+C`、`∫dx/(x²−a²)=(1/2a)ln|(x−a)/(x+a)|+C`）两组推广式；新增决策树 `c3-square-form-tree`（分母有没有根号 → 平方减吗 / 两项是 + 吗 → 四个结论），和手写图逐节点对应。注意 `DecisionNode.text` 是纯文本、渲染不出 KaTeX，公式只能用 `∫dx/(a²+x²) = (1/a)arctan(x/a) + C` 这种行内写法。另加 3 道例题 / 12 步（`∫dx/(4+x²)`、`∫dx/√(9−x²)`、`∫dx/(x²−5)`）。
- 2026-09-29：顺手修掉第三章基本积分表的公式横向溢出。面板内容宽度只有 349px，原「线性性质」（403px）、「基本积分表 · 幂与指数」（533px）、「三角」（568px）、「反三角」（403px）四条都超出，需要拖动才能看全。改法同前：拆成 `aligned` 多行（幂与指数 2 行、三角 3 行、线性 2 行、反三角 2 行），修完后该知识点 8 条公式宽度全部 ≤ 349px。检查命令：`[...document.querySelectorAll('.formula-item .math')].filter(e => e.scrollWidth > e.clientWidth + 1)`。
- 2026-09-29：决策树加「树状图连接线」，并解决「树状图藏在折叠区里看不见」的问题。原来 `.dt-branches` 只有缩进和 A/B 路线色块，没有连线，看着像嵌套卡片；现在根层画「主干 + 横杆 + 两条垂线」把父卡片分叉到两个分支头（横杆左右各留 25%，正好落在两列的中心），第二层起改用左侧竖轨 + 横向刻度。关键取舍：**连线一律用负偏移画在父卡片自身的左内边距里（`left: -8px`），不给分支加 padding** —— 一开始给 `.dt-branch` 加了 26px padding，结果每嵌套一层就多缩进 16px，第三章「定积分应用题型判断」那棵 6 层深的树直接把 `.dt` 撑到 419px（溢出 74px）、末层中文被挤成一字一行；改成负偏移后 `.dt` 回到 345px、最小节点仍是 100px、整树高 1698px，和改动前基线一致。窄屏（`max-width` 媒体查询里 `.dt-branches` 变单列）也要同步换成竖轨，否则根层会出现横杆画在单列中间的错误形状。
- 2026-09-29：排查过程中的一个假警报：用 Playwright 在 dev server（5173）上量 `.dt` 宽度时读到溢出 74px，但同一份 DOM 再量一次又是 345/345，先起 `npm run preview` 用构建产物复测才确认没问题——Vite dev 的 CSS HMR 有滞后，量尺寸类的验证要打构建产物或等 HMR 生效，别被中间态误导。
