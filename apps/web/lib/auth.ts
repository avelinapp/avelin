import { env } from '@/lib/env'
import { anonymousClient, createAuthClient } from '@avelin/auth/client'

const API_URL = env.NEXT_PUBLIC_API_URL

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL: `${API_URL}/auth`,
    plugins: [anonymousClient()],
  },
)
