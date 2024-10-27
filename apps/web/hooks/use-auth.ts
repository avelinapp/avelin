import { queries } from '@/lib/queries'
import { useQuery } from '@tanstack/react-query'

export function useAuth() {
  return useQuery({
    ...queries.auth.check(),
    retry: false,
    staleTime: 30 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}
