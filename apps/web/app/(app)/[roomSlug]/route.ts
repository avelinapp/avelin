import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomSlug: string }> },
) {
  const slug = (await params).roomSlug

  return redirect(`/rooms/${slug}`)
}
