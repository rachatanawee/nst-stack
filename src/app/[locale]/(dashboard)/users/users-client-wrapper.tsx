'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { columns } from './columns'; // Remove UserType import
import { getRoles, getUsers } from './actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserForm } from './user-form';

// Explicitly define User type here to ensure it's the correct one
export type User = {
  id: string;
  email: string;
  role_id?: number;
  role_name: string;
  created_at: string;
};

export function UsersClientWrapper() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  async function fetchData() {
    setLoading(true);
    const [fetchedUsers, fetchedRoles] = await Promise.all([
      getUsers(),
      getRoles()
    ]);
    const usersData: User[] = fetchedUsers;
    setUsers(usersData);
    setRoles(fetchedRoles);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

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
      />
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogTrigger asChild>
          {/* This trigger will be hidden, as the button is now in DataTable */}
          <Button id="addUserTrigger" className="hidden">Add User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <UserForm roles={roles} />
        </DialogContent>
      </Dialog>
    </div>
  );
}