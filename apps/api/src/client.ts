import { treaty } from '@elysiajs/eden'
// biome-ignore lint/correctness/noUnusedImports: required type for compilation
import type * as UndiciTypes from 'undici-types'
import type { App } from './types'

export const client = (apiUrl: string) =>
  treaty<App>(apiUrl, {
    fetch: {
      credentials: 'include',
    },
  })
