'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function getUsers() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore, true);

  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError);
    return [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, role');

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return [];
  }

  const usersWithRoles = users.users.map((user) => {
    const profile = profiles.find((p) => p.id === user.id);
    return {
      id: user.id,
      email: user.email || 'N/A',
      role: profile?.role || 'staff', // Default to 'staff' if no role found
      created_at: user.created_at,
    };
  });

  return usersWithRoles;
}

export async function createUser({
  email,
  password,
  role,
}: { email: string; password?: string; role: 'super_admin' | 'staff' }) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore, true);

  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Automatically confirm email for admin created users
  });

  if (error) {
    console.error('Error creating user:', error);
    return { error: error.message };
  }

  // Insert role into profiles table
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.user?.id,
    role,
  });

  if (profileError) {
    console.error('Error inserting profile:', profileError);
    // Consider deleting the user created in auth.users if profile insertion fails
    return { error: profileError.message };
  }

  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function updateUserRole(userId: string, role: 'super_admin' | 'staff') {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore, true);

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/users');
  return { success: true };
}

export async function deleteUser(userId: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore, true);

  const { error } = await supabase.auth.admin.deleteUser(userId);
