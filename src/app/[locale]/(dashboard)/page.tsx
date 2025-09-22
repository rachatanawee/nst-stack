'use client'; // This must be the very first line

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  UserCheck,
  Gift,
  Award
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation('common'); // Specify the namespace

  const [stats, setStats] = useState({
    employeeCount: 0,
    registeredDay: 0,
    registeredNight: 0,
    prizesGiven: 0,
    prizesClaimed: 0,
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchStats() {
      const { count: employeeCount } = await supabase.from('employees').select('*', { count: 'exact', head: true });
      
      const { data: registrations, error: regError } = await supabase.from('registrations').select('session');
      if(regError) console.error("Error fetching registrations:", regError)

      const { count: prizesGiven } = await supabase.from('winners').select('*', { count: 'exact', head: true });
      
      const { count: prizesClaimed } = await supabase.from('winners').select('*', { count: 'exact', head: true }).eq('redemption_status', 'redeemed');

      const registeredDay = registrations?.filter(r => r.session === 'morning').length || 0;
      const registeredNight = registrations?.filter(r => r.session === 'evening').length || 0;

      setStats({
        employeeCount: employeeCount || 0,
        registeredDay,
        registeredNight,
        prizesGiven: prizesGiven || 0,
        prizesClaimed: prizesClaimed || 0,
      });
    }

    fetchStats();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registeredDay + stats.registeredNight}</div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Day:</span> {stats.registeredDay}, <span className="font-semibold">Night:</span> {stats.registeredNight}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prizes Awarded</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prizesGiven}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prizes Claimed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prizesClaimed}</div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 mt-4">
        <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
                Eventify Back Office
            </h3>
            <p className="text-sm text-muted-foreground">
                Manage employees, prizes, registrations, and winners with ease.
            </p>
        </div>
      </div>
    </>
  )
}

