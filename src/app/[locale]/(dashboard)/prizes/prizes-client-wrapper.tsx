'use client'

import { useRouter } from "next/navigation"

import { DataTable } from "@/components/data-table"

import { columns, type Prize } from "./columns"


interface PrizesClientWrapperProps {
  prizes: Prize[]
}

export function PrizesClientWrapper({ prizes }: PrizesClientWrapperProps) {
  const router = useRouter()

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
      />
    </>
  )
}
