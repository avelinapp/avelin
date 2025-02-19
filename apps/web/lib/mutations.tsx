import { api } from '@/lib/api'
import { KeyRoundIcon } from '@avelin/icons'
import { toast } from '@avelin/ui/sonner'
import { type QueryClient, useMutation } from '@tanstack/react-query'
import { LOGOUT_ACTION_TOAST_ID } from './constants'
import { toasts } from './toasts'

interface MutationOptions {
  queryClient: QueryClient
}

export const useCreateRoom = (options: MutationOptions) =>
  useMutation({
    mutationFn: async () => {
      const res = await api.rooms.create.post()
      return res.data!
    },
    onSuccess: (data) => {
      toasts.rooms.create.success(data.slug ?? data.id)
    },
    onSettled: () => {
      options.queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })

export const useDeleteRoom = (options: MutationOptions) =>
  useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const { data, error } = await api.rooms({ idOrSlug: roomId }).delete()

      if (error) {
        switch (error.status) {
          case 403:
          case 404:
            throw new Error(error.value.error)
          default:
            throw new Error('Unknown error occurred.')
        }
      }

      return data
    },
    onSuccess: (data) => {
      toasts.rooms.delete.success(data.id)
    },
    onError: (error, { roomId }) => {
      toasts.rooms.delete.error(roomId, error)
    },
    onSettled: () => {
      options.queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })

export const useLogout = () =>
  useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: async () => {
      const res = await api.auth.logout.post()

      if (res.status >= 400) {
        throw new Error(res.data?.message)
      }
    },
    onMutate: () => {
      toast('Logging out...', {
        id: LOGOUT_ACTION_TOAST_ID,
        icon: <KeyRoundIcon className="size-4 shrink-0 animate-bounce" />,
      })
    },
  })
