'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { createEmployee, deleteEmployee, updateEmployee } from './actions'
import { type Employee } from './columns'

type EmployeeFormProps = {
  employee?: Employee
}

export function EmployeeForm({ employee }: EmployeeFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState(false)
  const isEditing = !!employee

  async function handleSubmit(formData: FormData) {
    const action = isEditing
      ? updateEmployee.bind(null, employee.employee_id)
      : createEmployee
    const result = await action(formData)

    if (result.success) {
      toast.success(result.message)
      router.back()
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  async function onDelete() {
    if (!employee) return
    setIsDeleting(true)
    const result = await deleteEmployee(employee.employee_id)
    if (result.success) {
      toast.success(result.message)
      router.back()
      router.refresh()
    } else {
      toast.error(result.message)
    }
    setIsDeleting(false)
  }

  return (
    <AlertDialog>
      <form action={handleSubmit} className="sm:max-w-[425px]">
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
              disabled={isEditing}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Select name="color" defaultValue={employee?.color ?? ''}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Center">Center</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="Orange">Orange</SelectItem>
                <SelectItem value="Pink">Pink</SelectItem>
                <SelectItem value="Purple">Purple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            {isEditing && (
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href="/employees"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Cancel
            </Link>
            <Button type="submit">
              {isEditing ? 'Save changes' : 'Create employee'}
            </Button>
          </div>
        </div>
      </form>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            employee &quot;{employee?.full_name}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className={buttonVariants({ variant: 'destructive' })}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
