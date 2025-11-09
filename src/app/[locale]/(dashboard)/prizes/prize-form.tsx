'use client';

import Image from "next/image"
import * as React from "react"
import { useRef } from "react"
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
  const imageInputRef = useRef<HTMLInputElement>(null); // Define ref
  const [imageRemoved, setImageRemoved] = React.useState(false); // New state

  const handleRemoveImage = () => {
    setImageRemoved(true);
    if (imageInputRef.current) {
      imageInputRef.current.value = ''; // Clear the file input
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            // Create a File object from the blob
            const file = new File([blob], `pasted_image_${Date.now()}.png`, { type: blob.type });
            
            // Create a DataTransfer object to simulate file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            // Set the files to the input element
            if (imageInputRef.current) {
              imageInputRef.current.files = dataTransfer.files;
            }
            break; // Only handle the first image found
          }
        }
      }
    }
  };

  async function handleSubmit(formData: FormData) {
    // Add imageRemoved flag to formData
    formData.append("imageRemoved", String(imageRemoved));

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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group_no" className="text-right">
              Group No
            </Label>
            <Input
              id="group_no"
              name="group_no"
              type="number"
              defaultValue={prize?.group_no ?? ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order_no" className="text-right">
              Order No
            </Label>
            <Input
              id="order_no"
              name="order_no"
              type="number"
              defaultValue={prize?.order_no ?? ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="random_sec" className="text-right">
              Random Sec
            </Label>
            <Input
              id="random_sec"
              name="random_sec"
              type="number"
              step="0.1"
              defaultValue={prize?.random_sec ?? ""}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_continue" className="text-right">
              Is Continue
            </Label>
            <Select name="is_continue" defaultValue={prize?.is_continue?.toString() || "false"}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select continue option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">False</SelectItem>
                <SelectItem value="true">True</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <div className="col-span-3 flex flex-col gap-2">
              <Input
                id="image"
                name="image"
                type="file"
                className="hidden" // Hide the actual file input
                ref={imageInputRef}
                // onPaste={handlePaste} // Remove onPaste from here
              />
              <div
                className="flex h-24 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground cursor-pointer"
                onPaste={handlePaste} // Add onPaste to the paste area
                onClick={() => imageInputRef.current?.click()} // Allow clicking to open file dialog
              >
                Paste image here or click to select file
              </div>
            </div>
          </div>
          {isEditing && prize?.signedUrl && !imageRemoved && ( // Conditionally render image preview
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3 flex items-center gap-2">
                <Image
                  src={prize.signedUrl}
                  alt={prize.name || "Prize Image"}
                  width={200}
                  height={200}
                  objectFit="contain"
                />
                <Button
                  type="button" // Important: prevent form submission
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </Button>
              </div>
            </div>
          )}
          {isEditing && prize?.image_url && !imageRemoved && ( // Conditionally render hidden input
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
