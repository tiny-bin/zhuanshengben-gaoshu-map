import { useEffect } from 'react'
import { courseData, getConcept } from '../content/data'
import type { EdgeKind } from '../content/types'
import { describePath } from '../lib/decision'
import DecisionTree from './DecisionTree'
import MathFormula from './MathFormula'

const kindLabel: Record<EdgeKind, string> = {
  derives: '推导',
  prerequisite: '前置',
  application: '应用',
}

interface Props {
  conceptId: string
  mastered: boolean
  onToggleMastery: (conceptId: string) => void
  focusFormulaId?: string | null
  onClose?: () => void
}

export default function ConceptPanel({
  conceptId,
  mastered,
  onToggleMastery,
  focusFormulaId,
  onClose,
}: Props) {
  const concept = getConcept(conceptId)
  useEffect(() => {
    if (!concept || !focusFormulaId) return
    const targetId = formulaElementId(concept.id, focusFormulaId)
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [concept, focusFormulaId])

  if (!concept) {
    return (
      <div className="panel-empty">
        <p>请在地图上选择一个知识点。</p>
      </div>
    )
  }

  const outgoing = courseData.edges.filter((e) => e.from === concept.id)
  const incoming = courseData.edges.filter((e) => e.to === concept.id)

  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">{concept.title}</h2>
        <div className="panel-actions">
          <button
            className={`mastery-btn${mastered ? ' is-mastered' : ''}`}
            onClick={() => onToggleMastery(concept.id)}
            type="button"
          >
            {mastered ? '✓ 已掌握' : '标记掌握'}
          </button>
          {onClose ? (
            <button className="close-btn" onClick={onClose} type="button" aria-label="关闭">
              ✕
            </button>
          ) : null}
        </div>
      </div>

      <p className="panel-summary">{concept.summary}</p>

      <section className="panel-section">
        <h3>公式</h3>
        {concept.formulas.length === 0 ? (
          <p className="muted">暂无公式。</p>
        ) : (
          <ul className="formula-list">
            {concept.formulas.map((f) => (
              <li
                key={f.id}
                id={formulaElementId(concept.id, f.id)}
                className={`formula-item${focusFormulaId === f.id ? ' is-target' : ''}`}
              >
                <div className="formula-name">{f.name}</div>
                <MathFormula latex={f.latex} displayMode />
                {f.conditions ? <div className="formula-cond">{f.conditions}</div> : null}
                {f.note ? <div className="formula-cond">{f.note}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel-section">
        <h3>推导链</h3>
        <div className="chain-list">
          {incoming.length === 0 && outgoing.length === 0 ? (
            <p className="muted">暂无关联知识点。</p>
          ) : (
            <>
              {incoming.map((e) => (
                <div className="chain-item chain-in" key={`in-${e.from}`}>
                  <span className="chain-dir">前置</span>
                  {e.label ?? kindLabel[e.kind]}
                  <span className="chain-who">来自「{conceptTitle(e.from)}」</span>
                </div>
              ))}
              {outgoing.map((e) => (
                <div className="chain-item chain-out" key={`out-${e.to}`}>
                  <span className="chain-dir">引出</span>
                  {e.label ?? kindLabel[e.kind]}
                  <span className="chain-who">到「{conceptTitle(e.to)}」</span>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      <section className="panel-section">
        <h3>经典题型</h3>
        {concept.problemTypes.length === 0 ? (
          <p className="muted">待补充。</p>
        ) : (
          <div className="problem-list">
            {concept.problemTypes.map((p) => (
              <details key={p.id} className="problem">
                <summary className="problem-summary">
                  <span className="problem-name">{p.name}</span>
                  <span className="problem-path">{describePath(p).length} 步路径</span>
                </summary>
                <div className="problem-body">
                  <DecisionTree problem={p} />
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function formulaElementId(conceptId: string, formulaId: string) {
  return `formula-${conceptId}-${formulaId}`
}

function conceptTitle(id: string) {
  return getConcept(id)?.title ?? id
}