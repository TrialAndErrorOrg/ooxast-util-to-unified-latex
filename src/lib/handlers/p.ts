import { Macro } from '@unified-latex/unified-latex-types'
import { P } from 'ooxast'
import { SP, m, s, arg, env } from '@unified-latex/unified-latex-builder'
import { all } from '../all.js'
import { H, Handle } from '../types.js'
import { getPStyle } from '../util/get-pstyle.js'
import { updateRenderInfo } from '@unified-latex/unified-latex-util-render-info'
import { PB } from '../util/PB.js'
import { toString } from 'xast-util-to-string'

const headingList = [
  'part',
  'chapter',
  'section',
  'subsection',
  'subsubsection',
  'paragraph',
  'subparagraph',
  'textbf',
]

export function getHeadingLevel(style: string) {
  const lowerCaseStyle = style.toLowerCase()
  if (lowerCaseStyle === 'heading') return 1
  const lastNumber = lowerCaseStyle.slice(-1)
  return !lastNumber ? null : parseInt(lastNumber, 10)
}

export const p: Handle = (h: H, p: P) => {
  if (h.inTable || h.simpleParagraph) {
    return all(h, p)
  }

  const style = getPStyle(p)
  // const res = h(p, 'p', { ...(style ? { style } : {}) }, all(h, p))
  if (!style) return [PB, ...all(h, p), PB]

  if (style.toLowerCase().includes('quote')) {
    return env('quote', all(h, p))
  }

  if (style.toLowerCase() === 'title') {
    h.title = toString(p)
    return []
  }

  const headingLevel = getHeadingLevel(style)

  if (!headingLevel) return [PB, ...all(h, p), PB]

  const headingMacroName =
    headingList[Math.min(headingLevel + h.sectionDepth, headingList.length - 1)]

  const res = m(headingMacroName, arg(all(h, p), { braces: '{}' }))
  updateRenderInfo(res, { breakAround: true })

  return [PB, res, PB]
}
