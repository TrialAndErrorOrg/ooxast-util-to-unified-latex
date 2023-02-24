import { P } from 'ooxast'
import { Macro } from '@unified-latex/unified-latex-types'
import { p } from './handlers/p'
import { toUnifiedLatex } from './ooxast-util-to-unified-latex'
import { toString } from '@unified-latex/unified-latex-util-to-string'
import { m } from '@unified-latex/unified-latex-builder'
import { updateRenderInfo } from '@unified-latex/unified-latex-util-render-info'
import { PB } from './util/PB'

// test whether a ooxast p node with style 'Heading1' is converted to a macro with name 'section'
describe('ooxast-util-to-unified-latex', () => {
  it('should convert a ooxast p node with style Heading1 to a macro with name section', () => {
    const ooxastParagraph: P = {
      type: 'element',
      name: 'w:p',
      children: [
        {
          type: 'element',
          name: 'w:pPr',
          children: [
            {
              type: 'element',
              name: 'w:pStyle',
              attributes: {
                'w:val': 'Heading1',
              },
              children: [],
            },
          ],
          attributes: {},
        },
        {
          type: 'element',
          name: 'w:r',
          attributes: {
            'w:rsidRPr': '00F84C9E',
            'w:rsidDel': '00F84C9E',
            'w:rsidR': '00F84C9E',
          },
          children: [
            {
              type: 'element',
              name: 'w:t',
              attributes: {},
              children: [
                {
                  type: 'text',
                  value: 'Hello World',
                },
              ],
            },
          ],
        },
      ],
      attributes: {
        'w:rsidR': '00F84C9E',
        'w:rsidRDefault': '00F84C9E',
        'w:rsidP': '00F84C9E',
        'w:rsidDel': '00F84C9E',
        'w:rsidRPr': '00F84C9E',
      },
    }

    const sec = m('section', 'Hello World')
    updateRenderInfo(sec, { breakAround: true })

    const res = { type: 'root', content: [PB, sec, PB] }

    expect(toString(toUnifiedLatex(ooxastParagraph))).toEqual(
      `\n\n\\section{Hello World}\n\n`
    )
    expect(toUnifiedLatex(ooxastParagraph)).toEqual(res)
  })
})
