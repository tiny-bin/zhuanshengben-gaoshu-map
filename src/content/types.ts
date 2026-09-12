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

export interface Concept {
  id: string
  chapterId: string
  title: string
  summary: string
  formulas: Formula[]
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
