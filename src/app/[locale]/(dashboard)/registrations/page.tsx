import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { RegistrationsClientWrapper } from "./registrations-client-wrapper";

interface RawRegistration {
  registered_at: string | null; // Can be null if employee is not registered
  full_name: string | null;
  session_name: string | null;
  employee_id: string; // employee_id is the primary key from employees table
  department: string | null;
}

export default async function RegistrationsPage() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: registrations, error } = await supabase
    .from("v_lucky_draw") // Changed to v_lucky_draw
    .select(`
      registered_at,
      full_name,
      session_name,
      employee_id,
      department
    `);

  if (error) {
    console.error("Error fetching registrations:", error);
    return <div>Error loading registrations.</div>;
  }
  console.log("Fetched registrations:", registrations);
  // Flatten the data for easier consumption by the data table
  const formattedRegistrations = registrations.map((reg: RawRegistration) => ({
    id: reg.employee_id, // Use employee_id as the ID
    full_name: reg.full_name || 'N/A',
    department: reg.department || 'N/A',
    registered_at: reg.registered_at,
    session_name: reg.session_name || null, // Use session_name as required by Registration interface
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Registrations</CardTitle>
        <CardDescription>View and manage event registrations.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegistrationsClientWrapper registrations={formattedRegistrations} />
      </CardContent>
    </Card>
  );
}
