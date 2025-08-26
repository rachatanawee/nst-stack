import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

import { PrizesClientWrapper } from "./prizes-client-wrapper"

export default async function PrizesPage() {
  const supabase = await createClient()
  const { data: prizes } = await supabase.from("prizes").select()

  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการของรางวัล</CardTitle>
        <CardDescription>เพิ่ม ลบ แก้ไขของรางวัล</CardDescription>
      </CardHeader>
      <CardContent>
        <PrizesClientWrapper prizes={prizes ?? []} />
      </CardContent>
    </Card>
  )
}
