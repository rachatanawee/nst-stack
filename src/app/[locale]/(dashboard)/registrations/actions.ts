"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

interface RegistrationData {
  employee_id: string;
  registered_at: string; // ISO string
}

export async function importRegistrations(data: RegistrationData[]) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const registrationsToInsert = data.map((row) => {
    
    const session = "night" // Determine session based on time

    return {
      employee_id: row.employee_id,
      registered_at: row.registered_at,
      session: session,
      is_night_shift: true,
    };
  });

  const { error } = await supabase.from("registrations_test").insert(registrationsToInsert);

  return { error };
}
