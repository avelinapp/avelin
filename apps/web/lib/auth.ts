import { env } from '@/lib/env'
import { anonymousClient, createAuthClient } from '@avelin/auth/client'

const API_URL = env.NEXT_PUBLIC_API_URL

type AuthClient = ReturnType<
  typeof createAuthClient<{ plugins: [ReturnType<typeof anonymousClient>] }>
>

export const authClient: AuthClient = createAuthClient({
  baseURL: `${API_URL}/auth`,
  plugins: [anonymousClient()],
})
