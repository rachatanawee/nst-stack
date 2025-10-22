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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, Tooltip,  ResponsiveContainer } from 'recharts'
import { ShieldCheck, User, Users, ChevronUp, ChevronDown } from 'lucide-react'
import { formatNumberWithCommas } from '@/lib/utils'

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
  const [sortColumn, setSortColumn] = useState<string>('group');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const client = createClient();
    
    const refetch = async () => {
        const { data: newData } = await client.rpc('get_public_registrations');
        if (newData) {
            setRawData(newData as PublicRegistration[]);
        }
    }

    const channel = client
      .channel('public-registrations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const sortedTableData = useMemo(() => {
    const data = ['Center', 'Green', 'Orange', 'Pink', 'Purple'].map(color => {
      const colorData = counts[color] || { total: 0, day: 0, night: 0, committee: 0 };
      const registered = colorData.total - colorData.committee;
      return {
        color,
        registered,
        committee: colorData.committee,
        total: colorData.total,
      };
    });

    return data.sort((a, b) => {
      let aValue: number | string = a[sortColumn as keyof typeof a] || 0;
      let bValue: number | string = b[sortColumn as keyof typeof b] || 0;

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [counts, sortColumn, sortDirection]);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-center" style={{ color: 'white' }}>HOYA Party 2025</h1>

      <Card>
        <CardHeader className="flex flex-row justify-center items-center p-1 gap-4">
            <div className="text-center">
              <CardTitle>Total</CardTitle>
              <p className="text-4xl font-bold" style={{ color: '#005bA4' }}>{formatNumberWithCommas(grandTotal)}</p>
            </div>
            <div className="text-center">
              <CardTitle>Committee</CardTitle>
              <p className="text-4xl font-bold">{formatNumberWithCommas(committeeCount)}</p>
            </div>
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
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table className="min-w-full border-collapse border border-gray-300">
              <TableHeader>
                <TableRow className="border-b-2 border-gray-300" style={{ backgroundColor: '#005bA4' }}>
                  <TableHead
                    className="font-bold text-base px-2 py-2 w-[25%] border-r border-gray-300 text-white cursor-pointer hover:bg-gray-700 select-none"
                    onClick={() => handleSort('color')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Group</span>
                      {getSortIcon('color')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-bold text-sm text-center px-2 py-2 w-[25%] border-r border-gray-300 text-white cursor-pointer hover:bg-gray-700 select-none"
                    onClick={() => handleSort('registered')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Regis.</span>
                      {getSortIcon('registered')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-bold text-sm text-center px-2 py-2 w-[25%] border-r border-gray-300 text-white cursor-pointer hover:bg-gray-700 select-none"
                    onClick={() => handleSort('committee')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Comm.</span>
                      {getSortIcon('committee')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-bold text-sm text-center px-2 py-2 w-[25%] text-white cursor-pointer hover:bg-gray-700 select-none"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Total</span>
                      {getSortIcon('total')}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTableData.map(item => (
                  <TableRow key={item.color} className="border-b border-gray-300" style={{ color: item.color }}>
                    <TableCell className="font-semibold text-lg px-2 py-2 border-r border-gray-300">{item.color}</TableCell>
                    <TableCell className="text-right text-lg px-2 py-2 border-r border-gray-300">{item.registered}</TableCell>
                    <TableCell className="text-right text-lg px-2 py-2 border-r border-gray-300">{item.committee}</TableCell>
                    <TableCell className="text-right text-lg px-2 py-2 font-bold border-r border-gray-300">{item.total}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 bg-gray-50">
                  <TableCell className="font-bold text-lg px-2 py-2 border-r border-gray-300">Total</TableCell>
                  <TableCell className="text-right text-lg px-2 py-2 border-r border-gray-300 font-bold">{grandTotal - committeeCount}</TableCell>
                  <TableCell className="text-right text-lg px-2 py-2 border-r border-gray-300 font-bold">{committeeCount}</TableCell>
                  <TableCell className="text-right text-lg px-2 py-2 font-bold border-r border-gray-300">{grandTotal}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card>
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
                                <span className="font-bold">{formatNumberWithCommas(item.committee)}</span>
                            </div>
                            <div className="flex justify-between text-2xl">
                                <div className="flex items-center gap-1">
                                  <User size={20} />
                                </div>
                                <span className="font-bold">{formatNumberWithCommas(item.value - item.committee)}</span>
                            </div>
                            <div className="flex justify-between text-2xl border-t mt-2 pt-2">
                                <div className="flex items-center gap-1">
                                  <Users size={20} />
                                </div>
                                <span className="font-bold">{formatNumberWithCommas(item.value)}</span>
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
                            label={(entry) => `${entry.name}: ${formatNumberWithCommas(entry.value as number)}`}
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
