import dynamic from 'next/dynamic'
import { lazy, Suspense } from 'react'
import DelayedFallback from './delayed-fallback'
import FadeIn from './fade-in'

// biome-ignore lint/complexity/noBannedTypes: false
interface LazySuspenseProps<P = {}>
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  component: () => Promise<{
    default: React.ComponentType<P>
  }>
  loader?: React.ReactNode
  delay?: number
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  componentProps?: P
}

function LazySuspense({
  component,
  loader,
  delay = 500,
  containerProps,
  componentProps,
}: LazySuspenseProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense
      fallback={
        <DelayedFallback delay={delay}>
          {loader ?? <div>Suspense fallback triggered...</div>}
        </DelayedFallback>
      }
    >
      <FadeIn {...containerProps}>
        <LazyComponent {...componentProps} />
      </FadeIn>
    </Suspense>
  )
}

// Ensure this component is only rendered on the client side
export default dynamic(
  () =>
    Promise.resolve(
      ({
        component,
        loader,
        delay,
        containerProps,
        componentProps,
      }: LazySuspenseProps) => {
        return (
          <LazySuspense
            component={component}
            loader={loader}
            delay={delay}
            containerProps={containerProps}
            componentProps={componentProps}
          />
        )
      },
    ),
  { ssr: false },
)
