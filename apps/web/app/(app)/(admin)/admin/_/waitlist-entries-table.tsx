import { DataTableFilter, useDataTableFilters } from '@avelin/ui/filters'
import { createTSTColumns, createTSTFilters } from '@avelin/ui/filters/tst'
import type { Zero } from '@avelin/zero'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { tstColumnDefs } from '@/app/(app)/(admin)/admin/_/columns'
import { DataTable } from '@/app/(app)/(admin)/admin/_/data-table'
import { columnsConfig } from '@/app/(app)/(admin)/admin/_/filters'

export function WaitlistEntriesTable({
  data,
}: {
  data: Zero.Schema.WaitlistEntry[]
}) {
  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: 'client',
    data: data,
    columnsConfig,
  })

  const tstColumns = useMemo(
    () =>
      createTSTColumns({
        columns: tstColumnDefs,
        configs: columns,
      }),
    [columns],
  )

  const tstFilters = useMemo(() => createTSTFilters(filters), [filters])

  const table = useReactTable({
    data,
    columns: tstColumns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility: {
        id: false,
      },
      columnFilters: tstFilters,
    },
  })

  // Step 6: Render the table!
  return (
    <div className="w-full col-span-2">
      <div className="flex items-center pb-4 gap-2">
        <DataTableFilter
          filters={filters}
          columns={columns}
          actions={actions}
          strategy={strategy}
        />
      </div>
      <DataTable table={table} />
    </div>
  )
}
