'use client'

import { authClient } from '@/lib/auth'
const { useSession } = authClient
import { createContext, useContext, useEffect, useState } from 'react'

type User = typeof authClient.$Infer.Session.user
type Session = typeof authClient.$Infer.Session.session

export type AuthContextData =
  | {
      isPending: true
      isAuthenticated: false
      isAnonymous?: never
      user?: never
      session?: never
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
      isAnonymous?: never
      user?: never
      session?: never
    }

const AuthContext = createContext<AuthContextData>({
  isPending: true,
  isAuthenticated: false,
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
  const { data, isPending, error } = useSession()

  const authData = data ?? bootstrap

  let value: AuthContextData

  if (isPending) {
    value = { isPending: true, isAuthenticated: false }
  } else if (error || !authData) {
    value = { isPending: false, isAuthenticated: false, error }
  } else {
    value = {
      isPending: false,
      isAuthenticated: true,
      isAnonymous: authData.user.isAnonymous ?? false,
      user: authData.user,
      session: authData.session,
    }
  }

  useEffect(() => {
    async function anonymousLogin() {
      if (!isPending && !authData) {
        console.log('user is not authenticated')
        console.log('creating anonymous user')
        await authClient.signIn.anonymous()
      }
    }

    anonymousLogin()
  }, [authData, isPending])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  return auth
}
