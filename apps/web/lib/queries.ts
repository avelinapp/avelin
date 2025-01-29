import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { api } from './api'

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
  all: () =>
    queryOptions({
      queryKey: ['rooms'],
      queryFn: async () => {
        const { data, error } = await api.rooms.index.get()

        if (!!error) {
          throw new Error(error.value.error)
        }

        return data
      },
    }),
  detail: (slug: string) =>
    queryOptions({
      queryKey: [...roomQueries.all().queryKey, slug],
      queryFn: async () => {
        const { data, error } = await api.rooms({ slug }).get()

        if (!data || error) {
          throw new Error(error.value.message)
        }

        return data
      },
      retry: 2,
    }),
}

const authQueries = {
  all: () => ['auth'],
  // check: () =>
  // eslint-disable-next-line
  check: (headers: any = undefined) =>
    queryOptions({
      queryKey: [...authQueries.all(), 'check'],
      queryFn: async () => {
        const auth = await api.auth.verify.get({
          headers: { ...headers },
        })

        // No errors means the user and session are valid
        // We can return the user and session data
        if (!auth.error) {
          return auth.data
        }

        // Create anonymous user & session if the user does not have a session.
        const anonAuth = await api.auth.anonymous.post(
          {},
          {
            headers: { ...headers },
          },
        )

        if (anonAuth.error) {
          switch (anonAuth.error.status) {
            case 500:
              throw new Error(anonAuth.error.value.error)
            default:
              throw new Error('Error in anonymous user creation.')
          }
        }

        return anonAuth.data
      },
    }),
} as const

export const queries = {
  auth: authQueries,
  rooms: roomQueries,
}
