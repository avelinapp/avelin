import { CircleDotDashedIcon } from '@avelin/icons'
import { createColumnConfigHelper } from '@avelin/ui/filters'
import type { WaitlistEntry } from '@/app/(app)/(admin)/admin/_/types'

const dtf = createColumnConfigHelper<WaitlistEntry>()

export const columnsConfig = [
  dtf
    .option()
    .id('status')
    .accessor((row) => row.status)
    .displayName('Status')
    .icon(CircleDotDashedIcon)
    .transformOptionFn((x) => ({ value: x, label: x }))
    .build(),
] as const
