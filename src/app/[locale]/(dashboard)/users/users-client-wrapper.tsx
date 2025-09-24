'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { getColumns } from './columns';
import { getRoles, getUsers, updateUser, deleteUser } from './actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  
} from '@/components/ui/dialog';
import { UserForm } from './user-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

const editFormSchema = z.object({
  full_name: z.string().min(1, 'Please enter a full name.'),
  role: z.string().min(1, 'Please select a role.'),
  password: z.string().optional(),
}).refine(data => !data.password || data.password.length === 0 || data.password.length >= 6, {
  message: "Password must be at least 6 characters if provided.",
  path: ["password"],
});
type EditFormValues = z.infer<typeof editFormSchema>;

export function UsersClientWrapper() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
  });

  async function fetchData() {
    setLoading(true);
    const [fetchedUsers, fetchedRoles] = await Promise.all([
      getUsers(),
      getRoles(),
    ]);
    setUsers(fetchedUsers as User[]);
    setRoles(fetchedRoles);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingUser) {
      form.reset({
        full_name: editingUser.full_name,
        role: editingUser.role,
        password: '',
      });
    }
  }, [editingUser, form]);

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  async function onEditSubmit(values: EditFormValues) {
    if (!editingUser) return;
    const result = await updateUser(editingUser.id, values);
    if (result.success) {
      toast.success(result.message);
      setIsEditDialogOpen(false);
      fetchData(); // Refresh data
    } else {
      toast.error(result.message);
    }
  }

  async function handleDelete() {
    if (!deletingUser) return;
    const result = await deleteUser(deletingUser.id);
    if (result.success) {
      toast.success(result.message);
      setIsDeleteDialogOpen(false);
      fetchData(); // Refresh data
    } else {
      toast.error(result.message);
    }
  }

  function handleUserCreated() {
    setIsAddUserDialogOpen(false);
    fetchData();
  }

  const columns = getColumns(openEditDialog, openDeleteDialog);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={users}
        showAddButton={true}
        onAddClick={() => setIsAddUserDialogOpen(true)}
        showRefreshButton={true}
        onRefreshClick={fetchData}
        showExportButton={true}
        onRowDoubleClick={openEditDialog}
      />
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <UserForm roles={roles} onUserCreated={handleUserCreated} />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Change the details for {editingUser?.email}.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-8">
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input readOnly disabled value={editingUser?.id || ''} />
                </FormControl>
              </FormItem>
              <Controller
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Leave blank to keep current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save changes</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account of {deletingUser?.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}