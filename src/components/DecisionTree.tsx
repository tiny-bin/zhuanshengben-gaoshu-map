import type { DecisionNode, ProblemType } from '../content/types'

type NodeFlowProps = {
  id: string
  problem: ProblemType
  depth: number
}

function NodeFlow({ id, problem, depth }: NodeFlowProps) {
  const node: DecisionNode | undefined = problem.nodes[id]
  if (!node) return null

  if (node.type === 'result') {
    return (
      <div className="dt-node dt-result">
        <span className="dt-kind">结论</span>
        <div className="dt-text">{node.text}</div>
      </div>
    )
  }

  if (node.type === 'action') {
    return (
      <div className="dt-node dt-action">
        <span className="dt-kind">步骤</span>
        <div className="dt-text">{node.text}</div>
        {node.next ? <NodeFlow id={node.next} problem={problem} depth={depth + 1} /> : null}
      </div>
    )
  }

  // test node: branch into A (yes) and B (no)
  return (
    <div className="dt-node dt-test">
      <span className="dt-kind">判断</span>
      <div className="dt-text">{node.prompt}</div>
      <div className={depth === 0 ? 'dt-branches' : 'dt-branches dt-branches-stacked'}>
        <div className="dt-branch">
          <div className="dt-branch-head dt-a">A 路线 · 符合</div>
          <NodeFlow id={node.yes} problem={problem} depth={depth + 1} />
        </div>
        <div className="dt-branch">
          <div className="dt-branch-head dt-b">B 路线 · 不符合</div>
          <NodeFlow id={node.no} problem={problem} depth={depth + 1} />
        </div>
      </div>
    </div>
  )
}

export default function DecisionTree({ problem }: { problem: ProblemType }) {
  return (
    <div className="dt">
      <p className="dt-summary">{problem.summary}</p>
      <div className="dt-flow">
        <NodeFlow id={problem.start} problem={problem} depth={0} />
      </div>
    </div>
  )
}
