'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers' // Import cookies

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const cookieStore = cookies() // Get cookieStore
  const supabase = await createClient(cookieStore) // Pass cookieStore

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?message=Could not authenticate user: ${error.message}`)
  }

  return redirect('/')
}
