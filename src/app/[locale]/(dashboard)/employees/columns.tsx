'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableActions } from '@/components/data-table-actions'

import { deleteEmployee, duplicateEmployee } from './actions'

export type Employee = {
  employee_id: string
  full_name: string
  department: string
  color: string | null
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
    enableResizing: true,
    size: 50,
  },
  {
    accessorKey: 'employee_id',
    header: 'Employee ID',
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    size: 150,
    minSize: 150,
    maxSize: 200,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 150,
    minSize: 120,
    maxSize: 300,
  },
  {
    accessorKey: "color",
    header: "Color",
    size: 150,
    minSize: 120,
    maxSize: 250,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions
        row={row.original}
        resourceName="employees"
        onDelete={deleteEmployee}
        onDuplicate={duplicateEmployee}
      />
    ),
    enableResizing: false,
    size: 100,
  },
]
