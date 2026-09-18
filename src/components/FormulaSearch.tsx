import { useMemo, useState } from 'react'
import { searchFormulas } from '../lib/formulaSearch'
import MathFormula from './MathFormula'

interface Props {
  onSelect: (conceptId: string, formulaId: string) => void
}

const RESULT_LIMIT = 20

export default function FormulaSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const results = useMemo(() => searchFormulas(query), [query])
  const visibleResults = results.slice(0, RESULT_LIMIT)

  const handleSelect = (conceptId: string, formulaId: string) => {
    onSelect(conceptId, formulaId)
    setQuery('')
    setOpen(false)
  }

  return (
    <div
      className="formula-search"
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false)
        }
      }}
    >
      <div className="formula-search-field">
        <span className="formula-search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          className="formula-search-input"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              event.currentTarget.blur()
            }
            if (event.key === 'Enter' && visibleResults[0]) {
              handleSelect(visibleResults[0].conceptId, visibleResults[0].formula.id)
            }
          }}
          placeholder="搜索公式、知识点或章节"
          aria-label="搜索公式"
        />
        {query ? (
          <button
            className="formula-search-clear"
            type="button"
            onClick={() => {
              setQuery('')
              setOpen(false)
            }}
            aria-label="清空搜索"
          >
            ×
          </button>
        ) : null}
      </div>

      {open && query.trim() ? (
        <div className="formula-search-results">
          {visibleResults.length === 0 ? (
            <p className="formula-search-empty">没有找到匹配公式</p>
          ) : (
            <>
              {visibleResults.map((result) => (
                <button
                  className="formula-search-result"
                  type="button"
                  key={`${result.conceptId}-${result.formula.id}`}
                  onClick={() => handleSelect(result.conceptId, result.formula.id)}
                >
                  <span className="formula-search-result-head">
                    <span className="formula-search-result-name">{result.formula.name}</span>
                    <span className="formula-search-result-meta">{result.chapterTitle}</span>
                  </span>
                  <span className="formula-search-result-context">{result.conceptTitle}</span>
                  <span className="formula-search-result-formula">
                    <MathFormula latex={result.formula.latex} displayMode />
                  </span>
                  {result.formula.conditions || result.formula.note ? (
                    <span className="formula-search-result-note">
                      {result.formula.conditions ?? result.formula.note}
                    </span>
                  ) : null}
                </button>
              ))}
              {results.length > RESULT_LIMIT ? (
                <p className="formula-search-more">结果较多，仅显示前 {RESULT_LIMIT} 条</p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}