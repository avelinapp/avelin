'use client'

import { authClient } from '@/lib/auth'
import { useRouter } from 'next/navigation'
const { useSession } = authClient
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type User = typeof authClient.$Infer.Session.user
type Session = typeof authClient.$Infer.Session.session

export type AuthState =
  | {
      isPending: true
      isAuthenticated: false
      isAnonymous?: undefined
      user?: undefined
      session?: undefined
    }
  | {
      isPending: false
      isAuthenticated: true
      isAnonymous: boolean
      user: User
      session: Session
    }
  | {
      isPending: false
      isAuthenticated: false
      error: unknown
      isAnonymous?: undefined
      user?: undefined
      session?: undefined
    }

export type AuthActions = {
  signOut: () => Promise<void>
}

export type AuthStore = AuthState & AuthActions

const AuthContext = createContext<AuthStore>({
  isPending: true,
  isAuthenticated: false,
  signOut: async () => {},
})

type AuthData = {
  user: User
  session: Session
}

type AuthProviderProps = {
  bootstrap: AuthData | undefined
  children: React.ReactNode
}

export default function AuthProvider({
  bootstrap,
  children,
}: AuthProviderProps) {
  const router = useRouter()

  const [data, setData] = useState<AuthData | undefined>(bootstrap)
  const [isPending, setIsPending] = useState<boolean>(!bootstrap)

  const isAuthenticated = Boolean(!isPending && data)
  const isAnonymous = Boolean(
    isAuthenticated ? data?.user.isAnonymous : undefined,
  )

  const signOut = useCallback(async () => {
    await authClient.signOut()
    setData(undefined)
    router.push('/login')
  }, [])

  const value = {
    user: data?.user,
    session: data?.session,
    isPending,
    isAuthenticated,
    isAnonymous,
    signOut,
  }

  // @ts-expect-error
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  return auth
}
