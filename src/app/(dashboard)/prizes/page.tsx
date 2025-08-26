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
  const { data: prizesData } = await supabase.from("prizes").select()

  const prizes = prizesData
    ? await Promise.all(
        prizesData.map(async (prize) => {
          if (!prize.image_url) {
            return { ...prize, signedUrl: null }
          }
          const { data } = await supabase.storage
            .from("prizes")
            .createSignedUrl(prize.image_url, 60) // 60 seconds validity
          return { ...prize, signedUrl: data?.signedUrl ?? null }
        })
      )
    : []

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
