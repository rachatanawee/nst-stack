import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { RegistrationsClientWrapper } from "./registrations-client-wrapper";

interface RawRegistration {
  id: string; // Changed to string
  registered_at: string;
  session: string;
  employees: {
    full_name: string;
    department: string;
  }[]; // Changed to array
}

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
  const formattedRegistrations = registrations.map((reg: RawRegistration) => ({
    id: String(reg.id), // Convert to string
    full_name: reg.employees[0]?.full_name || 'N/A', // Access first element of array
    department: reg.employees[0]?.department || 'N/A', // Access first element of array
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
