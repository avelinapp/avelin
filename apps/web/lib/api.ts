import { client } from '@avelin/api'
import { env } from './env'

export const api = client(env.NEXT_PUBLIC_API_URL)
