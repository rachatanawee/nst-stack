'use client';

import Image from "next/image"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select" // Added Select imports
import { cn } from "@/lib/utils"

import { createPrize, deletePrize, updatePrize } from "./actions"
import { type Prize } from "./columns"

type PrizeFormProps = {
  prize?: Prize
}

export function PrizeForm({ prize }: PrizeFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState(false)
  const isEditing = !!prize

  async function handleSubmit(formData: FormData) {
    const action = isEditing ? updatePrize.bind(null, prize.id) : createPrize
    const result = await action(formData)

    if (result.success) {
      toast.success(result.message)
      router.push("/prizes")
    } else {
      toast.error(result.message)
    }
  }

  async function onDelete() {
    if (!prize) return
    setIsDeleting(true)
    const result = await deletePrize(prize.id)
    if (result.success) {
      toast.success(result.message)
      router.push("/prizes")
    } else {
      toast.error(result.message)
    }
    setIsDeleting(false)
  }

  return (
    <AlertDialog>
      <form action={handleSubmit} className="sm:max-w-[425px]">
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
          {/* New input for session_name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="session_name" className="text-right">
              Session
            </Label>
            <Select name="session_name" defaultValue={prize?.session_name || "all"}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="morning">Day</SelectItem>
                <SelectItem value="evening">Night</SelectItem>
              </SelectContent>
            </Select>
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
          {isEditing && prize?.signedUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3">
                <Image
                  src={prize.signedUrl}
                  alt={prize.name || "Prize Image"}
                  width={200}
                  height={200}
                  objectFit="contain"
                />
              </div>
            </div>
          )}
          {isEditing && prize?.image_url && (
            <input type="hidden" name="current_image_url" value={prize.image_url} />
          )}
        </div>
        <div className="flex justify-between items-center">
          <div>
            {isEditing && (
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href="/prizes"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancel
            </Link>
            <Button type="submit">
              {isEditing ? "Save changes" : "Create prize"}
            </Button>
          </div>
        </div>
      </form>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            prize &quot;{prize?.name}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}