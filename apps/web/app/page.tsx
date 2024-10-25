import {
  CodeIcon,
  HighlighterIcon,
  PackageIcon,
  TerminalIcon,
  UsersRoundIcon,
  ZapIcon,
} from '@avelin/icons'
import Title from './_components/title'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-12 p-4'>
      <div className='flex flex-col items-center gap-12'>
        <TerminalIcon className='size-24 text-zinc-800 sm:size-64' />
        <Title />
        <p className='text-center font-mono text-lg tracking-tighter sm:text-2xl'>
          Create a code room to get started.
        </p>
      </div>
      <div className='flex flex-col items-center gap-6 text-center font-mono'>
        <ul className='list-inside space-y-1 text-left text-sm *:flex *:items-center *:gap-2 *:text-center *:text-muted-foreground sm:space-y-2 sm:text-base'>
          <li>
            <PackageIcon className='text-blue-500/70' /> Powered by{' '}
            <Link
              className='font-semibold hover:underline'
              href='https://microsoft.github.io/monaco-editor'
            >
              Monaco Editor.
            </Link>
          </li>
          <li>
            <UsersRoundIcon className='text-green-500/70' /> Real-time
            collaboration.
          </li>
          <li>
            <HighlighterIcon className='text-orange-500/70' /> Syntax
            highlighting.
          </li>
          <li>
            <ZapIcon className='text-yellow-500/70' /> Language servers.
          </li>
          <li>
            <CodeIcon className='text-purple-500/70' /> Over 20 languages.
          </li>
        </ul>
      </div>
      {/* <CreateRoomButton /> */}
    </div>
  )
}
