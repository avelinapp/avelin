import { useQuery } from '@tanstack/react-query'
import { queries } from '@/lib/queries'

export function useRoom(slug: string) {
  return useQuery(queries.rooms.detail(slug))
}
