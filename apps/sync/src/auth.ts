import { anonymousClient, createAuthClient } from '@avelin/auth/client'
import { env } from './env'

const API_URL = env.API_URL

type AuthClient = ReturnType<
  typeof createAuthClient<{ plugins: [ReturnType<typeof anonymousClient>] }>
>

export const authClient: AuthClient = createAuthClient({
  baseURL: `${API_URL}/auth`,
  plugins: [anonymousClient()],
})
