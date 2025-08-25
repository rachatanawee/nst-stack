"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"

import { columns, type Employee } from "./columns"
import { EmployeeForm } from "./employee-form"

interface EmployeesClientWrapperProps {
  employees: Employee[]
}

export function EmployeesClientWrapper({ employees }: EmployeesClientWrapperProps) {
  const [filter, setFilter] = useState("")

  // Filter employees based on the search input
  const filteredEmployees = employees.filter(employee =>
    employee.full_name.toLowerCase().includes(filter.toLowerCase())
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
        <EmployeeForm>
          <Button className="ml-auto">Add Employee</Button>
        </EmployeeForm>
      </div>
      <DataTable columns={columns} data={filteredEmployees} />
    </>
  )
}