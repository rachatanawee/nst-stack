'use client'

import { useRouter } from 'next/navigation'

import { DataTable } from '@/components/data-table'

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
        showExportButton={true}
      />
    </>
  )
}
    