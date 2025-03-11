import { LogoAvelin } from '@avelin/icons'
import { LoginWithGoogle } from './buttons'

export default function Page() {
  return (
    <div className="w-[400px] m-auto bg-popover-bg border border-color-border-subtle rounded-xl shadow-lg flex flex-col gap-6 px-8 py-12 items-center">
      <LogoAvelin className="size-16" />
      <div className="space-y-4">
        <h1 className="text-3xl font-[530] text-center">Login to Avelin</h1>
        <p className="text-center text-color-text-quaternary">
          Authenticate with your preferred provider.
        </p>
      </div>
      <div className="w-full flex gap-2">
        <LoginWithGoogle />
      </div>
    </div>
  )
}
