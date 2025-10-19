'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function getWinners(session: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: winners, error } = await supabase
    .from('v_winner_details')
    .select('*')
    .eq('session_name', session)
    .order('group_no')
    .order('order_no')
    .order('winner_id');

  if (error) {
    console.error('Error fetching winners:', error);
    throw error;
  }

  if (!winners) {
    return [];
  }

  // Create signed URLs for prize images
  const winnersWithSignedUrls = await Promise.all(
    winners.map(async (winner) => {
      if (winner.prize_image_url) {
        const { data: signedUrlData } = await supabase.storage
          .from('prizes')
          .createSignedUrl(winner.prize_image_url, 3600); // Signed URL valid for 1 hour
        return { ...winner, prize_signed_url: signedUrlData?.signedUrl };
      }
      return { ...winner, prize_signed_url: null };
    })
  );

  return winnersWithSignedUrls;
}
