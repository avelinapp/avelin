'use client'

import { queries } from '@/lib/queries'
import type { Auth } from '@avelin/database'
import { useQuery } from '@tanstack/react-query'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { createContext, useContext } from 'react'

export type AuthContextType =
  | {
      isPending: true
      isAuthenticated?: false
      isAnonymous?: undefined
      user?: undefined
      session?: undefined
    }
  | {
      isPending: false
      isAuthenticated: true
      isAnonymous: boolean
      user: Auth['user']
      session: Auth['session']
    }
  | {
      isPending: false
      isAuthenticated: false
      isAnonymous?: undefined
      user?: undefined
      session?: undefined
    }

const AuthContext = createContext<AuthContextType>({
  isPending: true,
  isAnonymous: undefined,
})

type AuthProviderProps = {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const authDebug = useFeatureFlagEnabled('auth-debug')

  const { data, isPending } = useQuery({
    ...queries.auth.check(),
    retry: false,
    staleTime: 30 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const isAuthenticated = !data || isPending ? false : data.isAuthenticated
  const isAnonymous = !data || isPending ? undefined : data.isAnonymous
  const user =
    !data || isPending ? undefined : isAuthenticated ? data.user! : undefined
  const session =
    !data || isPending ? undefined : isAuthenticated ? data.session! : undefined

  // Construct the context value based on the current state
  let value: AuthContextType

  if (isPending) {
    // When authentication is pending
    value = { isPending: true, isAnonymous: undefined }
  } else if (isAuthenticated) {
    // When authenticated
    value = {
      isPending: false,
      isAuthenticated: true,
      isAnonymous: isAnonymous as boolean,
      user: user!,
      session: session!,
    }
  } else {
    // When not authenticated
    value = {
      isPending: false,
      isAuthenticated: false,
      isAnonymous: undefined,
    }
  }

  if (authDebug) {
    console.log('AUTHENTICATION:', JSON.stringify(value, null, '\t'))
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
