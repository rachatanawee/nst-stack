'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

export type Winner = {
  winner_id: string
  employee_id: string
  full_name: string
  prize_name: string
  claimed_at: string | null
  department: string
  drawn_at: string
}

export const columns: ColumnDef<Winner>[] = [
  {
    accessorKey: 'employee_id',
    header: 'Employee ID',
    size: 150,
    minSize: 120,
    maxSize: 200,
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    size: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 150,
    minSize: 120,
    maxSize: 250,
  },
  {
    accessorKey: 'prize_name',
    header: 'Prize Name',
    size: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    accessorKey: 'drawn_at',
    header: 'Awarded At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('drawn_at'))
      const formattedDateTime = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23',
      }).format(date)
      return <div>{formattedDateTime}</div>
    },
    size: 180,
    minSize: 150,
    maxSize: 250,
  },
  {
    accessorKey: 'claimed_at',
    header: 'Claimed',
    cell: ({ row }) => {
      const claimed = !!row.getValue('claimed_at')
      return <Checkbox checked={claimed} disabled />
    },
    size: 100,
    minSize: 80,
    maxSize: 120,
  },
]
