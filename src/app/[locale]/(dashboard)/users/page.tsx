import { Suspense } from 'react';
import { UsersClientWrapper } from './users-client-wrapper';

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <Suspense fallback={<div>Loading users...</div>}>
        <UsersClientWrapper />
      </Suspense>
    </div>
  );
}
