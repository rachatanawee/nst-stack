'use server'

import { createClient } from '@/lib/supabase/server'
import { unstable_noStore as noStore } from 'next/cache'
import { cookies } from 'next/headers'

export async function getWinnerDetails() {
  noStore()
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)

  const { data, error } = await supabase
    .from('v_winner_details')
    .select('*')
    .order('drawn_at', { ascending: false })

  if (error) {
    console.error('Error fetching winner details:', error.message, error.details, error.hint, error.code)
    return []
  }

  return data
}
