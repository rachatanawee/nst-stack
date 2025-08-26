'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers' // Import cookies

export async function logout() {
  const cookieStore = cookies() // Get cookieStore
  const supabase = await createClient(cookieStore) // Pass cookieStore
  await supabase.auth.signOut()
  return redirect('/login')
}