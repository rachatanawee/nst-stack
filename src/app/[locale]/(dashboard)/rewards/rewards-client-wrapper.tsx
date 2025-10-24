'use client'

import { useState, useMemo } from 'react'
import { DataTable } from '@/components/data-table'
import { columns, type Winner } from './columns'
import { ColumnDef } from '@tanstack/react-table'
import { Label } from '@/components/ui/label'

interface RewardsClientWrapperProps {
  winners: Winner[]
}

export function RewardsClientWrapper({ winners }: RewardsClientWrapperProps) {
  const [session, setSession] = useState<'all' | 'day' | 'night'>('all')

  const filteredWinners = useMemo(() => {
    if (session === 'all') return winners
    return winners.filter(w => w.session_name.toLowerCase() === session)
  }, [winners, session])

  const sortedWinners = useMemo(() => {
    return [...filteredWinners].sort((a, b) => {
      // 1. Sort by session_name
      if (a.session_name !== b.session_name) {
        return a.session_name.localeCompare(b.session_name)
      }
      // 2. Sort by group_no (nulls last)
      if (a.group_no !== b.group_no) {
        if (a.group_no === null) return 1
        if (b.group_no === null) return -1
        return a.group_no - b.group_no
      }
      // 3. Sort by order_no (nulls last)
      if (a.order_no !== b.order_no) {
        if (a.order_no === null) return 1
        if (b.order_no === null) return -1
        return a.order_no - b.order_no
      }
      // 4. Sort by employee_id
      return a.employee_id.localeCompare(b.employee_id)
    })
  }, [filteredWinners])

  const dataWithId = sortedWinners.map(winner => ({
    ...winner,
    id: winner.winner_id,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <Label className="font-semibold">Session:</Label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="session"
              value="all"
              checked={session === 'all'}
              onChange={(e) => setSession(e.target.value as 'all')}
              className="cursor-pointer"
            />
            <span>All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="session"
              value="day"
              checked={session === 'day'}
              onChange={(e) => setSession(e.target.value as 'day')}
              className="cursor-pointer"
            />
            <span>Day</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="session"
              value="night"
              checked={session === 'night'}
              onChange={(e) => setSession(e.target.value as 'night')}
              className="cursor-pointer"
            />
            <span>Night</span>
          </label>
        </div>
      </div>
      <DataTable 
        columns={columns as ColumnDef<typeof dataWithId[number]>[]} 
        data={dataWithId} 
        resourceName="rewards"
        showRefreshButton={true} 
        showExportButton={true} 
      />
    </div>
  )
}
