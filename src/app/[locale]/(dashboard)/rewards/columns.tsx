'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

export type Winner = {
  winner_id: string
  full_name: string
  prize_name: string
  claimed_at: string | null
  department: string
  drawn_at: string
}

export const columns: ColumnDef<Winner>[] = [
  {
    accessorKey: 'full_name',
    header: 'Full Name',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'prize_name',
    header: 'Prize Name',
  },
  {
    accessorKey: 'drawn_at',
    header: 'Awarded At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('drawn_at'))
      const formattedDateTime = date.toLocaleString(undefined, { hour12: false })
      return <div>{formattedDateTime}</div>
    },
  },
  {
    accessorKey: 'claimed_at',
    header: 'Claimed',
    cell: ({ row }) => {
      const claimed = !!row.getValue('claimed_at')
      return <Checkbox checked={claimed} disabled />
    },
  },
]
