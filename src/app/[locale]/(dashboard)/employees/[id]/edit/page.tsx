import { notFound } from "next/navigation"
import { cookies } from "next/headers"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

import { EmployeeForm } from "../../employee-form"

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditEmployeePage({ params }: PageProps) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("employee_id", (await params).id)
    .single()

  if (!employee) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Employee</CardTitle>
        <CardDescription>
          Make changes to the employee details here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeeForm employee={employee} />
      </CardContent>
    </Card>
  )
}
