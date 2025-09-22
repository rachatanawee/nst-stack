'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Helper function to check permissions
async function checkPermission(permission: string) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data: hasPerm, error } = await supabase.rpc('has_permission', {
    p_permission_name: permission,
  });

  if (error) {
    console.error('Permission check error:', error);
    throw new Error('Could not check permissions.');
  }
  if (!hasPerm) {
    throw new Error(`You don't have the required permission: ${permission}`);
  }
}

export async function getUsers() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore, true); // Use service role for admin actions

  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error listing users:', usersError);
    return [];
  }

  const userIds = users.users.map(u => u.id);
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, roles(id, name)')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return [];
  }

  const usersWithRoles = users.users.map((user) => {
    const profile = profiles.find((p) => p.id === user.id);
    const role = profile?.roles as { id: number; name: string } | undefined;

    return {
      id: user.id,
      email: user.email || 'N/A',
      role_id: role?.id,
      role_name: role?.name || 'N/A',
      created_at: user.created_at,
    };
  });

  return usersWithRoles;
}

export async function getRoles() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data, error } = await supabase.from('roles').select('id, name');

  if (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
  return data;
}

export async function createUser({
  email,
  password,
  role_id,
}: { email: string; password?: string; role_id: number }) {
  try {
    const cookieStore = cookies();
    await checkPermission('users.manage');
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
      role_id,
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

export async function updateUserRole(userId: string, role_id: number) {
  try {
    const cookieStore = cookies();
    await checkPermission('users.manage');
    const supabase = await createClient(cookieStore);

    const { error } = await supabase
      .from('profiles')
      .update({ role_id })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/users');
    return { success: true, message: 'User role updated.' };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const cookieStore = cookies();
    await checkPermission('users.manage');
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