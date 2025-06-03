// @ts-nocheck
//
'use client'

import { avelinDark, avelinLight } from '@/components/editor/themes'
import { languages } from '@/lib/constants'
import { CopyIcon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { useTheme } from 'next-themes'
import { Fragment, useLayoutEffect, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { type BundledLanguage, codeToHtml, createHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'
import { CopyCodeButton } from './copy-code-button'

type CodeBlockProps = {
  children: string
  lang: BundledLanguage
} & React.ComponentPropsWithRef<'div'>

const highlighter = await createHighlighter({
  themes: [avelinLight, avelinDark],
  langs: languages.map((l) => l.value),
})

export function CodeBlock({
  children,
  lang,
  className,
  ...props
}: CodeBlockProps) {
  const [nodes, setNodes] = useState(undefined)
  const { theme } = useTheme()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    const hastTree = highlighter.codeToHast(children, {
      lang,
      theme: theme === 'light' ? 'avelin-light' : 'avelin-dark',
    })

    visit(hastTree, { tagName: 'code' }, (codeNode, _index, parent) => {
      // codeNode.children is an array of nodes. Some are text nodes (including "\n"),
      // some are <span style="…">foo</span>, etc. We want to group everything up to each "\n" in one “line” array.

      const newChildren = []
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let buffer: any[] = [] // collects nodes for the current line

      // biome-ignore lint/complexity/noForEach: <explanation>
      codeNode.children.forEach((child) => {
        // If this “child” is a text node containing “\n” (possibly multiple),
        // we need to split on "\n" boundaries. In practice Shiki usually emits a text node
        // whose value ends with "\n". But to be safe, split ANY text child on "\n".
        if (child.type === 'text' && child.value.includes('\n')) {
          const parts = child.value.split('\n')
          // e.g. value = "const x = 123;\n"
          // → parts = ["const x = 123;", ""] (the trailing empty string for the final \n)
          parts.forEach((segment, idx) => {
            if (segment !== '') {
              // Push a text‐only node for the segment (no newline)
              buffer.push({
                type: 'text',
                value: segment,
              })
            }
            // Whenever we see a “real” newline (i.e. idx < parts.length–1),
            // we consider that the end-of-line boundary:
            if (idx < parts.length - 1) {
              //  2a) wrap buffer into a <div class="line"> …
              newChildren.push({
                type: 'element',
                tagName: 'div',
                properties: { className: ['line'] },
                children: [
                  // empty <span class="ln"></span> as first child
                  {
                    type: 'element',
                    tagName: 'span',
                    properties: { className: ['ln'] },
                    children: [],
                  },
                  // then everything we buffered so far
                  ...buffer,
                ],
              })
              // start a fresh buffer for the next line
              buffer = []
            }
          })
        } else {
          // If it’s not a text node with “\n”, just keep buffering
          buffer.push(child)
        }
      })

      // After iterating, if there’s any leftover in buffer, that’s the last line (no trailing newline).
      if (buffer.length > 0) {
        newChildren.push({
          type: 'element',
          tagName: 'div',
          properties: { className: ['line'] },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['ln'] },
              children: [],
            },
            ...buffer,
          ],
        })
      }

      // Replace codeNode.children with our new wrapped lines
      codeNode.children = newChildren

      // 4) Count how many lines we now have:
      const totalLines = newChildren.length
      const maxDigits = String(totalLines).length // e.g. 3 if totalLines = 100

      // 5) Inject that into the parent <pre> as data-line-numbers-max-digits:
      if (parent && parent.type === 'element' && parent.tagName === 'pre') {
        parent.properties = parent.properties || {}
        parent.properties['data-line-numbers-max-digits'] = String(maxDigits)
        parent.properties.style = `--ln-max-digits: ${maxDigits}`
      }
    })

    setNodes(hastTree)
  }, [])

  return (
    <div className={cn('**:font-mono py-6 relative', className)} {...props}>
      <div className="sticky top-0 max-w-screen-xl">
        <CopyCodeButton content={children} />
      </div>
      <div className="overflow-scroll">
        {nodes ? (
          toJsxRuntime(nodes, {
            Fragment,
            jsx,
            jsxs,
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}
