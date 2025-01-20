import { client } from '@avelin/api'
// eslint-disable-next-line
import type { Response } from 'undici-types'

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set')
}

export const api = client(process.env.NEXT_PUBLIC_API_URL)
