'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers' // Import cookies and headers

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
    const currentLocale = (await headers()).get('x-next-intl-locale') || 'en'; // Get current locale from headers
    return redirect(`/${currentLocale}/login?message=Could not authenticate user: ${error.message}`);
  }

  const currentLocale = (await headers()).get('x-next-intl-locale') || 'en'; // Get current locale for successful redirect
  return redirect(`/${currentLocale}/`);
}
