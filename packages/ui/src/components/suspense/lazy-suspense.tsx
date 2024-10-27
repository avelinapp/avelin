import { Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'
import DelayedFallback from './delayed-fallback'
import FadeIn from './fade-in'

interface LazySuspenseProps {
  component: () => Promise<{
    default: React.ComponentType<any>
  }>
  loader?: React.ReactNode
  delay?: number
}

function LazySuspense({ component, loader, delay = 500 }: LazySuspenseProps) {
  // const LazyComponent = lazy(async () => {
  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 5000)
  //   })
  //
  //   return component()
  // })
  const LazyComponent = lazy(component)

  return (
    <Suspense
      fallback={
        <DelayedFallback delay={delay}>
          {loader ?? <div>Suspense fallback triggered...</div>}
        </DelayedFallback>
      }
    >
      <FadeIn>
        <LazyComponent />
      </FadeIn>
    </Suspense>
  )
}

// Ensure this component is only rendered on the client side
export default dynamic(
  () =>
    Promise.resolve(({ component, loader, delay }: LazySuspenseProps) => {
      return (
        <LazySuspense
          component={component}
          loader={loader}
          delay={delay}
        />
      )
    }),
  { ssr: false },
)
