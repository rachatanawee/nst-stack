'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table'
import { cn } from '@/lib/utils'

import { columns, type Employee } from './columns'

interface EmployeesClientWrapperProps {
  employees: Employee[]
}

export function EmployeesClientWrapper({ employees }: EmployeesClientWrapperProps) {
  const router = useRouter()
  return (
    <>
      <DataTable
        columns={columns}
        data={employees}
        resourceName="employees"
        showAddButton={true}
        onAddClick={() => router.push('/employees/new')}
        showRefreshButton={true}
      />
    </>
  )
}
    