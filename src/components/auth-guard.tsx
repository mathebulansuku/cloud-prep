'use client'

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [authed, setAuthed] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('certai-user') : null;
      setAuthed(Boolean(raw));
      if (!raw) {
        const next = encodeURIComponent(pathname || '/dashboard');
        router.replace(`/sign-in?next=${next}`);
      }
    } catch {
      setAuthed(false);
    }
  }, [pathname, router]);

  if (!mounted || !authed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading</CardTitle>
          <CardDescription>Preparing your workspace…</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-64" />
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

