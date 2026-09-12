import { useMemo } from 'react'
import katex from 'katex'

interface Props {
  latex: string
  displayMode?: boolean
}

export default function MathFormula({ latex, displayMode = false }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode,
        output: 'html',
      })
    } catch {
      return latex
    }
  }, [latex, displayMode])

  return <span className="math" dangerouslySetInnerHTML={{ __html: html }} />
}
