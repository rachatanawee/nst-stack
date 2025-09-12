'use client'

import { DataTable } from '@/components/data-table'
import { columns, type Winner } from './columns'

interface RewardsClientWrapperProps {
  winners: Winner[]
}

export function RewardsClientWrapper({ winners }: RewardsClientWrapperProps) {
  return <DataTable columns={columns} data={winners} />
}
