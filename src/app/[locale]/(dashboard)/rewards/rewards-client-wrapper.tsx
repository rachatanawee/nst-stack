'use client'

import { DataTable } from '@/components/data-table'
import { columns, type Winner } from './columns'
import { ColumnDef } from '@tanstack/react-table'; // Import ColumnDef

interface RewardsClientWrapperProps {
  winners: Winner[]
}

export function RewardsClientWrapper({ winners }: RewardsClientWrapperProps) {
  const dataWithId = winners.map(winner => ({
    ...winner,
    id: winner.winner_id, // Map winner_id to id
  }));

  return <DataTable columns={columns as ColumnDef<typeof dataWithId[number]>[]} data={dataWithId} showRefreshButton={true} />
}
