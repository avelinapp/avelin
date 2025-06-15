import { env } from '@/lib/env'
import type { auth } from '@avelin/auth'
import {
  anonymousClient,
  createAuthClient,
  inferAdditionalFields,
} from '@avelin/auth/client'

const API_URL = env.NEXT_PUBLIC_API_URL

type AuthClient = ReturnType<
  typeof createAuthClient<{
    plugins: [
      ReturnType<typeof anonymousClient>,
      ReturnType<typeof inferAdditionalFields<typeof auth>>,
    ]
  }>
>

export const authClient: AuthClient = createAuthClient({
  baseURL: `${API_URL}/auth`,
  plugins: [anonymousClient(), inferAdditionalFields<typeof auth>()],
})
