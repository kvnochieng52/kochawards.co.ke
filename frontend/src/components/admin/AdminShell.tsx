'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 md:block">
        <AdminSidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-30 rounded-full border border-slate-200 bg-white p-2 text-muted shadow-sm dark:border-white/10 dark:bg-ink-900 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="md:pl-64">{children}</div>
    </div>
  );
}
