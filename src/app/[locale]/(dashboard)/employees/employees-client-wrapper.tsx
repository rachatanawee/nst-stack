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
  return (
    <>
      <div className="flex items-center py-4">
        <Link
          href="/employees/new"
          className={cn(buttonVariants({ variant: 'default' }), 'ml-auto')}
        >
          Add Employee
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={employees}
        resourceName="employees"
      />
    </>
  )
}
    