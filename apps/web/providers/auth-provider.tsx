'use client'

import { queries } from '@/lib/queries'
import { Auth } from '@avelin/database'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

const AuthContext = createContext<{
  isAuthenticated: boolean
  user: Auth['user'] | null
  session: Auth['session'] | null
}>({
  isAuthenticated: false,
  user: null,
  session: null,
})

type AuthProviderProps = {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { data } = useSuspenseQuery({
    ...queries.auth.check(),
    retry: false,
    staleTime: 30 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
