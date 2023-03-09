import { s } from '@unified-latex/unified-latex-builder'
import { H, Text } from '../types.js'

export function text(h: H, node: Text) {
  return s(node.value)
}
