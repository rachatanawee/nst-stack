"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { createEmployee, updateEmployee } from "./actions"
import { type Employee } from "./columns"

type EmployeeFormProps = {
  employee?: Employee
  children: React.ReactNode
}

export function EmployeeForm({ employee, children }: EmployeeFormProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!employee

  async function handleSubmit(formData: FormData) {
    const action = isEditing
      ? updateEmployee.bind(null, employee.id)
      : createEmployee
    const result = await action(formData)

    if (result.success) {
      toast.success(result.message)
      setOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the employee details here."
              : "Add a new employee to your team."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee_id" className="text-right">
                Employee ID
              </Label>
              <Input
                id="employee_id"
                name="employee_id"
                defaultValue={employee?.employee_id}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={employee?.full_name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                name="department"
                defaultValue={employee?.department}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Save changes" : "Create employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}