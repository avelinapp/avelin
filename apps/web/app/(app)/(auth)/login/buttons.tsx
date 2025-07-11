'use client'

import { LogoGithub, LogoGoogle } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { authClient } from '@/lib/auth'
import { env } from '@/lib/env'

export const LoginWithGoogle = () => {
  async function signIn() {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })
  }

  return (
    <Button
      className="w-full"
      variant="secondary"
      tooltip={{
        content: 'Login with Google',
        side: 'bottom',
      }}
      onClick={signIn}
    >
      <LogoGoogle />
    </Button>
  )
}

export const LoginWithGithub = () => {
  async function signIn() {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })
  }

  return (
    <Button
      className="w-full"
      variant="secondary"
      tooltip={{
        content: 'Login with GitHub',
        side: 'bottom',
      }}
      onClick={signIn}
    >
      <LogoGithub />
    </Button>
  )
}
