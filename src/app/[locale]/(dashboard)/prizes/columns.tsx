"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image" // Import Image

import { Checkbox } from "@/components/ui/checkbox"
import { DataTableActions } from "@/components/data-table-actions"

import { deletePrize, duplicatePrize } from "./actions"

export type Prize = {
  id: string
  name: string
  total_quantity: number
  image_url: string
  signedUrl: string | null
  session_name: string // Added session_name
  is_continue: boolean
  group_no: number | null
  order_no: number | null
  random_sec: number | null
}

export const columns: ColumnDef<Prize>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 50,
  },
  { // New column for session_name - moved to first position
    accessorKey: "session_name",
    header: "Session",
    size: 120,
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      const sessionName = row.getValue("session_name") as string;
      if (sessionName === "morning") {
        return "Day";
      } else if (sessionName === "evening") {
        return "Night";
      }
      return sessionName; // Default to original value if not morning/evening
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    minSize: 150,
    maxSize: 300,
  },
  {
    accessorKey: "total_quantity",
    header: "Quantity",
    size: 100,
    minSize: 80,
    maxSize: 150,
  },
  {
    accessorKey: "group_no",
    header: "Group No",
    size: 100,
    minSize: 80,
    maxSize: 120,
    cell: ({ row }) => {
      const groupNo = row.getValue("group_no") as number | null;
      return groupNo || "-";
    },
  },
  {
    accessorKey: "order_no",
    header: "Order No",
    size: 100,
    minSize: 80,
    maxSize: 120,
    cell: ({ row }) => {
      const orderNo = row.getValue("order_no") as number | null;
      return orderNo || "-";
    },
  },
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) => {
      const prize = row.original
      if (!prize.signedUrl) return null
      return <Image src={prize.signedUrl} alt={prize.name} width={64} height={64} className="h-16 w-16 object-cover" />
    },
    enableResizing: false,
    size: 100,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions
        row={row.original}
        resourceName="prizes"
        onDelete={deletePrize}
        onDuplicate={duplicatePrize}
      />
    ),
    enableResizing: false,
    size: 100,
  },
]
