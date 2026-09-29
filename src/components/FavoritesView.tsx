import { useMemo } from 'react'
import { courseData, getConcept } from '../content/data'
import type { FavoriteEntry } from '../lib/favorites'
import MathFormula from './MathFormula'

interface Props {
  favorites: FavoriteEntry[]
  onSelect: (conceptId: string, formulaId: string) => void
  onRemove: (conceptId: string, formulaId: string) => void
}

export default function FavoritesView({ favorites, onSelect, onRemove }: Props) {
  const items = useMemo(
    () =>
      favorites.flatMap((favorite) => {
        const concept = getConcept(favorite.conceptId)
        const formula = concept?.formulas.find((entry) => entry.id === favorite.formulaId)
        return concept && formula ? [{ ...favorite, concept, formula }] : []
      }),
    [favorites],
  )

  const sections = courseData.chapters
    .map((chapter) => ({
      chapter,
      items: items.filter((item) => item.concept.chapterId === chapter.id),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="favorites">
      <div className="favorites-head">
        <div>
          <h2>我的收藏</h2>
          <p className="favorites-summary">已收藏 {items.length} 条公式</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="favorites-empty">还没有收藏公式。</p>
      ) : (
        <div className="favorites-sections">
          {sections.map(({ chapter, items: chapterItems }) => (
            <section className="favorites-section" key={chapter.id}>
              <header className="favorites-section-head">
                <h3>{chapter.title}</h3>
                <span>{chapterItems.length} 条</span>
              </header>
              <ul className="favorites-list">
                {chapterItems.map(({ concept, formula, conceptId, formulaId }) => (
                  <li
                    className="favorite-card"
                    key={`${conceptId}:${formulaId}`}
                  >
                    <button
                      className="favorite-open"
                      onClick={() => onSelect(conceptId, formulaId)}
                      type="button"
                    >
                      <span className="favorite-card-head">
                        <span className="favorite-card-name">{formula.name}</span>
                        <span className="favorite-card-context">{concept.title}</span>
                      </span>
                      <span className="favorite-card-formula">
                        <MathFormula latex={formula.latex} displayMode />
                      </span>
                      {formula.note ? (
                        <span className="favorite-card-note">{formula.note}</span>
                      ) : null}
                    </button>
                    <button
                      className="favorite-remove"
                      onClick={() => onRemove(conceptId, formulaId)}
                      type="button"
                      aria-label={`取消收藏${formula.name}`}
                      title="取消收藏"
                    >
                      ★
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
