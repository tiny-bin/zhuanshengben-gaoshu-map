export type EdgeKind = 'derives' | 'prerequisite' | 'application'

export interface Chapter {
  id: string
  title: string
  order: number
  description?: string
}

export interface Formula {
  id: string
  name: string
  latex: string
  conditions?: string
  note?: string
}

export type DecisionNode =
  | { type: 'test'; id: string; prompt: string; yes: string; no: string }
  | { type: 'action'; id: string; text: string; next?: string }
  | { type: 'result'; id: string; text: string }

export interface ProblemType {
  id: string
  name: string
  summary: string
  start: string
  nodes: Record<string, DecisionNode>
}

/** 例题精讲里的一步：一句口语化说明 + 可选的那一步算式。 */
export interface ExampleStep {
  text: string
  latex?: string
}

/**
 * 分步例题。用来把抽象的公式落到一道具体题上：
 * 先给题目，再按 1、2、3…… 拆成可跟读的步骤，最后单独给答案。
 */
export interface Example {
  id: string
  /** 题目文字（含具体数字 / 方程） */
  problem: string
  /** 题干里的方程，需要单独成行显示时用 */
  problemLatex?: string
  steps: ExampleStep[]
  /** 答案的口语化结论 */
  answer: string
  /** 答案的公式（行内显示） */
  answerLatex?: string
}

export interface Concept {
  id: string
  chapterId: string
  title: string
  summary: string
  formulas: Formula[]
  /** 分步例题；没有例题的知识点在面板上不渲染该区块 */
  examples?: Example[]
  problemTypes: ProblemType[]
}

export interface DerivationEdge {
  from: string
  to: string
  kind: EdgeKind
  label?: string
}

export interface CourseData {
  chapters: Chapter[]
  concepts: Concept[]
  edges: DerivationEdge[]
}
