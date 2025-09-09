import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { PrizeForm } from "../prize-form"

export default function NewPrizePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Prize</CardTitle>
        <CardDescription>Add a new prize to your event.</CardDescription>
      </CardHeader>
      <CardContent>
        <PrizeForm />
      </CardContent>
    </Card>
  )
}
