'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import type * as React from 'react'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const FF_darkMode = useFeatureFlagEnabled('theme-dark-mode')

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={FF_darkMode ? 'system' : 'light'}
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
