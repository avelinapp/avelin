'use client'

import { Auth } from '@avelin/database'
import { Avatar, AvatarFallback, AvatarImage } from '@avelin/ui/avatar'
import { Button } from '@avelin/ui/button'
import { useKeyPress } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { motion } from 'framer-motion'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    layout='position'
    className='inline-flex gap-2 items-center'
    initial={{ opacity: 0, filter: 'blur(2px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    transition={{ ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

export const UnauthenticatedActions = () => (
  <Wrapper>
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
  </Wrapper>
)

export const AuthenticatedActions = ({ user }: { user: Auth['user'] }) => {
  // const router = useRouter()

  function handleDashboardNavigation() {
    toast('Dashboard is coming soon...', {
      id: 'dashboard-navigation-incomplete',
      icon: '👀',
    })
  }

  useKeyPress(['a'], () => {
    // router.push('/dashboard')
    handleDashboardNavigation()
  })

  return (
    <Wrapper>
      <Button
        // asChild
        size='lg'
        variant='secondary'
        className='text-lg inline-flex items-center gap-2 group'
        onClick={handleDashboardNavigation}
      >
        {/* <Link href='/dashboard'> */}
        <Avatar className='size-7 shrink-0'>
          <AvatarImage src={user.picture!} />
          <AvatarFallback className='leading-none'>
            {user.name
              .split(' ')
              .map((s) => s[0]?.toUpperCase())
              .join('')}
          </AvatarFallback>
        </Avatar>
        Dashboard
        <KeyboardShortcut />
        {/* </Link> */}
      </Button>
    </Wrapper>
  )
}

const KeyboardShortcut = () => (
  <div className='ml-2 font-mono rounded-sm size-7 inline-flex items-center justify-center text-secondary-text font-normal bg-gray-5 text-base'>
    A
  </div>
)
