'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { User } from './users-client-wrapper';

function UserActions({ 
  user, 
  openEditDialog, 
  openDeleteDialog 
}: { 
  user: User, 
  openEditDialog: (user: User) => void, 
  openDeleteDialog: (user: User) => void 
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => openEditDialog(user)}>Edit user</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openDeleteDialog(user)} className="text-red-600">
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const getColumns = (
  openEditDialog: (user: User) => void,
  openDeleteDialog: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: 'full_name',
    header: 'Full Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return date.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserActions user={row.original} openEditDialog={openEditDialog} openDeleteDialog={openDeleteDialog} />,
  },
];