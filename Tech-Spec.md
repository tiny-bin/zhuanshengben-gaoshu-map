# Tech-Spec — 专升本高数学习网站

## 1. 技术栈
- 构建：Vite + React 18 + TypeScript（strict）
- 地图：`@xyflow/react`（React Flow）
- 公式：`katex`（LaTeX 渲染）
- 持久化：`localStorage`（封装于 `src/lib/progress.ts`）
- 样式：CSS Modules / 全局 CSS（本项目用全局 CSS + CSS variables），不引入 UI 框架
- 包管理：npm

## 2. 内容数据模型（单一事实来源 `src/content/types.ts`）
```ts
interface Chapter { id: string; title: string; order: number; description?: string }
interface Formula { id: string; name: string; latex: string; conditions?: string; note?: string }
type EdgeKind = 'derives' | 'prerequisite' | 'application';
interface DerivationEdge { from: string; to: string; kind: EdgeKind; label?: string }
type DecisionNode =
  | { type: 'test'; id: string; prompt: string; yes: string; no: string }
  | { type: 'action'; id: string; text: string; next?: string }
  | { type: 'result'; id: string; text: string };
interface ProblemType {
  id: string; name: string; summary: string;
  steps: DecisionNode[]; start: string; kind: 'start' | 'test' | 'action' | 'result';
}
interface Concept {
  id: string; chapterId: string; title: string; summary: string;
  formulas: Formula[]; problemTypes: ProblemType[];
}
interface CourseData { chapters: Chapter[]; concepts: Concept[]; edges: DerivationEdge[] }
```
- 内容文件：`src/content/data/limits.ts`、`src/content/data/derivatives.ts` 及 `src/content/data/index.ts` 汇总。

## 3. 应用架构
### 视图
- 顶部：应用标题 + 章节切换（桌面）/ 汉堡菜单（移动）。
- 主视图 A：全局地图 `GraphMap.tsx`（`ReactFlow`），节点 = 概念（按章节分色），边 = 推导链；`MiniMap` + `Controls`。
- 主视图 B：章节索引 `ChapterIndex.tsx`（章节 → 知识点列表，可跳转到地图并选中）。
- 详情面板 `ConceptPanel.tsx`：展示公式（KaTeX）、推导周边、「经典题型」列表可展开为决策树 `DecisionTree.tsx`。
- 布局：桌面左侧为地图/索引，右侧为详情面板；移动端地图全屏，详情为底部抽屉（`<dialog>` / fixed bottom sheet）。

### 状态管理
- 本地 UI 状态（选中节点、当前章节、视图切换）留在 `App` / 组件内。
- 进度状态经 `useProgress()`（基于 `localStorage` + `useState`）读写，`src/lib/progress.ts` 提供 `getProgress/setMastered/getMastered`。
- 无全局状态库；通过 props 传递选中/进度。

### 数据流
- `CourseData` 静态导入 → 构建概念图节点/边 → 点节点 → 更新选中 → `ConceptPanel` 按 id 查询数据渲染。
- 进度：标记「已掌握/待复习」→ `localStorage` → 地图节点标色（mastered 勾选样式）。

## 4. 关键实现要点
- 决策树遍历实现：`src/lib/decision.ts` 提供 `resolveTree(startId, nodes)`，支持 test 分支跳转，据此渲染顺序步骤与 A→B 分支提示。
- KaTeX：用 `katex/dist/katex.min.css` + `katex.renderToString`，封装为 `<MathFormula>` 组件。
- 地图节点自定义类型 `graphNode`：显示概念名 + 章节色 + 掌握状态；`edges` 用 `derives` 主边 + 标签。
- 响应式断点：`< 768px` 移动端（底部抽屉），`>= 768px` 桌面（右侧面板）。

## 5. 文件结构
```
src/
  App.tsx
  main.tsx
  styles.css
  content/types.ts
  content/data/limits.ts
  content/data/derivatives.ts
  content/data/index.ts
  components/GraphMap.tsx
  components/ChapterIndex.tsx
  components/ConceptPanel.tsx
  components/DecisionTree.tsx
  components/MathFormula.tsx
  lib/progress.ts
  lib/decision.ts
```

## 6. 测试与验收
- `npm run typecheck`、`npm run lint`、`npm run build`。
- Playwright（或用截图工具）桌面 + 移动视口自测：地图渲染、KaTeX、点击节点、决策树、响应式。
- 内容抽查：极限/导数公式与推导、决策树判断逻辑对照教材。

## 7. 部署
- GitHub 仓库 `main` 分支连接 Netlify 生产环境，每次推送自动构建并发布。
- `netlify.toml` 定义构建命令 `npm run build`、发布目录 `dist` 和 Node.js 22。
- 部署产物为纯静态文件，无服务端环境变量、数据库或持久化服务。
- `localStorage` 中的学习进度保存在访问者浏览器本地，不随部署迁移或跨设备同步。
