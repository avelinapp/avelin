import { Auth } from '@avelin/database'

export type AuthVerifyGETResponse =
  | {
      isAuthenticated: false
      error: string
      user: null
      session: null
    }
  | { isAuthenticated: true; user: Auth['user']; session: Auth['session'] }
