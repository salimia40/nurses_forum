import React from 'react';
import { Button } from './ui/button';
import { authClient } from '@/lib/auth';

export default function AuthButtons() {
  const {
    data: session,
    isPending, //loading state
    error, //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return <Button>Loading...</Button>;
  }

  if (error) {
    return <Button>Error: {error.message}</Button>;
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {session ? (
        <Button onClick={() => authClient.signOut()}>خروج</Button>
      ) : (
        <>
          <a href="/login">
            <Button variant="outline" className="w-full">
              ورود
            </Button>
          </a>
          <a href="/register">
            <Button className="w-full">ثبت نام</Button>
          </a>
        </>
      )}
    </div>
  );
}
