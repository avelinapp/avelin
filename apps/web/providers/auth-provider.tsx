'use client'

import { queries } from '@/lib/queries'
import { Auth } from '@avelin/database'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'

const AuthContext = createContext<Auth | null>(null)

type AuthProviderProps = {
  children: React.ReactNode
  initialAuth: Auth
}

export default function AuthProvider({
  children,
  initialAuth,
}: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    data: auth,
    isPending,
    isError,
    error,
  } = useQuery({
    ...queries.auth.check(),
    initialData: initialAuth,
    retry: false,
    staleTime: 30 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  useEffect(() => {
    if (isError) {
      console.log('Error:', error)
    }
    if (!isPending && (isError || !auth) && pathname !== '/login') {
      console.log('Pathname:', pathname)
      console.log('Redirecting to login...')
      router.push('/login')
    }
  }, [isPending, isError, error, auth, router, pathname])

  if (pathname === '/login') {
    return <>{children}</>
  }

  if (isPending || isError || !auth) return null

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
