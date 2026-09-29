import { useCallback, useState } from 'react'

export interface FavoriteEntry {
  conceptId: string
  formulaId: string
}

const KEY = 'gaoshu-favorites'

function isFavoriteEntry(value: unknown): value is FavoriteEntry {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return typeof entry.conceptId === 'string' && typeof entry.formulaId === 'string'
}

function read(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isFavoriteEntry) : []
  } catch {
    return []
  }
}

function write(favorites: FavoriteEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  } catch {
    // localStorage may be unavailable (e.g. private mode); degrade silently.
  }
}

function sameFormula(a: FavoriteEntry, conceptId: string, formulaId: string) {
  return a.conceptId === conceptId && a.formulaId === formulaId
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>(read)

  const toggle = useCallback((conceptId: string, formulaId: string) => {
    setFavorites((prev) => {
      const exists = prev.some((entry) => sameFormula(entry, conceptId, formulaId))
      const next = exists
        ? prev.filter((entry) => !sameFormula(entry, conceptId, formulaId))
        : [...prev, { conceptId, formulaId }]
      write(next)
      return next
    })
  }, [])

  const remove = useCallback((conceptId: string, formulaId: string) => {
    setFavorites((prev) => {
      const next = prev.filter((entry) => !sameFormula(entry, conceptId, formulaId))
      write(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (conceptId: string, formulaId: string) =>
      favorites.some((entry) => sameFormula(entry, conceptId, formulaId)),
    [favorites],
  )

  return { favorites, toggle, remove, isFavorite }
}
