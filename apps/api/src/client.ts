import { AppType } from './app'
import { hc } from 'hono/client'

export const createClient = (url: string) =>
  hc<AppType>(url, {
    fetch: (requestInfo: RequestInfo | URL, requestInit?: RequestInit) =>
      fetch(requestInfo, {
        ...requestInit,
        credentials: 'include',
      }),
  })
