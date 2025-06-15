import { columns } from '@/app/(app)/(admin)/admin/_/columns'
import { DataTable } from '@/app/(app)/(admin)/admin/_/data-table'
import type { Zero } from '@avelin/zero'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

export function WaitlistEntriesTable({
  data,
}: { data: Zero.Schema.WaitlistEntry[] }) {
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility: {
        id: false,
      },
      // rowSelection,
      // columnFilters: tstFilters,
    },
  })

  // Step 6: Render the table!
  return (
    <div className="w-full col-span-2">
      {/* <div className="flex items-center pb-4 gap-2"> */}
      {/*   <DataTableFilter */}
      {/*     filters={filters} */}
      {/*     columns={columns} */}
      {/*     actions={actions} */}
      {/*     strategy={strategy} */}
      {/*   /> */}
      {/* </div> */}
      <DataTable table={table} />
    </div>
  )
}
