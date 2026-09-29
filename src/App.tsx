import { useCallback, useEffect, useRef, useState } from 'react'
import GraphMap from './components/GraphMap'
import ChapterIndex from './components/ChapterIndex'
import ConceptPanel from './components/ConceptPanel'
import FavoritesView from './components/FavoritesView'
import FormulaSearch from './components/FormulaSearch'
import { useFavorites } from './lib/favorites'
import { useProgress } from './lib/progress'
import { courseData, getConcept } from './content/data'

export default function App() {
  const { progress, toggle, isMastered } = useProgress()
  const { favorites, toggle: toggleFavorite, remove: removeFavorite, isFavorite } = useFavorites()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusFormulaId, setFocusFormulaId] = useState<string | null>(null)
  const [view, setView] = useState<'map' | 'index' | 'favorites'>('map')
  const [activeChapterId, setActiveChapterId] = useState(courseData.chapters[0].id)
  const topbarRef = useRef<HTMLElement | null>(null)

  // 移动端详情抽屉是 fixed 定位，量出顶栏高度写进 CSS 变量，
  // 抽屉才能正好卡在搜索栏下面，而不是被顶栏盖住标题。
  useEffect(() => {
    const el = topbarRef.current
    if (!el) return
    const apply = () => {
      document.documentElement.style.setProperty(
        '--topbar-h',
        `${Math.round(el.getBoundingClientRect().height)}px`,
      )
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    window.addEventListener('resize', apply)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [])

  const handleSelect = useCallback((id: string) => {
    const concept = getConcept(id)
    if (concept) setActiveChapterId(concept.chapterId)
    setSelectedId(id)
    setFocusFormulaId(null)
  }, [])

  const handleFormulaSelect = useCallback((conceptId: string, formulaId: string) => {
    const concept = getConcept(conceptId)
    if (!concept) return
    setActiveChapterId(concept.chapterId)
    setSelectedId(conceptId)
    setFocusFormulaId(formulaId)
    setView('map')
  }, [])

  const handleClose = useCallback(() => {
    setSelectedId(null)
    setFocusFormulaId(null)
  }, [])
  const handleChapterChange = useCallback((id: string) => setActiveChapterId(id), [])

  return (
    <div className="app">
      <header className="topbar" ref={topbarRef}>
        <div className="brand">
          <span className="brand-mark">微</span>
          <div className="brand-text">
            <h1>高等数学 · 地图</h1>
            <p className="brand-sub">浙江专升本 · 先建构，再记忆</p>
          </div>
        </div>
        <FormulaSearch onSelect={handleFormulaSelect} />
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
          <button
            className={`view-btn${view === 'favorites' ? ' active' : ''}`}
            onClick={() => setView('favorites')}
            type="button"
          >
            我的收藏
            {favorites.length > 0 ? <span className="view-count">{favorites.length}</span> : null}
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
          ) : view === 'index' ? (
            <ChapterIndex progress={progress} onSelect={handleSelect} />
          ) : (
            <FavoritesView
              favorites={favorites}
              onSelect={handleFormulaSelect}
              onRemove={removeFavorite}
            />
          )}
        </main>

        <aside className={`detail${selectedId ? ' open' : ''}`}>
          {selectedId ? (
            <ConceptPanel
              key={selectedId}
              conceptId={selectedId}
              mastered={isMastered(selectedId)}
              onToggleMastery={toggle}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              focusFormulaId={focusFormulaId}
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
