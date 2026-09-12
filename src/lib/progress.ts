import { useCallback, useState } from 'react'

export type Mastery = 'mastered' | 'unmastered'

export interface ProgressState {
  [conceptId: string]: Mastery
}

const KEY = 'gaoshu-progress'

function read(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ProgressState) : {}
  } catch {
    return {}
  }
}

function write(state: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // localStorage may be unavailable (e.g. private mode); degrade silently.
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(read)

  const toggle = useCallback((conceptId: string) => {
    setProgress((prev) => {
      const next = { ...prev }
      next[conceptId] = next[conceptId] === 'mastered' ? 'unmastered' : 'mastered'
      write(next)
      return next
    })
  }, [])

  const setMastery = useCallback((conceptId: string, mastery: Mastery) => {
    setProgress((prev) => {
      const next = { ...prev, [conceptId]: mastery }
      write(next)
      return next
    })
  }, [])

  const isMastered = useCallback((conceptId: string) => progress[conceptId] === 'mastered', [progress])

  return { progress, toggle, setMastery, isMastered }
}
