import { createClient } from '@avelin/api/client'

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('API_URL is not set')
}

export const api = createClient(process.env.NEXT_PUBLIC_API_URL)
