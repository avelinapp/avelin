import { Button } from '@avelin/ui/button'
import { toast } from '@avelin/ui/sonner'
import { createColumnHelper } from '@tanstack/react-table'
import type { WaitlistEntry } from '@/app/(app)/(admin)/admin/_/types'
import { api } from '@/lib/api'

const columnHelper = createColumnHelper<WaitlistEntry>()

export const tstColumnDefs = [
  columnHelper.accessor('id', {
    id: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('position', {
    id: 'position',
    header: 'Position',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('joinedAt', {
    id: 'joinedAt',
    header: 'Joined At',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('invitedAt', {
    id: 'invitedAt',
    header: 'Invited At',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('acceptedAt', {
    id: 'acceptedAt',
    header: 'Accepted At',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => {
      const entry = info.row.original
      async function sendInvite() {
        const { error } = await api.waitlist.invite.post({
          waitlistEntryId: entry.id,
        })

        if (error) {
          return toast.error('Failed to invite user.', {
            description: `${error.status} - ${error.value}`,
          })
        }

        toast.success('User invited.', {
          description: `Sent invite to ${entry.email}.`,
        })
      }

      return (
        <div className="flex items-center gap-2">
          <Button size="xs" onClick={sendInvite}>
            Invite
          </Button>
        </div>
      )
    },
  }),
]
