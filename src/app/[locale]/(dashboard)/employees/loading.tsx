import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EmployeesLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการข้อมูลพนักงาน</CardTitle>
        <CardDescription>เพิ่ม ลบ แก้ไขข้อมูลพนักงาน</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-64 animate-pulse rounded bg-muted" />
            <div className="h-10 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
