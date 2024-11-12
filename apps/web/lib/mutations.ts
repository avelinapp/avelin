import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useCreateRoom = () =>
  useMutation({
    mutationFn: async () => {
      const res = await api.rooms.create.$post()
      return await res.json()
    },
  })

export const useLogout = () =>
  useMutation({
    mutationFn: async () => {
      const res = await api.auth.logout.$post()

      if (res.status >= 400) {
        const { error } = (await res.json()) as { error: string }
        throw new Error(error)
      }
    },
  })
