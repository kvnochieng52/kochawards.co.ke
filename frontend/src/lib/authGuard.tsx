'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { authApi, getToken, setToken } from './api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export function useAdminGuard(): { user: AdminUser | null; loading: boolean } {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = getToken();
      if (!t) {
        router.replace('/admin/login');
        return;
      }
      try {
        const { user } = await authApi.me();
        if (!cancelled) {
          setUser(user);
          setLoading(false);
        }
      } catch {
        setToken(null);
        router.replace('/admin/login');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { user, loading };
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useAdminGuard();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-ink-950">
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking session…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
