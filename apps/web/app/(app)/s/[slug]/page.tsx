import { api } from '@/lib/api'
import { Content } from './_components/content'

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
    return <Content data={data} />
  }

  switch (error.status) {
    case 404:
      return <div>Room not found</div>
    default:
      return <div>Something went wrong</div>
  }
}
