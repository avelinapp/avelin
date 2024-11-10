import {
  CodeIcon,
  HighlighterIcon,
  PackageIcon,
  UsersRoundIcon,
  ZapIcon,
  LogoAvelin,
} from '@avelin/icons'
import Title from './_components/title'
import Link from 'next/link'
import CreateRoomButton from './_components/create-room-button'

export default function Home() {
  return (
    <div className='h-screen flex w-full flex-1 flex-col items-center justify-center gap-12 p-4'>
      <div></div>
      <div className='flex flex-col items-center gap-12'>
        <LogoAvelin className='size-24 text-primary-bg sm:size-64 drop-shadow-xl' />
        <Title />
        <p className='text-center font-mono font-medium text-lg tracking-tighter sm:text-2xl'>
          Create a code room to get started.
        </p>
      </div>
      <div className='flex flex-col items-center gap-6 text-center font-mono'>
        <ul className='list-inside space-y-1 text-left text-sm *:flex *:items-center *:gap-2 *:text-center *:text-color-text-accent font-medium sm:space-y-2 sm:text-base'>
          <li>
            <PackageIcon
              className='text-blue-500/70'
              strokeWidth={2.25}
            />{' '}
            Powered by{' '}
            <Link
              className='hover:underline underline-offset-2'
              href='https://microsoft.github.io/monaco-editor'
            >
              Monaco Editor.
            </Link>
          </li>
          <li>
            <UsersRoundIcon
              className='text-green-500/70'
              strokeWidth={2.25}
            />
            Real-time collaboration.
          </li>
          <li>
            <HighlighterIcon
              className='text-orange-500/70'
              strokeWidth={2.25}
            />
            Syntax highlighting.
          </li>
          <li>
            <ZapIcon
              className='text-yellow-500/70'
              strokeWidth={2.25}
            />
            Language servers.
          </li>
          <li>
            <CodeIcon
              className='text-purple-500/70'
              strokeWidth={2.25}
            />
            Over 20 languages.
          </li>
        </ul>
      </div>
      <CreateRoomButton />
    </div>
  )
}
