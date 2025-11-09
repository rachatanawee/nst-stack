'use client'

import { useRouter } from "next/navigation"
import * as React from "react"
import { type SortingState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"

import { columns, type Prize } from "./columns"


interface PrizesClientWrapperProps {
  prizes: Prize[]
}

export function PrizesClientWrapper({ prizes }: PrizesClientWrapperProps) {
  const router = useRouter()

  // Set default sorting by session_name, group_no, order_no
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "session_name", desc: false },
    { id: "group_no", desc: false },
    { id: "order_no", desc: false },
  ])

  // Group filtering
  const [groupFilter, setGroupFilter] = React.useState<string>("all")

  // Get unique group numbers
  const uniqueGroups = React.useMemo(() => {
    const groups = prizes
      .map(prize => prize.group_no)
      .filter((group): group is number => group !== null && group !== undefined)
      .filter((group, index, arr) => arr.indexOf(group) === index)
      .sort((a, b) => a - b)
    return groups
  }, [prizes])

  // Filter data based on group
  const filteredData = React.useMemo(() => {
    if (groupFilter === "all") {
      return prizes
    }
    const groupNumber = parseInt(groupFilter)
    return prizes.filter(prize => prize.group_no === groupNumber)
  }, [prizes, groupFilter])

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredData}
        resourceName="prizes"
        showAddButton={true}
        onAddClick={() => router.push('/prizes/new')}
        showRefreshButton={true}
        showExportButton={true}
        sorting={sorting}
        onSortingChange={setSorting}
        groupFilter={groupFilter}
        onGroupFilterChange={setGroupFilter}
        uniqueGroups={uniqueGroups}
      />
    </>
  )
}
