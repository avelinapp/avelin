'use client'

import { authClient } from '@/lib/auth'
import { env } from '@/lib/env'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
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
  refreshJwt: () => Promise<string>
}

export type AuthStore = AuthState & AuthActions

const AuthContext = createContext<AuthStore>({
  isPending: true,
  isAuthenticated: false,
  signOut: async () => {},
  refreshJwt: async () => '',
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
  }, [router.push])

  const refreshJwt = useCallback(async () => {
    const { data, error } = await authClient.getSession()

    console.log('[AuthProvider] refreshJwt', data, error)

    if (!data || error) {
      return signOut()
    }

    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.session.token}`,
      },
    })

    if (!res.ok) {
      return signOut()
    }

    const { jwt } = (await res.json()) as { jwt: string }

    Cookies.set('avelin.session_jwt', jwt, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: `.${env.NEXT_PUBLIC_BASE_DOMAIN}`,
      expires: 1,
    })

    console.log('[AuthProvider] refreshJwt => JWT refreshed:', jwt)

    return jwt
  }, [signOut])

  const value = {
    user: data?.user,
    session: data?.session,
    isPending,
    isAuthenticated,
    isAnonymous,
    signOut,
    refreshJwt,
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
