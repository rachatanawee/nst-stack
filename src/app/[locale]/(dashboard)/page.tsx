'use client'; // This must be the very first line

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  UserCheck,
  Gift,
  Award,
  Moon
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from '@/components/ui/checkbox';

// Number formatting utility function
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

interface DepartmentStats {
  total: number;
  registered: number;
  prizes: number;
}

interface ColorStats {
  total: number;
  registered: number;
}

interface Employee {
  department: string;
  color: string;
}

interface Registration {
  employee_id: string;
  full_name: string | null;
  color: string | null;
  department: string | null;
  session: string | null;
  registered_at: string | null;
  is_committee: boolean | null;
  is_night_shift: boolean | null;
}

interface Winner {
  department: string;
  session?: string;
  redemption_status?: string;
}

export default function DashboardPage() {

  const [stats, setStats] = useState({
    employeeCount: 0,
    registeredDay: 0,
    registeredNight: 0,
    prizesGiven: 0,
    prizesClaimed: 0,
    nightShiftCount: 0,
  });

  const [departmentStats, setDepartmentStats] = useState<Record<string, DepartmentStats>>({});
  const [colorStats, setColorStats] = useState<Record<string, ColorStats>>({});

  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [allWinners, setAllWinners] = useState<Winner[]>([]);

  const [showDay, setShowDay] = useState(true);
  const [showNight, setShowNight] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchAllData() {
      // Overall Stats
      const { count: employeeCount } = await supabase.from('employees').select('*', { count: 'exact', head: true });
      const { count: registeredDay } = await supabase.from('v_registrations').select('*', { count: 'exact', head: true }).eq('session', 'day');
      const { count: registeredNight } = await supabase.from('v_registrations').select('*', { count: 'exact', head: true }).eq('session', 'night');
      const { count: prizesGiven } = await supabase.from('v_winner_details').select('*', { count: 'exact', head: true });
      const { count: prizesClaimed } = await supabase.from('v_winner_details').select('*', { count: 'exact', head: true }).eq('redemption_status', 'redeemed');
      const { count: nightShiftCount } = await supabase.from('v_registrations').select('*', { count: 'exact', head: true }).eq('is_night_shift', true);

      setStats({
        employeeCount: employeeCount || 0,
        registeredDay: registeredDay || 0,
        registeredNight: registeredNight || 0,
        prizesGiven: prizesGiven || 0,
        prizesClaimed: prizesClaimed || 0,
        nightShiftCount: nightShiftCount || 0,
      });

      // Detailed Stats Data
      const { data: employees } = await supabase.from('employees').select('department, color');
      const { data: registrations } = await supabase.from('v_registrations').select('employee_id, full_name, color, department, session, registered_at, is_committee, is_night_shift');

      // Get winners data from v_winner_details (already includes session info)
      const { data: winnersData } = await supabase
        .from('v_winner_details')
        .select(`
          department,
          session_name,
          redemption_status
        `);

      // Transform winners data to match expected interface
      const winners = winnersData?.map(winner => ({
        department: winner.department,
        session: winner.session_name || null,
        redemption_status: winner.redemption_status
      })) || [];

      if (employees) setAllEmployees(employees);
      if (registrations) setAllRegistrations(registrations);
      if (winners) setAllWinners(winners);
    }

    fetchAllData();
  }, []);

  useEffect(() => {
    if (allEmployees.length === 0 || allRegistrations.length === 0) return;

    // Filter registrations based on checkbox selections
    const filteredRegistrations = allRegistrations.filter(reg => {
      const dayMatch = showDay && reg.session === 'day';
      const nightMatch = showNight && reg.session === 'night';
      return dayMatch || nightMatch;
    });

    // Calculate filtered counts from the filtered data
    const filteredDayCount = filteredRegistrations.filter(reg => reg.session === 'day').length;
    const filteredNightCount = filteredRegistrations.filter(reg => reg.session === 'night').length;
    const filteredNightShiftCount = filteredRegistrations.filter(reg => reg.is_night_shift === true).length;

    // Filter winners based on session (if they have session info)
    const filteredWinners = allWinners.filter(winner => {
      if (!winner.session) return true; // Include winners without session info
      const dayMatch = showDay && winner.session === 'day';
      const nightMatch = showNight && winner.session === 'night';
      return dayMatch || nightMatch;
    });

    const filteredPrizesGiven = filteredWinners.length;
    const filteredPrizesClaimed = filteredWinners.filter(winner => winner.redemption_status === 'redeemed').length;

    // Update stats with filtered data
    setStats(prevStats => ({
      ...prevStats,
      registeredDay: filteredDayCount,
      registeredNight: filteredNightCount,
      prizesGiven: filteredPrizesGiven,
      prizesClaimed: filteredPrizesClaimed,
      nightShiftCount: filteredNightShiftCount,
    }));

    // Color Stats - calculate from filtered registrations
    const cStats: { [key: string]: { total: number; registered: number } } = {};
    for (const emp of allEmployees) {
      const color = emp.color || 'N/A';
      if (!cStats[color]) cStats[color] = { total: 0, registered: 0 };
      cStats[color].total++;
    }
    for (const reg of filteredRegistrations) {
      const color = reg.color || 'N/A';
      if (cStats[color]) cStats[color].registered++;
    }
    setColorStats(cStats);

    // Department Stats - calculate from filtered data
    const dStats: { [key: string]: { total: number; registered: number; prizes: number } } = {};
    for (const emp of allEmployees) {
      const dept = emp.department || 'N/A';
      if (!dStats[dept]) dStats[dept] = { total: 0, registered: 0, prizes: 0 };
      dStats[dept].total++;
    }
    for (const reg of filteredRegistrations) {
      const dept = reg.department || 'N/A';
      if (dStats[dept]) dStats[dept].registered++;
    }
    for (const winner of filteredWinners) {
      const dept = winner.department || 'N/A';
      if (dStats[dept]) dStats[dept].prizes++;
    }
    setDepartmentStats(dStats);

  }, [showDay, showNight, allEmployees, allRegistrations, allWinners]);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.registeredDay + stats.registeredNight)}</div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Day:</span> {formatNumber(stats.registeredDay)}, <span className="font-semibold">Night:</span> {formatNumber(stats.registeredNight)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.employeeCount)}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prizes Awarded</CardTitle>
            <Gift className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.prizesGiven)}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prizes Claimed</CardTitle>
            <Award className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.prizesClaimed)}</div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 dark:bg-indigo-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Night Shift Registrations</CardTitle>
            <Moon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.nightShiftCount)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-8 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filterDay"
            checked={showDay}
            onCheckedChange={(checked) => setShowDay(!!checked)}
          />
          <label htmlFor="filterDay" className="text-sm font-medium leading-none">Day</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="filterNight"
            checked={showNight}
            onCheckedChange={(checked) => setShowNight(!!checked)}
          />
          <label htmlFor="filterNight" className="text-sm font-medium leading-none">Night</label>
        </div>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Department</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Registered</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prizes Won</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {Object.entries(departmentStats).map(([dept, data]: [string, DepartmentStats]) => (
                    <tr key={dept} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">{dept}</td>
                      <td className="p-4 align-middle">{formatNumber(data.total)}</td>
                      <td className="p-4 align-middle">{formatNumber(data.registered)}</td>
                      <td className="p-4 align-middle">{formatNumber(data.prizes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Color</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Registered</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {Object.entries(colorStats).map(([color, data]: [string, ColorStats]) => (
                    <tr key={color} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }}></div>
                        {color}
                      </td>
                      <td className="p-4 align-middle">{formatNumber(data.total)}</td>
                      <td className="p-4 align-middle">{formatNumber(data.registered)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
