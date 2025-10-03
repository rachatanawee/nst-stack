'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export type PublicRegistration = {
  color: string | null;
  department: string | null;
  session: string | null;
  is_committee: boolean;
}

export async function getPublicRegistrations(): Promise<PublicRegistration[]> {
  const supabase = await createClient(cookies())

  const { data, error } = await supabase.rpc('get_public_registrations')

  if (error) {
    console.error('Error fetching public registrations:', error)
    return []
  }
  return data
}

export async function getCommitteeCount(): Promise<number> {
  const supabase = await createClient(cookies())
  const { data, error } = await supabase.rpc('get_committee_count')

  if (error) {
    console.error('Error fetching committee count:', error)
    return 0
  }
  return data || 0
}