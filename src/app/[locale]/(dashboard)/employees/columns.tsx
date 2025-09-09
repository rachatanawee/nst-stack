'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableActions } from '@/components/data-table-actions'

import { deleteEmployee, duplicateEmployee } from './actions'

export type Employee = {
  employee_id: string
  full_name: string
  department: string
}

export const columns: ColumnDef<Employee>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'employee_id',
    header: 'Employee ID',
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableActions
        row={row.original}
        resourceName="employees"
        onDelete={deleteEmployee}
        onDuplicate={duplicateEmployee}
      />
    ),
  },
]
