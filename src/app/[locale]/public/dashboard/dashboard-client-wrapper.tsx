'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { type PublicRegistration } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ShieldCheck, User, Users } from 'lucide-react'

type ColorCounts = { 
  [color: string]: { 
    total: number;
    day: number;
    night: number;
    committee: number;
  } 
};

function calculateColorCounts(data: PublicRegistration[]): ColorCounts {
  const counts: ColorCounts = {};
  for (const reg of data) {
    if (!reg.color) continue;
    
    if (!counts[reg.color]) {
      counts[reg.color] = { total: 0, day: 0, night: 0, committee: 0 };
    }

    counts[reg.color].total++;

    if (reg.session === 'day') {
      counts[reg.color].day++;
    } else if (reg.session === 'night') {
      counts[reg.color].night++;
    }

    if (reg.is_committee) {
      counts[reg.color].committee++;
    }
  }
  return counts;
}

export default function DashboardClientWrapper({ 
  initialData
}: { 
  initialData: PublicRegistration[]
}) {
  const searchParams = useSearchParams();
  const session = searchParams.get('session');
  const [rawData, setRawData] = useState(initialData);
  const [selectedSession, setSelectedSession] = useState(session || 'all');

  useEffect(() => {
    const client = createClient();
    
    const refetch = async () => {
        const { data: newData } = await client.rpc('get_public_registrations');
        if (newData) {
            setRawData(newData as PublicRegistration[]);
        }
    }

    const channel = client
      .channel('dashboard_updater_channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'dashboard_updater', filter: 'id=eq.1' },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const filteredData = useMemo(() => {
    if (selectedSession === 'all') {
      return rawData;
    }
    return rawData.filter(reg => reg.session === selectedSession);
  }, [rawData, selectedSession]);

  const counts = useMemo(() => calculateColorCounts(filteredData), [filteredData]);
  const sortedColors = useMemo(() => Object.keys(counts).sort(), [counts]);
  const committeeCount = useMemo(() => {
    return filteredData.filter(reg => reg.is_committee).length;
  }, [filteredData]);

  const grandTotal = useMemo(() => {
    return filteredData.length;
  }, [filteredData]);

  const chartData = useMemo(() => {
    return sortedColors.map(color => ({
      name: color,
      value: counts[color].total, // Pie chart uses 'value'
      day: counts[color].day,
      night: counts[color].night,
      committee: counts[color].committee,
    }));
  }, [counts, sortedColors]);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-center" style={{ color: 'white' }}>HOYA Party 2025</h1>

      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <CardTitle>Overview</CardTitle>
            <div className="w-[180px]">
              <Select onValueChange={setSelectedSession} value={selectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-8 pt-4 border-t">
            <div>
              <CardTitle>Total Registrations</CardTitle>
              <p className="text-4xl font-bold" style={{ color: '#005bA4' }}>{grandTotal}</p>
            </div>
            <div>
              <CardTitle>Committee Members</CardTitle>
              <p className="text-4xl font-bold">{committeeCount}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card>
            <CardHeader>
                <CardTitle>Summary by Color</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {chartData.map(item => (
                        <div key={item.name} className="border rounded-lg p-4 flex flex-col" style={{ backgroundColor: item.name, color: item.name === 'Center' ? 'blue' : 'white' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 rounded-full bg-white"></div>
                                <span className="font-bold text-2xl">{item.name}</span>
                            </div>
                            <div className="flex justify-between text-2xl">
                                <div className="flex items-center gap-1">
                                  <ShieldCheck size={20} />
                                </div>
                                <span className="font-bold">{item.committee}</span>
                            </div>
                            <div className="flex justify-between text-2xl">
                                <div className="flex items-center gap-1">
                                  <User size={20} />
                                </div>
                                <span className="font-bold">{item.value - item.committee}</span>
                            </div>
                            <div className="flex justify-between text-2xl border-t mt-2 pt-2">
                                <div className="flex items-center gap-1">
                                  <Users size={20} />
                                </div>
                                <span className="font-bold">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Chart</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie 
                            data={chartData} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={150}
                            label={(entry) => `${entry.name}: ${entry.value}`}
                        >
                            {chartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.name} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
