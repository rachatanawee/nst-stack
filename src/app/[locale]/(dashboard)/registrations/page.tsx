import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { RegistrationsClientWrapper } from "./registrations-client-wrapper";

export default async function RegistrationsPage() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: registrations, error } = await supabase
    .from("registrations")
    .select(`
      id,
      registered_at,
      session,
      employees (
        full_name,
        department
      )
    `);

  if (error) {
    console.error("Error fetching registrations:", error);
    return <div>Error loading registrations.</div>;
  }

  // Flatten the data for easier consumption by the data table
  const formattedRegistrations = registrations.map((reg: any) => ({
    id: reg.id,
    full_name: reg.employees?.full_name || 'N/A',
    department: reg.employees?.department || 'N/A',
    registered_at: reg.registered_at,
    session: reg.session,
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
