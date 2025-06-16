// @ts-nocheck
'use client'

import { cn } from '@avelin/ui/cn'
import { useIsMobile, useMeasureFull, useScrollEdges } from '@avelin/ui/hooks'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { useTheme } from 'next-themes'
import type React from 'react'
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { type BundledLanguage, createHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'
import { avelinDark, avelinLight } from '@/components/editor/themes'
import { languages } from '@/lib/constants'
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
  const isMobile = useIsMobile()
  const [nodes, setNodes] = useState(undefined)
  const [linesofCode, setLinesofCode] = useState(0)
  const { theme } = useTheme()

  const contentContainerRef = useRef<HTMLDivElement>(null)
  const contentEdges = useScrollEdges(contentContainerRef)

  const [locContainerRef, { width: locWidth }] = useMeasureFull()

  useEffect(() => {
    console.log({
      top: contentEdges.top,
      bottom: contentEdges.bottom,
      left: contentEdges.left,
      right: contentEdges.right,
    })
  }, [contentEdges])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    const hastTree = highlighter.codeToHast(children, {
      lang,
      theme: theme === 'light' ? 'avelin-light' : 'avelin-dark',
    })

    let lineCount = 0

    visit(hastTree, { tagName: 'code' }, (codeNode: Element) => {
      // filter for direct children that are elements
      // with className including "line"
      lineCount = codeNode.children.filter(
        (child) =>
          child.type === 'element' &&
          child.tagName === 'span' && // or 'span' if you wrapped as spans
          child.properties.class === 'line',
      ).length
    })

    setLinesofCode(lineCount)
    setNodes(hastTree)
  }, [theme])
  return (
    <div
      className={cn(
        '**:font-mono',
        'overflow-hidden whitespace-nowrap relative',
        className,
      )}
      style={
        {
          '--loc-width': `${locWidth}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        className={cn(
          'absolute z-10 pointer-events-none top-0 left-0 right-0 bottom-0 h-full w-full',
        )}
      >
        <div className="h-full w-full relative">
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 max-w-screen-xl z-10">
            {/* biome-ignore lint/a11y/noPositiveTabindex: <explanation> */}
            <CopyCodeButton content={children} tabIndex={1} />
          </div>
          {!isMobile && (
            <>
              <div
                className={cn(
                  'w-24 bg-gray-1 mask-r-from-0% h-full absolute top-0 left-(--loc-width) transition-opacity duration-300 ease-out translate-x-[-0.5px]',
                  contentEdges.left && 'opacity-0',
                )}
              />
              <div
                className={cn(
                  'w-24 bg-gray-1 mask-l-from-0% h-full absolute top-0 right-0 transition-opacity duration-300 ease-out',
                  contentEdges.right && 'opacity-0',
                )}
              />
              <div
                className={cn(
                  'w-full bg-gray-1 mask-b-from-0% h-24 absolute top-0 left-[calc(var(--loc-width))] transition-opacity duration-300 ease-out',
                  contentEdges.top && 'opacity-0',
                )}
              />
              <div
                className={cn(
                  'w-full bg-gray-1 mask-t-from-0% h-24 absolute bottom-0 left-[calc(var(--loc-width))] transition-opacity duration-300 ease-out',
                  contentEdges.bottom && 'opacity-0',
                )}
              />
            </>
          )}
        </div>
      </div>
      <div
        className="grid grid-cols-[max-content_max-content] h-full w-full relative overflow-auto py-6"
        ref={contentContainerRef}
        tabIndex={-1}
      >
        <div
          className="flex flex-col text-color-text-quaternary/50 select-none bg-gray-1 sticky left-0 top-0 text-right pr-4 sm:pr-8 pl-4"
          tabIndex={-1}
          ref={locContainerRef}
        >
          {Array.from({ length: linesofCode }, (_, i) => i + 1).map((x) => {
            return <span key={x}>{x}</span>
          })}
        </div>

        <div className="pr-4" tabIndex={-1}>
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
    </div>
  )
}
