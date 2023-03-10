import { isElement } from 'xast-util-is-element'
import { Parent } from 'ooxast'
import { all } from './all.js'
import { Handle, H, UnifiedLatexNode, Node, Element } from './types.js'
import { own } from './util/own.js'
import { wrapText } from './util/wrap-text.js'

export function one(
  h: H,
  node: Node,
  parent?: Parent,
): UnifiedLatexNode | Array<UnifiedLatexNode> | void {
  let fn: Handle | undefined

  if (isElement(node)) {
    if (own.call(h.handlers, node.name.replace(/\w+:/, ''))) {
      fn = h.handlers[node.name.replace(/\w+:/, '')]
    }
  } else if (own.call(h.handlers, node.type)) {
    fn = h.handlers[node.type]
  }

  if (typeof fn === 'function') {
    return fn(h, node, parent)
  }

  return unknown(h, node)
}

function unknown(h: H, node: Node) {
  // @ts-expect-error: Looks like a literal.
  if (typeof node.value === 'string') {
    // @ts-expect-error: Looks like a literal.
    return h(node, 'text', wrapText(h, node.value))
  }

  return all(h, node)
}
