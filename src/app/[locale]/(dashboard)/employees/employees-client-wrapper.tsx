'use client'

import { useState } from 'react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table'
import { cn } from '@/lib/utils'

import { columns, type Employee } from './columns'

interface EmployeesClientWrapperProps {
  employees: Employee[]
}

export function EmployeesClientWrapper({ employees }: EmployeesClientWrapperProps) {
  const [filter, setFilter] = useState('')

  // Filter employees based on the search input
  const filteredEmployees = employees.filter((employee) =>
    employee.full_name.toLowerCase().includes(filter.toLowerCase()),
  )

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
          href="/employees/new"
          className={cn(buttonVariants({ variant: 'default' }), 'ml-auto')}
        >
          Add Employee
        </Link>
      </div>
      <DataTable columns={columns} data={filteredEmployees} />
    </>
  )
}
