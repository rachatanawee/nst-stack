import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getServerEnv } from '@/lib/env'

export const createClient = async (cookieStorePromise: ReturnType<typeof cookies>, useServiceRole = false) => {
  const cookieStore = await cookieStorePromise; // Await the cookieStore promise
  const serverEnv = getServerEnv()

  const supabaseKey = useServiceRole
    ? serverEnv.SUPABASE_SERVICE_ROLE_KEY
    : serverEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  return createServerClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
