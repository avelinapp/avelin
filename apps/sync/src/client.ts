import { AppType } from './app'
import { hc } from 'hono/client'

export const createSyncClient = (url: string) => hc<AppType>(url)
