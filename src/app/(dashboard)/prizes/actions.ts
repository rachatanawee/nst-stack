"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export async function createPrize(formData: FormData) {
  const supabase = await createClient()
  const imageFile = formData.get("image") as File

  let imageUrl = ""

  if (imageFile && imageFile.size > 0) {
    const { data: imageData, error: imageError } = await supabase.storage
      .from("prizes")
      .upload(`prize-image-${Date.now()}`, imageFile)

    if (imageError) {
      return { success: false, message: imageError.message }
    }
    imageUrl = imageData.path
  }

  const data = {
    name: formData.get("name") as string,
    total_quantity: parseInt(formData.get("total_quantity") as string, 10),
    image_url: imageUrl,
  }

  const { error } = await supabase.from("prizes").insert(data)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/prizes")
  return { success: true, message: "Prize created successfully." }
}

export async function updatePrize(id: string, formData: FormData) {
  const supabase = await createClient()
  const imageFile = formData.get("image") as File

  const data = {
    name: formData.get("name") as string,
    total_quantity: parseInt(formData.get("total_quantity") as string, 10),
    image_url: formData.get("current_image_url") as string,
  }

  if (imageFile && imageFile.size > 0) {
    const { data: imageData, error: imageError } = await supabase.storage
      .from("prizes")
      .upload(`prize-image-${Date.now()}`, imageFile)

    if (imageError) {
      return { success: false, message: imageError.message }
    }
    data.image_url = imageData.path
  }

  const { error } = await supabase.from("prizes").update(data).eq("id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/prizes")
  return { success: true, message: "Prize updated successfully." }
}

export async function deletePrize(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("prizes").delete().eq("id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/prizes")
  return { success: true, message: "Prize deleted successfully." }
}