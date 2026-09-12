import { useEffect, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react'
import type { Node, Edge, NodeProps, NodeTypes } from '@xyflow/react'
import type { Concept, EdgeKind, DerivationEdge } from '../content/types'
import type { ProgressState } from '../lib/progress'
import { courseData, conceptsOfChapter, getChapter } from '../content/data'

const NODE_WIDTH = 210
const NODE_HEIGHT = 70
const X_STEP = 320
const Y_STEP = 130

export type ConceptNodeData = {
  concept: Concept
  color: string
  chapterTitle: string
  isMastered?: boolean
  [key: string]: unknown
}
export type ConceptFlowNode = Node<ConceptNodeData, 'concept'>

const CHAPTER_COLORS = ['#3b7ca8', '#c35b96', '#3f9d7a', '#a8643f', '#6d7ac0', '#b06a3f']

function chapterColor(chapterId: string): string {
  const chapter = courseData.chapters.find((c) => c.id === chapterId)
  const idx = (chapter?.order ?? 1) - 1
  return CHAPTER_COLORS[idx % CHAPTER_COLORS.length]
}

function edgeColor(kind: EdgeKind): string {
  if (kind === 'derives') return '#94a3b8'
  if (kind === 'application') return '#d9a15a'
  return '#cbd5e1'
}

function ConceptNode({ data }: NodeProps<ConceptFlowNode>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="cf-node" style={{ borderLeftColor: data.color }}>
        <span className="cf-chapter">{data.chapterTitle}</span>
        <span className="cf-title">{data.concept.title}</span>
        <span className="cf-badges">
          <span className="cf-count">{data.concept.formulas.length} 公式</span>
          <span className="cf-count">{data.concept.problemTypes.length} 题型</span>
          {data.isMastered ? <span className="cf-mastered">✓</span> : null}
        </span>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  )
}

const nodeTypes: NodeTypes = { concept: ConceptNode }

function layoutChapter(
  concepts: Concept[],
  edges: DerivationEdge[],
): Record<string, { x: number; y: number }> {
  const ids = new Set(concepts.map((c) => c.id))
  const predecessors = new Map<string, string[]>()
  concepts.forEach((c) => predecessors.set(c.id, []))
  edges.forEach((e) => {
    if (ids.has(e.from) && ids.has(e.to)) predecessors.get(e.to)?.push(e.from)
  })

  const depthMemo = new Map<string, number>()
  const depthOf = (id: string): number => {
    const cached = depthMemo.get(id)
    if (cached !== undefined) return cached
    const incoming = predecessors.get(id) ?? []
    const depth = incoming.length === 0 ? 0 : Math.max(...incoming.map(depthOf)) + 1
    depthMemo.set(id, depth)
    return depth
  }

  const byDepth = new Map<number, string[]>()
  concepts.forEach((c) => {
    const depth = depthOf(c.id)
    const bucket = byDepth.get(depth)
    if (bucket) bucket.push(c.id)
    else byDepth.set(depth, [c.id])
  })

  const positions: Record<string, { x: number; y: number }> = {}
  byDepth.forEach((arr, depth) => {
    arr.forEach((id, index) => {
      positions[id] = { x: 40 + depth * X_STEP, y: 40 + index * Y_STEP }
    })
  })
  return positions
}

function buildChapterNodes(chapterId: string): ConceptFlowNode[] {
  const chapter = getChapter(chapterId)
  const concepts = conceptsOfChapter(chapterId)
  const chapterEdges = courseData.edges.filter(
    (e) => concepts.some((c) => c.id === e.from) && concepts.some((c) => c.id === e.to),
  )
  const positions = layoutChapter(concepts, chapterEdges)
  return concepts.map((c) => ({
    id: c.id,
    type: 'concept',
    position: positions[c.id],
    data: {
      concept: c,
      color: chapterColor(c.chapterId),
      chapterTitle: chapter?.title ?? '',
      isMastered: false,
    },
  }))
}

function buildChapterEdges(chapterId: string): Edge[] {
  const ids = new Set(conceptsOfChapter(chapterId).map((c) => c.id))
  return courseData.edges
    .filter((e) => ids.has(e.from) && ids.has(e.to))
    .map((e) => ({
      id: `${e.from}->${e.to}`,
      source: e.from,
      target: e.to,
      label: e.label,
      type: 'smoothstep',
      animated: e.kind === 'derives',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: edgeColor(e.kind), strokeWidth: 1.5 },
      labelStyle: { fontSize: 11, fill: '#6b7280', backgroundColor: '#ffffff' },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
    }))
}

type MapProps = {
  selectedId: string | null
  progress: ProgressState
  onSelect: (conceptId: string) => void
  activeChapterId: string
  onChapterChange: (chapterId: string) => void
}

function MapInner({ selectedId, progress, onSelect, activeChapterId, onChapterChange }: MapProps) {
  const initialNodes = useMemo(() => buildChapterNodes(activeChapterId), [activeChapterId])
  const initialEdges = useMemo(() => buildChapterEdges(activeChapterId), [activeChapterId])
  const [nodes, setNodes, onNodesChange] = useNodesState<ConceptFlowNode>(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const { setCenter } = useReactFlow()

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === selectedId,
        data: { ...n.data, isMastered: progress[n.id] === 'mastered' },
      })),
    )
  }, [selectedId, progress, setNodes])

  useEffect(() => {
    if (!selectedId) return
    const match = nodes.find((n) => n.id === selectedId)
    if (match) {
      setCenter(match.position.x + NODE_WIDTH / 2, match.position.y + NODE_HEIGHT / 2, { zoom: 1 })
    }
  }, [selectedId, nodes, setCenter])

  const legend = useMemo(() => {
    const chapter = getChapter(activeChapterId)
    return (
      <div className="map-legend">
        <p className="legend-title">{chapter?.title}</p>
        {chapter?.description ? <p className="legend-desc">{chapter.description}</p> : null}
        <div className="legend-row">
          <span className="legend-line" style={{ background: '#94a3b8' }} />
          推导
        </div>
        <div className="legend-row">
          <span className="legend-line" style={{ background: '#cbd5e1' }} />
          前提
        </div>
        <div className="legend-row">
          <span className="legend-line" style={{ background: '#d9a15a' }} />
          应用
        </div>
        <p className="legend-note">跨章依赖已隔离，单章内查看</p>
      </div>
    )
  }, [activeChapterId])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={(_, node) => onSelect(node.id)}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      minZoom={0.25}
      maxZoom={2}
      nodesDraggable={false}
      nodesConnectable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={18} size={1.4} color="#d4d8df" />
      <Controls position="bottom-right" />
      <MiniMap
        position="top-right"
        nodeColor={(n) => (n.data as unknown as ConceptNodeData).color}
        maskColor="rgba(255,255,255,0.6)"
      />
      <Panel position="top-center">
        <div className="chapter-tabs">
          {courseData.chapters.map((ch) => (
            <button
              key={ch.id}
              type="button"
              className={`chapter-tab${ch.id === activeChapterId ? ' active' : ''}`}
              style={ch.id === activeChapterId ? { borderColor: chapterColor(ch.id) } : undefined}
              onClick={() => onChapterChange(ch.id)}
            >
              {ch.title}
            </button>
          ))}
        </div>
      </Panel>
      <Panel position="bottom-left">{legend}</Panel>
    </ReactFlow>
  )
}

export default function GraphMap(props: MapProps) {
  return (
    <ReactFlowProvider>
      <MapInner {...props} />
    </ReactFlowProvider>
  )
}
