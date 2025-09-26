'use client'

import { useRouter } from 'next/navigation'

import { DataTable } from '@/components/data-table'

import { columns, type Employee } from './columns'

interface EmployeesClientWrapperProps {
  employees: Employee[]
}

export function EmployeesClientWrapper({ employees }: EmployeesClientWrapperProps) {
  const router = useRouter()
  const dataWithId = employees.map(employee => ({
    ...employee,
    id: employee.employee_id,
  }));

  return (
    <>
      <DataTable
        columns={columns}
        data={dataWithId}
        resourceName="employees"
        showAddButton={true}
        onAddClick={() => router.push('/employees/new')}
        showRefreshButton={true}
        showExportButton={true}
      />
    </>
  )
}
    