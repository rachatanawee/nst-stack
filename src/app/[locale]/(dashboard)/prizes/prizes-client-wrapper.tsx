"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"

import { columns, type Prize } from "./columns"
import { PrizeForm } from "./prize-form"

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
        <PrizeForm>
          <Button className="ml-auto">Add Prize</Button>
        </PrizeForm>
      </div>
      <DataTable columns={columns} data={filteredPrizes} />
    </>
  )
}
