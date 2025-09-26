"use server"

import { revalidatePath } from "next/cache"

import { cookies } from "next/headers" // Import cookies

import { createClient } from "@/lib/supabase/server"

export async function createPrize(formData: FormData) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
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
    session_name: formData.get("session_name") as string, // Added session_name
    is_continue: formData.get("is_continue") === "on",
  }

  const { error } = await supabase.from("prizes").insert(data)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/prizes")
  return { success: true, message: "Prize created successfully." }
}

export async function updatePrize(id: string, formData: FormData) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  const imageFile = formData.get("image") as File
  const imageRemoved = formData.get("imageRemoved") === "true"; // Get the flag

  const data: {
    name: string;
    total_quantity: number;
    image_url: string | null; // Allow null
    session_name: string;
  } = {
    name: formData.get("name") as string,
    total_quantity: parseInt(formData.get("total_quantity") as string, 10),
    image_url: formData.get("current_image_url") as string,
    session_name: formData.get("session_name") as string,
  }

  if (imageRemoved) {
    // If image was removed, delete the old one from storage if it exists
    if (data.image_url) {
      const { error: deleteError } = await supabase.storage
        .from("prizes")
        .remove([data.image_url]); // Remove the old image
      if (deleteError) {
        console.error("Error deleting old image:", deleteError);
        // Continue with update, but log the error
      }
    }
    data.image_url = null; // Set image_url to null in the database
  } else if (imageFile && imageFile.size > 0) {
    // If there was an old image, delete it
    const oldImageUrl = formData.get("current_image_url") as string;
    if (oldImageUrl) {
      const { error: deleteError } = await supabase.storage
        .from("prizes")
        .remove([oldImageUrl]);
      if (deleteError) {
        console.error("Error deleting old image:", deleteError);
        // Don't block the update, but log the error
      }
    }

    // Only upload new image if not removed and a new file is provided
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
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { error } = await supabase.from("prizes").delete().eq("id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/prizes")
  return { success: true, message: "Prize deleted successfully." }
}

export async function duplicatePrize(id: string) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data: original, error: findError } = await supabase
    .from("prizes")
    .select("*")
    .eq("id", id)
    .single()

  if (findError || !original) {
    return { success: false, message: findError?.message || "Prize not found." }
  }

  const newData = {
    ...original,
    id: undefined, // Supabase will generate a new ID
    name: `${original.name} (Copy)`,
  }

  const { error: insertError } = await supabase.from("prizes").insert(newData)

  if (insertError) {
    return { success: false, message: insertError.message }
  }

  revalidatePath("/prizes")
  return { success: true, message: "Prize duplicated successfully." }
}
