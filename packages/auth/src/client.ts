import { createAuthClient } from 'better-auth/client'

export const auth: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: `${process.env.API_URL}/auth`,
})
