"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { createPrize, updatePrize } from "./actions"
import { type Prize } from "./columns"

type PrizeFormProps = {
  prize?: Prize
  children: React.ReactNode
}

export function PrizeForm({ prize, children }: PrizeFormProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!prize

  async function handleSubmit(formData: FormData) {
    const action = isEditing ? updatePrize.bind(null, prize.id) : createPrize
    const result = await action(formData)

    if (result.success) {
      toast.success(result.message)
      setOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Prize" : "Add Prize"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the prize details here."
              : "Add a new prize to your event."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={prize?.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="total_quantity"
                name="total_quantity"
                type="number"
                defaultValue={prize?.total_quantity}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                className="col-span-3"
              />
            </div>
            {isEditing && prize?.image_url && (
              <input type="hidden" name="current_image_url" value={prize.image_url} />
            )}
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Save changes" : "Create prize"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
