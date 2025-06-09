'use client'

import {
  containerVariants,
  sectionVariants,
} from '@/app/(landing)/_components/variants'
import { languages } from '@/lib/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@avelin/ui/avatar'
import { motion } from 'motion/react'
import { CodeBlock } from './code-block'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Content({ data }: { data: any }) {
  const language = languages.find((v) => v.value === data.editorLanguage)!
  const Icon = language.logo
  return (
    <motion.div
      className="overflow-y-scroll flex flex-col gap-10 px-4 py-4 sm:px-16 sm:py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex flex-col gap-6" variants={sectionVariants}>
        <div className="flex items-center gap-3  mx-auto w-full max-w-screen-lg select-none">
          {Icon && <Icon className="size-6" />}
          <h1 className="text-xl sm:text-2xl font-[550]">{data.title}</h1>
        </div>
        <div className="grid grid-cols-[max-content_auto] gap-x-8 gap-y-4 text-sm mx-auto w-full max-w-screen-lg select-none">
          <span className="text-color-text-tertiary font-[450]">Language</span>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-4" />}
            <span>{language.name}</span>
          </div>
          <span className="text-color-text-tertiary font-[450]">Creator</span>
          <div className="flex items-center gap-2">
            <Avatar className="size-4">
              <AvatarImage src={data?.creator?.picture ?? undefined} />
              <AvatarFallback>
                {data?.creator?.name.split(' ')[0]?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span>{data?.creator?.name}</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        variants={sectionVariants}
        className="mx-auto w-full max-w-screen-xl"
      >
        <CodeBlock
          className="border border-color-border-subtle shadow-lg dark:shadow-gray-2 rounded-xl **:text-xs sm:**:text-sm **:leading-relaxed"
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          lang={data.editorLanguage as any}
        >
          {data.content}
        </CodeBlock>
      </motion.div>
    </motion.div>
  )
}
