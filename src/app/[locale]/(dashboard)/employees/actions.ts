"use server"

import { revalidatePath } from "next/cache"

import { cookies } from "next/headers" // Import cookies

import { createClient } from "@/lib/supabase/server"

export async function createEmployee(formData: FormData) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const data = {
    employee_id: formData.get("employee_id") as string,
    full_name: formData.get("full_name") as string,
    department: formData.get("department") as string,
  }

  const { error } = await supabase.from("employees").insert(data)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/employees")
  return { success: true, message: "Employee created successfully." }
}

export async function updateEmployee(id: string, formData: FormData) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const data = {
    employee_id: formData.get("employee_id") as string,
    full_name: formData.get("full_name") as string,
    department: formData.get("department") as string,
  }

  const { error } = await supabase.from("employees").update(data).eq("id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/employees")
  return { success: true, message: "Employee updated successfully." }
}

export async function deleteEmployee(id: string) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/employees")
  return { success: true, message: "Employee deleted successfully." }
}