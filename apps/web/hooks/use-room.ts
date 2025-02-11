import { queries } from '@/lib/queries'
import { useQuery } from '@tanstack/react-query'

export function useRoom(slug: string) {
  return useQuery({
    ...queries.rooms.detail(slug),
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
