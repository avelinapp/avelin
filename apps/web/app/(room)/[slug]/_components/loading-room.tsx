import { LogoAvelin } from '@avelin/icons'
import { cn } from '@avelin/ui/cn'

export function LoadingRoom({
  isPending,
  error,
}: {
  isPending: boolean
  error: Error | null
}) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center h-full w-full')}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-6 p-12',
          'animate-in fade-in-0 zoom-in-95',
        )}
      >
        <LogoAvelin className='size-24' />
        <h1 className='text-2xl font-medium tracking-tight'>
          {isPending
            ? 'Loading your code room...'
            : error
              ? 'We ran into an issue.'
              : 'Done.'}
        </h1>
        <p className='text-color-text-secondary mt-2'>{error?.message}</p>
      </div>
    </div>
  )
}
