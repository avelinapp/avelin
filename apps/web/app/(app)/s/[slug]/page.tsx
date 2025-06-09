import { api } from '@/lib/api'
import { Language, languages } from '@/lib/constants'
import { CodeBlock } from './_components/code-block'

export default async function Page({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  console.time('load static room')
  const { data, error } = await api.rooms
    .static({
      slug,
    })
    .get()
  console.timeEnd('load static room')

  if (!error) {
    const language = languages.find((v) => v.value === data.editorLanguage)!
    const Icon = language.logo
    return (
      <div className="flex-1 h-full p-16 flex flex-col gap-8 mx-auto w-full max-w-screen-xl">
        <div className="flex items-center gap-4">
          {Icon && <Icon className="size-10" />}
          <h1 className="text-4xl font-[550]">{data.title}</h1>
        </div>
        <CodeBlock
          className="border border-color-border-subtle shadow-lg dark:shadow-gray-2 rounded-xl max-h-full **:text-sm **:leading-relaxed"
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          lang={data.editorLanguage as any}
        >
          {data.content}
        </CodeBlock>
      </div>
    )
  }

  switch (error.status) {
    case 404:
      return <div>Room not found</div>
    default:
      return <div>Something went wrong</div>
  }
}
