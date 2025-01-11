import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { api } from './api'
import { Room } from '@avelin/database'
import { AuthVerifyGETResponse } from '@avelin/api/types'
import superjson from 'superjson'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

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
      retry: 2,
    }),
}

const authQueries = {
  all: () => ['auth'],
  // eslint-disable-next-line
  check: (headers: any = undefined) =>
    queryOptions({
      queryKey: [...authQueries.all(), 'check'],
      queryFn: async () => {
        const res = await api.auth.verify.$get(
          {},
          {
            headers: {
              ...headers,
            },
          },
        )

        const text = await res.text()
        let data = superjson.parse<AuthVerifyGETResponse>(text)

        // Create anonymous user & session if the user does not have a session.
        if (!data.isAuthenticated) {
          const res = await api.auth.anonymous.$post()
          const text = await res.text()

          data = superjson.parse<AuthVerifyGETResponse>(text)
        }

        return {
          isAuthenticated: data.isAuthenticated,
          isAnonymous: data.isAnonymous,
          user: data.user,
          session: data.session,
        }
      },
    }),
} as const

export const queries = {
  auth: authQueries,
  rooms: roomQueries,
}
