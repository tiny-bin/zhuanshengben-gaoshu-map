import { courseData } from '../content/data'
import type { Formula } from '../content/types'

export interface FormulaSearchResult {
  chapterId: string
  chapterTitle: string
  conceptId: string
  conceptTitle: string
  formula: Formula
}

interface SearchEntry extends FormulaSearchResult {
  chapterOrder: number
  conceptIndex: number
  formulaIndex: number
}

const searchEntries: SearchEntry[] = courseData.chapters.flatMap((chapter) =>
  courseData.concepts
    .filter((concept) => concept.chapterId === chapter.id)
    .flatMap((concept, conceptIndex) =>
      concept.formulas.map((formula, formulaIndex) => ({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        conceptId: concept.id,
        conceptTitle: concept.title,
        formula,
        chapterOrder: chapter.order,
        conceptIndex,
        formulaIndex,
      })),
    ),
)

function normalizeText(value: string) {
  return value.toLocaleLowerCase('zh-CN').replace(/\s+/g, '')
}

function scoreEntry(entry: SearchEntry, query: string): number | null {
  const name = normalizeText(entry.formula.name)
  if (name === query) return 0
  if (name.startsWith(query)) return 1
  if (name.includes(query)) return 2

  const concept = normalizeText(entry.conceptTitle)
  if (concept.includes(query)) return 3

  const chapter = normalizeText(entry.chapterTitle)
  if (chapter.includes(query)) return 4

  const formulaText = normalizeText(
    [entry.formula.latex, entry.formula.conditions ?? '', entry.formula.note ?? ''].join(' '),
  )
  return formulaText.includes(query) ? 5 : null
}

export function searchFormulas(rawQuery: string): FormulaSearchResult[] {
  const query = normalizeText(rawQuery.trim())
  if (!query) return []

  return searchEntries
    .flatMap((entry) => {
      const score = scoreEntry(entry, query)
      return score === null ? [] : [{ entry, score }]
    })
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.entry.chapterOrder - b.entry.chapterOrder ||
        a.entry.conceptIndex - b.entry.conceptIndex ||
        a.entry.formulaIndex - b.entry.formulaIndex,
    )
    .map(({ entry }) => ({
      chapterId: entry.chapterId,
      chapterTitle: entry.chapterTitle,
      conceptId: entry.conceptId,
      conceptTitle: entry.conceptTitle,
      formula: entry.formula,
    }))
}