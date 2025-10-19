'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export interface Winner {
  winner_id: number;
  full_name: string;
  employee_id: string;
  department: string;
}

export interface AwardGroup {
  group_no: number | null;
  order_no: number | null;
  prize_id: string;
  prize_name: string;
  redemption_photo_path: string | null;
  count: number;
  winners: Winner[];
}

export async function getWinners(session: string): Promise<Array<{
  winner_id: number;
  full_name: string;
  employee_id: string;
  department: string;
  group_no: number | null;
  order_no: number | null;
  prize_id: string;
  prize_name: string;
  redemption_photo_path: string | null;
}>> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from('v_winner_details')
      .select(`
        winner_id,
        full_name,
        employee_id,
        department,
        group_no,
        order_no,
        prize_id,
        prize_name,
        redemption_photo_path
      `)
      .eq('session_name', session)
      .order('group_no', { ascending: false, nullsFirst: false })
      .order('order_no', { ascending: false, nullsFirst: false })
      .order('employee_id', { ascending: true });

    if (error) {
      console.error('Error fetching winners:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWinners:', error);
    return [];
  }
}
