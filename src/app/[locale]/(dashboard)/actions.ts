'use server'

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getUserInfo() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    console.error("Error fetching user role:", error)
    // Fallback or default role
    return { email: user.email, role: "User" }
  }

  return { email: user.email, role: profile.role || "User" }
}