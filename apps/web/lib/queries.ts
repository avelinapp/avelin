import { queryOptions } from '@tanstack/react-query'
import { api } from './api'
import { Auth, Room } from '@avelin/database'
import superjson from 'superjson'

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

const authQueries = {
  all: () => ['auth'],
  check: () =>
    queryOptions({
      queryKey: [...authQueries.all(), 'check'],
      queryFn: async () => {
        const res = await api.auth.verify.$get({}, {})
        const data = await res.json()

        if (res.status >= 400) {
          const { error } = data as { error: string }
          throw new Error(error)
        }

        return superjson.parse(data as string) as Auth
      },
    }),
} as const

export const queries = {
  auth: authQueries,
  rooms: roomQueries,
}
