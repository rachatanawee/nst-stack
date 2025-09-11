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

import { PrizeForm } from "../../prize-form"

type Props = {
  params: {
    id: string
  }
}

export default async function EditPrizePage({ params }: Props) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  const { data: prize } = await supabase
    .from("prizes")
    .select("*")
    .eq("id", (await params).id)
    .single()

  if (!prize) {
    notFound()
  }

  // Fetch signed URL for the image
  let signedUrl = null
  if (prize.image_url) {
    const { data } = await supabase.storage
      .from("prizes")
      .createSignedUrl(prize.image_url, 60) // 60 seconds validity
    signedUrl = data?.signedUrl ?? null
  }

  const prizeWithSignedUrl = { ...prize, signedUrl }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Prize</CardTitle>
        <CardDescription>
          Make changes to the prize details here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PrizeForm prize={prizeWithSignedUrl} />
      </CardContent>
    </Card>
  )
}
