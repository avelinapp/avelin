import { queryOptions } from '@tanstack/react-query'
import { api } from './api'
import { Room } from '@avelin/database'

const roomQueries = {
  all: () => ['rooms'],
  detail: (slug: string) =>
    queryOptions({
      queryKey: [...roomQueries.all(), slug],
      queryFn: async () => {
        const res = await api.rooms[':slug'].$get({ param: { slug } })
        const data = await res.json()

        if (res.status >= 400) {
          const { error } = data as { error: string }
          throw new Error(error)
        }

        return data as Room
      },
    }),
}

export const queries = {
  rooms: roomQueries,
}
