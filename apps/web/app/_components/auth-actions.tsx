'use client'

import { useAuth } from '@/providers/auth-provider'
import { Button } from '@avelin/ui/button'
import Link from 'next/link'

export default function AuthActions() {
  const { isAuthenticated, isPending } = useAuth()

  if (isPending) return null

  return !isAuthenticated ? (
    <div className='inline-flex gap-2 animate-in fade-in-0'>
      <Button
        asChild
        size='lg'
        variant='secondary'
        className='text-lg'
      >
        <Link href='/login'>Log in</Link>
      </Button>
      <Button
        asChild
        size='lg'
        variant='default'
        className='text-lg'
      >
        <Link href='/login'>Sign up</Link>
      </Button>
    </div>
  ) : (
    <div className='animate-in fade-in-0'>
      <Button
        asChild
        size='lg'
        variant='secondary'
        className='text-lg'
      >
        <Link href='/dashboard'>Go to dashboard</Link>
      </Button>
    </div>
  )
}
