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
    color: formData.get("color") as string,
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
    full_name: formData.get("full_name") as string,
    department: formData.get("department") as string,
    color: formData.get("color") as string,
  }

  const { error } = await supabase.from("employees").update(data).eq("employee_id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/employees")
  return { success: true, message: "Employee updated successfully." }
}

export async function deleteEmployee(id: string) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { error } = await supabase.from("employees").delete().eq("employee_id", id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/employees")
  return { success: true, message: "Employee deleted successfully." }
}

export async function duplicateEmployee(id: string) {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data: original, error: findError } = await supabase
    .from("employees")
    .select("*")
    .eq("employee_id", id)
    .single()

  if (findError || !original) {
    return { success: false, message: findError?.message || "Employee not found." }
  }

  const newData = {
    ...original,
    employee_id: `${original.employee_id}_copy`,
  }

  const { error: insertError } = await supabase.from("employees").insert(newData)

  if (insertError) {
    return { success: false, message: insertError.message }
  }

  revalidatePath("/employees")
  return { success: true, message: "Employee duplicated successfully." }
}
