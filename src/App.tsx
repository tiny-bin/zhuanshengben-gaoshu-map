import { useCallback, useState } from 'react'
import GraphMap from './components/GraphMap'
import ChapterIndex from './components/ChapterIndex'
import ConceptPanel from './components/ConceptPanel'
import { useProgress } from './lib/progress'
import { courseData, getConcept } from './content/data'

export default function App() {
  const { progress, toggle, isMastered } = useProgress()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'map' | 'index'>('map')
  const [activeChapterId, setActiveChapterId] = useState(courseData.chapters[0].id)

  const handleSelect = useCallback((id: string) => {
    const concept = getConcept(id)
    if (concept) setActiveChapterId(concept.chapterId)
    setSelectedId(id)
  }, [])
  const handleClose = useCallback(() => setSelectedId(null), [])
  const handleChapterChange = useCallback((id: string) => setActiveChapterId(id), [])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">微</span>
          <div className="brand-text">
            <h1>高等数学 · 地图</h1>
            <p className="brand-sub">浙江专升本 · 先建构，再记忆</p>
          </div>
        </div>
        <nav className="views">
          <button
            className={`view-btn${view === 'map' ? ' active' : ''}`}
            onClick={() => setView('map')}
            type="button"
          >
            章节地图
          </button>
          <button
            className={`view-btn${view === 'index' ? ' active' : ''}`}
            onClick={() => setView('index')}
            type="button"
          >
            章节索引
          </button>
        </nav>
      </header>

      <div className="layout">
        <main className="stage">
          {view === 'map' ? (
            <GraphMap
              key={activeChapterId}
              selectedId={selectedId}
              progress={progress}
              onSelect={handleSelect}
              activeChapterId={activeChapterId}
              onChapterChange={handleChapterChange}
            />
          ) : (
            <ChapterIndex progress={progress} onSelect={handleSelect} />
          )}
        </main>

        <aside className={`detail${selectedId ? ' open' : ''}`}>
          {selectedId ? (
            <ConceptPanel
              key={selectedId}
              conceptId={selectedId}
              mastered={isMastered(selectedId)}
              onToggleMastery={toggle}
              onClose={handleClose}
            />
          ) : (
            <div className="panel-empty panel-placeholder">
              <p>点击地图上的一个知识点，查看公式与解题路径。</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
