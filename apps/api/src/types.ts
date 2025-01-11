import { Auth } from '@avelin/database'

export type AuthVerifyGETResponse =
  | {
      isAuthenticated: false
      isAnonymous: undefined
      error: string
      user: null
      session: null
    }
  | {
      isAuthenticated: true
      isAnonymous: boolean
      user: Auth['user']
      session: Auth['session']
    }
