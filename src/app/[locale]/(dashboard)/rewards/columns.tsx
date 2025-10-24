'use client'

import { type ColumnDef } from '@tanstack/react-table'

export type Winner = {
  winner_id: string
  session_name: string
  group_no: number | null
  order_no: number | null
  employee_id: string
  full_name: string
  prize_name: string
  redeemed_at: string | null
  department: string
  drawn_at: string
  redemption_photo_path: string | null
}

export const columns: ColumnDef<Winner>[] = [
  {
    accessorKey: 'session_name',
    header: 'Session',
    size: 120,
    minSize: 100,
    maxSize: 150,
  },
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
    accessorKey: 'redeemed_at',
    header: 'Redeemed At',
    cell: ({ row }) => {
      const redeemedAt = row.getValue('redeemed_at')
      const redemptionPhotoPath = row.original.redemption_photo_path

      if (!redeemedAt) {
        return <div>-</div>
      }

      const date = new Date(redeemedAt as string)
      const formattedDateTime = new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23',
      }).format(date)

      if (redemptionPhotoPath) {
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/claim_prize/${redemptionPhotoPath}`
        return (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            {formattedDateTime}
          </a>
        )
      }

      return <div>{formattedDateTime}</div>
    },
    size: 180,
    minSize: 150,
    maxSize: 250,
  },
]
