import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { getWinnerDetails } from "./actions"
import { RewardsClientWrapper } from "./rewards-client-wrapper"

export default async function RewardsPage() {
  const winners = await getWinnerDetails()

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายชื่อผู้ได้รับรางวัล</CardTitle>
        <CardDescription>รายชื่อผู้ได้รับรางวัลทั้งหมด</CardDescription>
      </CardHeader>
      <CardContent>
        <RewardsClientWrapper winners={winners ?? []} />
      </CardContent>
    </Card>
  )
}
