import type { Zero } from '@avelin/zero'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Zero.Schema.WaitlistEntry>()

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('position', {
    header: 'Position',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('joinedAt', {
    header: 'Joined At',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('invitedAt', {
    header: 'Invited At',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('acceptedAt', {
    header: 'Accepted At',
    cell: (info) => info.getValue(),
  }),
]
