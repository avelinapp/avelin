'use client'

import { queries } from '@/lib/queries'
import { Auth } from '@avelin/database'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'

const AuthContext = createContext<Auth | undefined>(undefined)

type AuthProviderProps = {
  children: React.ReactNode
  initialData?: Auth
}

export default function AuthProvider({
  children,
  initialData,
}: AuthProviderProps) {
  const { data: auth } = useQuery({
    ...queries.auth.check(),
    initialData,
    retry: false,
    staleTime: 30 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
