import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useCreateRoom = () =>
  useMutation({
    mutationFn: async () => {
      const res = await api.rooms.create.$post()
      return await res.json()
    },
  })
