'use client'

import { LogoGoogle } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export const LoginWithGoogle = () => {
  const searchParams = useSearchParams()

  const redirect = searchParams.get('redirect')

  let linkUrl = process.env.NEXT_PUBLIC_API_URL + '/auth/google'

  if (redirect) {
    linkUrl += '?redirect=' + encodeURIComponent(redirect)
  }

  return (
    <Button
      className='w-full'
      variant='secondary'
      tooltip={{
        content: 'Login with Google',
        side: 'bottom',
      }}
      asChild
    >
      <Link href={linkUrl}>
        <LogoGoogle />
      </Link>
    </Button>
  )
}
