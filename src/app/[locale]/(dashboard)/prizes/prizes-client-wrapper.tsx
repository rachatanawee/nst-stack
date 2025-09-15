"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { cn } from "@/lib/utils"

import { columns, type Prize } from "./columns"


interface PrizesClientWrapperProps {
  prizes: Prize[]
}

export function PrizesClientWrapper({ prizes }: PrizesClientWrapperProps) {
  const router = useRouter()
  const [filter, setFilter] = useState("")

  const filteredPrizes = prizes.filter(prize =>
    prize.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredPrizes}
        resourceName="prizes"
        showAddButton={true}
        onAddClick={() => router.push('/prizes/new')}
        showRefreshButton={true}
        showExportButton={true}
      />
    </>
  )
}
