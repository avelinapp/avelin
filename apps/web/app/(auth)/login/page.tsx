import { LogoGithub, LogoGoogle } from '@avelin/icons'
import { MailIcon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { LogoAvelin } from '@avelin/icons'
import Link from 'next/link'

export default function Page() {
  return (
    <div className='w-[400px] m-auto bg-white border border-neutral-100 rounded-xl shadow-lg flex flex-col gap-6 p-8 items-center'>
      <LogoAvelin className='size-16' />
      <div className='space-y-4'>
        <h1 className='text-3xl font-semibold tracking-tight text-center'>
          Login to Avelin
        </h1>
        <p className='text-center text-neutral-500'>
          Authenticate with your preferred provider.
        </p>
      </div>
      <div className='w-full flex gap-2'>
        <Button
          className='w-full'
          variant='secondary'
          asChild
        >
          <Link href={process.env.API_URL + '/auth/google'}>
            <LogoGoogle />
          </Link>
        </Button>
        <Button
          className='w-full'
          variant='secondary'
          disabled
        >
          <LogoGithub />
        </Button>
        <Button
          className='w-full'
          variant='secondary'
          disabled
        >
          <MailIcon />
        </Button>
      </div>
    </div>
  )
}
