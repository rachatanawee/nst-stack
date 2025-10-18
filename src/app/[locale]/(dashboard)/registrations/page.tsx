import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { RegistrationsClientWrapper } from "./registrations-client-wrapper";

interface RawRegistration {
  employee_id: string;
  full_name: string | null;
  department: string | null;
  session: string | null;
  registered_at: string | null;
  is_committee: boolean | null;
  is_night_shift: boolean | null;
}

export default async function RegistrationsPage() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: registrations, error } = await supabase
    .from("v_registrations")
    .select(`
      employee_id,
      full_name,
      department,
      session,
      registered_at,
      is_committee,
      is_night_shift
    `);

  if (error) {
    console.error("Error fetching registrations:", error);
    return <div>Error loading registrations.</div>;
  }
  console.log("Fetched registrations:", registrations);
  // Flatten the data for easier consumption by the data table
  const formattedRegistrations = registrations.map((reg: RawRegistration) => ({
    id: reg.employee_id,
    full_name: reg.full_name || 'N/A',
    department: reg.department || 'N/A',
    registered_at: reg.registered_at,
    session_name: reg.session || null,
    is_night_shift: reg.is_night_shift || false,
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
