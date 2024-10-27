import { queryOptions } from '@tanstack/react-query'
import { api } from './api'

const roomQueries = {
  all: () => ['rooms'],
  detail: (slug: string) =>
    queryOptions({
      queryKey: [...roomQueries.all(), slug],
      queryFn: async () => {
        const res = await api.rooms[':slug'].$get({ param: { slug } })
        return await res.json()
      },
    }),
}

export const queries = {}
