import { treaty } from '@elysiajs/eden'
import type { App } from './types'

export const client = (apiUrl: string) =>
  treaty<App>(apiUrl, {
    fetch: {
      credentials: 'include',
    },
  })
