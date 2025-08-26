import { // Keep Card components
  Card, // Keep Card components
  CardContent, // Keep Card components
  CardDescription, // Keep Card components
  CardHeader, // Keep Card components
  CardTitle, // Keep Card components
} from "@/components/ui/card" // Keep Card components
import { createClient } from "@/lib/supabase/server"


import { EmployeesClientWrapper } from "./employees-client-wrapper" // Import the new client wrapper

export default async function EmployeesPage() {
  const supabase = await createClient()
  const { data: employees } = await supabase.from("employees").select()

  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการข้อมูลพนักงาน</CardTitle>
        <CardDescription>เพิ่ม ลบ แก้ไขข้อมูลพนักงาน</CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeesClientWrapper employees={employees ?? []} />
      </CardContent>
    </Card>
  )
}