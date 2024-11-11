'use client'

import { queries } from '@/lib/queries'
import { Auth } from '@avelin/database'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect } from 'react'

const AuthContext = createContext<{
  isPending: boolean
  isAuthenticated: boolean
  user?: Auth['user']
  session?: Auth['session']
}>({
  isPending: true,
  isAuthenticated: false,
  user: undefined,
  session: undefined,
})

type AuthProviderProps = {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { data, isPending } = useQuery({
    ...queries.auth.check(),
    retry: false,
    staleTime: 30 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  useEffect(() => {
    console.log('Auth is pending:', isPending)
    console.log('Auth data:', data)
  }, [data, isPending])

  return (
    <AuthContext.Provider
      value={{
        isPending,
        isAuthenticated: data?.isAuthenticated ?? false,
        user: data?.user ?? undefined,
        session: data?.session ?? undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
