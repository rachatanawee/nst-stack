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

  return (
    <>
      <DataTable
        columns={columns}
        data={prizes}
        resourceName="prizes"
        showAddButton={true}
        onAddClick={() => router.push('/prizes/new')}
        showRefreshButton={true}
        showExportButton={true}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    </>
  )
}
