import { courseData, conceptsOfChapter } from '../content/data'
import type { ProgressState } from '../lib/progress'

interface Props {
  progress: ProgressState
  onSelect: (conceptId: string) => void
}

export default function ChapterIndex({ progress, onSelect }: Props) {
  return (
    <div className="index">
      {courseData.chapters.map((ch) => {
        const concepts = conceptsOfChapter(ch.id)
        const done = concepts.filter((c) => progress[c.id] === 'mastered').length
        return (
          <section className="index-section" key={ch.id}>
            <header className="index-head">
              <div>
                <h2>{ch.title}</h2>
                <p className="index-desc">{ch.description}</p>
              </div>
              <span className="index-progress">
                {done}/{concepts.length} 掌握
              </span>
            </header>
            <ul className="index-list">
              {concepts.map((c) => (
                <li key={c.id}>
                  <button className="index-item" onClick={() => onSelect(c.id)} type="button">
                    <span className="index-item-title">{c.title}</span>
                    <span className="index-item-meta">
                      {c.formulas.length} 公式 · {c.problemTypes.length} 题型
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
