"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { employeeSchema } from "./schema"

export async function createEmployee(formData: FormData) {
  if (!await checkRateLimit(10, 60000)) {
    logger.warn("Rate limit exceeded for createEmployee")
    return { success: false, message: "Too many requests. Please try again later." }
  }

  const rawData = {
    employee_id: formData.get("employee_id"),
    full_name: formData.get("full_name"),
    department: formData.get("department") || undefined,
    color: formData.get("color") || undefined,
  }

  const result = employeeSchema.safeParse(rawData)

  if (!result.success) {
    const error = result.error.issues[0]
    logger.warn("Validation failed for createEmployee", { error: error.message })
    return { success: false, message: error.message }
  }

  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { error } = await supabase.from("employees").insert(result.data)

  if (error) {
    logger.error("Failed to create employee", error, result.data)
    return { success: false, message: error.message }
  }

  logger.info("Employee created successfully", { employee_id: result.data.employee_id })
  revalidatePath("/employees")
  return { success: true, message: "Employee created successfully." }
}

export async function updateEmployee(id: string, formData: FormData) {
  if (!await checkRateLimit(10, 60000)) {
    logger.warn("Rate limit exceeded for updateEmployee")
    return { success: false, message: "Too many requests. Please try again later." }
  }

  const rawData = {
    employee_id: id,
    full_name: formData.get("full_name"),
    department: formData.get("department") || undefined,
    color: formData.get("color") || undefined,
  }

  const result = employeeSchema.safeParse(rawData)

  if (!result.success) {
    const error = result.error.issues[0]
    logger.warn("Validation failed for updateEmployee", { error: error.message })
    return { success: false, message: error.message }
  }

  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { ...updateData } = result.data
  const { error } = await supabase.from("employees").update(updateData).eq("employee_id", id)

  if (error) {
    logger.error("Failed to update employee", error, { id, ...updateData })
    return { success: false, message: error.message }
  }

  logger.info("Employee updated successfully", { employee_id: id })
  revalidatePath("/employees")
  return { success: true, message: "Employee updated successfully." }
}

export async function deleteEmployee(id: string) {
  if (!await checkRateLimit(10, 60000)) {
    logger.warn("Rate limit exceeded for deleteEmployee")
    return { success: false, message: "Too many requests. Please try again later." }
  }

  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { error } = await supabase.from("employees").delete().eq("employee_id", id)

  if (error) {
    logger.error("Failed to delete employee", error, { id })
    return { success: false, message: error.message }
  }

  logger.info("Employee deleted successfully", { employee_id: id })
  revalidatePath("/employees")
  return { success: true, message: "Employee deleted successfully." }
}

export async function duplicateEmployee(id: string) {
  if (!await checkRateLimit(10, 60000)) {
    return { success: false, message: "Too many requests. Please try again later." }
  }

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
