import QueryClientProvider from './query-client-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider>{children}</QueryClientProvider>
}
