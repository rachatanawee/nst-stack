import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { EmployeeForm } from "../employee-form"

export default function NewEmployeePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Employee</CardTitle>
        <CardDescription>Add a new employee to your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeeForm />
      </CardContent>
    </Card>
  )
}
