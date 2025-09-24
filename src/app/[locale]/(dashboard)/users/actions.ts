'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';



export async function getUsers() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore, true); // Use service role for admin actions

  const { data: authUsers, error: usersError } =
    await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError);
    return [];
  }

  const userIds = authUsers.users.map((u) => u.id);
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, role, full_name')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    // Still return users, just without role info
  }

  const usersWithRoles = authUsers.users.map((user) => {
    const profile = profiles?.find((p) => p.id === user.id);
    return {
      id: user.id,
      email: user.email || 'N/A',
      full_name: profile?.full_name || 'N/A',
      role: profile?.role || 'N/A',
      created_at: user.created_at,
    };
  });

  return usersWithRoles;
}

export async function getRoles() {
  // The roles are now stored as text in the profiles table.
  // We'll return a hardcoded list for now.
  // In a real application, you might want to query distinct roles from the profiles table.
  return ['super_admin', 'staff'];
}

export async function createUser({
  email,
  password,
  role,
  full_name,
}: {
  email: string;
  password?: string;
  role: string;
  full_name: string;
}) {
  try {
    const cookieStore = cookies();
    //await checkPermission('users.manage');
    const supabase = await createClient(cookieStore, true); // Use service role for admin actions

    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm email for admin created users
    });

    if (error) {
      console.error('Error creating user:', error);
      return { success: false, message: error.message };
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.user?.id,
      role,
      full_name,
    });

    if (profileError) {
      console.error('Error inserting profile:', profileError);
      // Consider deleting the user created in auth.users if profile insertion fails
      return { success: false, message: profileError.message };
    }

    revalidatePath('/users');
    return { success: true, message: 'User created successfully.' };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, message };
  }
}

export async function updateUser(
  userId: string,
  data: { role?: string; full_name?: string; password?: string }
) {
  try {
    const cookieStore = cookies();
    //await checkPermission('users.manage');
    const supabase = await createClient(cookieStore, true); // Use service role for admin actions

    const { password, ...profileData } = data;

    // Update profile if there's data for it
    if (Object.keys(profileData).length > 0) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', userId);

        if (profileError) {
            console.error('Error updating user profile:', profileError);
            return { success: false, message: profileError.message };
        }
    }

    // Update password if provided and not an empty string
    if (password) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { password }
      );

      if (authError) {
        console.error('Error updating user password:', authError);
        return { success: false, message: authError.message };
      }
    }

    revalidatePath('/users');
    return { success: true, message: 'User updated successfully.' };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const cookieStore = cookies();
    //await checkPermission('users.manage');
    const supabase = await createClient(cookieStore, true); // Use service role for admin actions

    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return { success: false, message: deleteError.message };
    }

    revalidatePath('/users');
    return { success: true, message: 'User deleted successfully.' };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, message };
  }
}