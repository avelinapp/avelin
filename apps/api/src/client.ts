import { AppType } from './app'
import { hc } from 'hono/client'

const _client = hc<AppType>('')

export type Client = typeof _client
export type ClientOptions = Parameters<typeof hc>

export const createClient = (
  baseUrl: ClientOptions[0],
  options?: ClientOptions[1],
): Client =>
  hc<AppType>(baseUrl, {
    fetch: (requestInfo: RequestInfo | URL, requestInit?: RequestInit) =>
      fetch(requestInfo, {
        ...requestInit,
        credentials: 'include',
      }),
    ...options,
  })
