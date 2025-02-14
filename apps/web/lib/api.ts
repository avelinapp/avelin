import { client } from '@avelin/api'
// eslint-disable-next-line
import type { Response } from 'undici-types'
import { env } from './env'

export const api = client(env.NEXT_PUBLIC_API_URL)
