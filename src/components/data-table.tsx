'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Plus,
  Edit,
  Trash,
  Copy,
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
  // New props for action buttons
  showAddButton?: boolean
  onAddClick?: () => void
  showEditButton?: boolean
  onEditClick?: (selectedRowIds: string[]) => void
  showDeleteButton?: boolean
  onDeleteClick?: (selectedRowIds: string[]) => void
  showDuplicateButton?: boolean
  onDuplicateClick?: (selectedRowIds: string[]) => void
  enableColumnResizing?: boolean
}

const LOCAL_STORAGE_PAGE_SIZE_KEY = "data-table-page-size"
const LOCAL_STORAGE_COLUMN_SIZING_KEY = "data-table-column-sizing"

export function DataTable<TData extends { id?: string; employee_id?: string }, TValue>({
  columns,
  data,
  resourceName,
  showAddButton,
  onAddClick,
  showEditButton,
  onEditClick,
  showDeleteButton,
  onDeleteClick,
  showDuplicateButton,
  onDuplicateClick,
  enableColumnResizing = true,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('') // Added for global filter
  const [columnSizing, setColumnSizing] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_COLUMN_SIZING_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          // ignore
        }
      }
    }
    return {}
  })
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
    onColumnSizingChange: setColumnSizing, // Add this line
    enableColumnResizing,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      rowSelection,
      globalFilter,
      columnSizing, // Add this line
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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_COLUMN_SIZING_KEY, JSON.stringify(columnSizing))
    }
  }, [columnSizing])


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
        <div className="flex items-center"> {/* Left side: Search */}
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
        <div className="flex items-center ml-auto"> {/* Right side: Action Buttons */}
          {showAddButton && onAddClick && (
            <Button
              variant="outline"
              size="icon"
              onClick={onAddClick}
              className="ml-2"
            >
              <Plus className="h-4 w-4 text-primary" />
            </Button>
          )}
          {showEditButton && onEditClick && table.getFilteredSelectedRowModel().rows.length === 1 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEditClick(table.getFilteredSelectedRowModel().rows.map(row => row.id))}
              className="ml-2"
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
          )}
          {showDeleteButton && onDeleteClick && table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDeleteClick(table.getFilteredSelectedRowModel().rows.map(row => row.id))}
              className="ml-2"
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          )}
          {showDuplicateButton && onDuplicateClick && table.getFilteredSelectedRowModel().rows.length === 1 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDuplicateClick(table.getFilteredSelectedRowModel().rows.map(row => row.id))}
              className="ml-2"
            >
              <Copy className="h-4 w-4 text-primary" />
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                      {!header.isPlaceholder && header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
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
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
