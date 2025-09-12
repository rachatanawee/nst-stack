'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  type Header,
} from "@tanstack/react-table"

interface ResizableHeader<TData, TValue> extends Header<TData, TValue> {
  getResizerProps: () => {
    onMouseDown: (event: React.MouseEvent) => void;
    onTouchStart: (event: React.TouchEvent) => void;
  };
}


import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input" // Added for search input

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  resourceName?: string
}

const LOCAL_STORAGE_PAGE_SIZE_KEY = "data-table-page-size"

export function DataTable<TData extends { id?: string; employee_id?: string }, TValue>({ 
  columns,
  data,
  resourceName,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('') // Added for global filter
  const [showSearchInput, setShowSearchInput] = React.useState(true) // Added for search input visibility

  const [pageSize, setPageSize] = React.useState(() => {
    if (typeof window !== "undefined") {
      const storedPageSize = localStorage.getItem(LOCAL_STORAGE_PAGE_SIZE_KEY)
      if (storedPageSize) {
        const parsedSize = Number(storedPageSize)
        if (!isNaN(parsedSize) && parsedSize > 0) {
          return parsedSize
        }
      }
    }
    return 10 // Default page size
  })

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
      setPageSize(newPagination.pageSize);
    },
  })

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_PAGE_SIZE_KEY, pageSize.toString())
    }
  }, [pageSize])


  function handleDoubleClick(row: TData) {
    if (resourceName) {
      const id = row.id ?? row.employee_id
      if (id) {
        router.push(`/${resourceName}/${id}/edit`)
      }
    }
  }

  return (
    <div>
      <div className="flex items-center py-4">
        {showSearchInput && (
          <Input
            placeholder="Search all columns..."
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="ml-2"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {(headerGroup.headers as ResizableHeader<TData, TValue>[]).map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                      className={header.column.getCanResize() ? "cursor-col-resize" : ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : (
                            <div
                              {...{
                                className: `font-bold ${header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : ""}`,
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                      {!header.isPlaceholder && header.column.getCanResize() && typeof header.getResizerProps === 'function' && (
                        <div
                          onMouseDown={header.getResizerProps().onMouseDown}
                          onTouchStart={header.getResizerProps().onTouchStart}
                          className={`resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onDoubleClick={() => handleDoubleClick(row.original)}
                  className={resourceName ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        </div>
    </div>
  )
}