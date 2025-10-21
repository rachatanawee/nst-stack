"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

interface RegistrationData {
  employee_id: string;
  registered_at: string; // ISO string (current GMT+7 time)
  rowNumber?: number; // Excel row number for error reporting
}

interface RegistrationInsertData {
  employee_id: string;
  registered_at?: string;
  session?: string;
  is_night_shift: boolean;
}

export async function importRegistrations(data: RegistrationData[]) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const results = {
    successful: 0,
    failed: 0,
    errors: [] as Array<{row: number, employee_id: string, error: string}>
  };

  // Process each record individually to handle errors gracefully
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    try {
      // Validate data
      if (!row.employee_id || !row.registered_at) {
        results.failed++;
        results.errors.push({
          row: row.rowNumber || i + 2,
          employee_id: row.employee_id || 'Unknown',
          error: 'Missing employee_id or registered_at'
        });
        continue;
      }

      // Set default registration data
      const registrationData: RegistrationInsertData = {
        employee_id: row.employee_id,
        is_night_shift: true,
      };

      // Only set registered_at and session if registered_at is provided
      if (row.registered_at) {
        // Convert string to Date object for proper timestamptz handling
        const registeredDate = new Date(row.registered_at);

        // Validate date
        if (isNaN(registeredDate.getTime())) {
          results.failed++;
          results.errors.push({
            row: row.rowNumber || i + 2,
            employee_id: row.employee_id,
            error: 'Invalid date format'
          });
          continue;
        }

        // Determine session based on hour (assuming day shift is before 18:00, night shift is 18:00 and after)
        const hour = registeredDate.getHours();
        const session = hour >= 18 || hour < 6 ? "night" : "day";

        registrationData.registered_at = registeredDate.toISOString();
        registrationData.session = session;
      }

      // Determine table name based on environment
      const isDevelopment = process.env.NODE_ENV === 'development';
      const tableName = isDevelopment ? "registrations" : "registrations";

      const { error } = await supabase.from(tableName).upsert(registrationData, {
        onConflict: 'employee_id,session'
      });

      if (error) {
        results.failed++;
        results.errors.push({
          row: row.rowNumber || i + 2,
          employee_id: row.employee_id,
          error: error.message
        });
      } else {
        results.successful++;
      }
    } catch (err) {
      results.failed++;
      results.errors.push({
        row: row.rowNumber || i + 2,
        employee_id: row.employee_id || 'Unknown',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  // Log summary
  console.log(`Import completed: ${results.successful} successful, ${results.failed} failed`);
  if (results.errors.length > 0) {
    console.table(results.errors);
  }

  return {
    error: results.failed > 0 ? { message: `${results.failed} records failed to import` } : null,
    results
  };
}
