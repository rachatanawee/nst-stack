"use client"

import { useState } from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { cn } from "@/lib/utils"

import { columns, type Prize } from "./columns"


interface PrizesClientWrapperProps {
  prizes: Prize[]
}

export function PrizesClientWrapper({ prizes }: PrizesClientWrapperProps) {
  const [filter, setFilter] = useState("")

  const filteredPrizes = prizes.filter(prize =>
    prize.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <Link
          href="/prizes/new"
          className={cn(buttonVariants({ variant: "default" }), "ml-auto")}
        >
          Add Prize
        </Link>
      </div>
      <DataTable columns={columns} data={filteredPrizes} resourceName="prizes" />
    </>
  )
}
