import type { DecisionNode, ProblemType } from '../content/types'

/** Follow the recommended main path (test -> yes, action -> next). */
export function resolveTree(start: string, nodes: Record<string, DecisionNode>): string[] {
  const path: string[] = []
  const seen = new Set<string>()
  let id: string | undefined = start
  while (id && !seen.has(id)) {
    seen.add(id)
    const node: DecisionNode | undefined = nodes[id]
    if (!node) break
    path.push(id)
    if (node.type === 'test') id = node.yes
    else if (node.type === 'action') id = node.next
    else id = undefined
  }
  return path
}

/** Numbered outline of the recommended solution path for a problem. */
export function describePath(p: ProblemType): string[] {
  return resolveTree(p.start, p.nodes).map((id) => {
    const n = p.nodes[id]
    if (!n) return id
    if (n.type === 'result') return n.text
    if (n.type === 'action') return n.text
    return `判断：${n.prompt}`
  })
}

export function getNode(p: ProblemType, id: string): DecisionNode | undefined {
  return p.nodes[id]
}
