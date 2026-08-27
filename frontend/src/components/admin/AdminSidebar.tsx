'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { authApi, getToken, setToken } from '@/lib/api';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/campaigns', label: 'Campaigns', icon: Trophy },
  { href: '/admin/nominees', label: 'Nominees', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: Wallet, badge: 'M-Pesa' },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface Props {
  onClose?: () => void;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export function AdminSidebar({ onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (!getToken()) return;
    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => {});
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const initials = user
    ? user.name
        .split(' ')
        .map((s) => s[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'KO';

  const onSignOut = async () => {
    try {
      await authApi.logout();
    } catch {}
    setToken(null);
    router.replace('/admin/login');
  };

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-white/5 dark:bg-ink-950">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-white/5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:ring-white/10">
            <Image src="/logo.png" alt="Koch Awards" fill className="object-contain p-0.5" />
          </div>
          <div className="leading-tight">
            <div className="heading-display flex items-baseline gap-1 text-sm text-strong">
              Koch Awards
              <span className="font-serif text-xs italic tracking-tight text-brand-600 dark:text-brand-400">
                &lsquo;26
              </span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
              Admin
            </div>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 p-1.5 text-muted dark:border-white/10 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-faint">
          Manage
        </div>
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={clsx(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    active
                      ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                      : 'text-muted hover:bg-slate-100 hover:text-strong dark:hover:bg-white/5'
                  )}
                >
                  <Icon
                    className={clsx(
                      'h-4.5 w-4.5 shrink-0',
                      active ? 'text-brand-600 dark:text-brand-400' : 'text-muted'
                    )}
                    size={18}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-brand-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-2xl border border-brand-500/25 bg-brand-500/[0.06] p-3">
          <div className="text-xs font-semibold text-strong">M-Pesa STK Push</div>
          <div className="mt-0.5 text-[11px] text-muted">
            Daraja sandbox connected. Payouts run every Monday.
          </div>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-white/5">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-700 dark:text-brand-300">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold text-strong">
              {user?.name || 'Signed out'}
            </div>
            <div className="truncate text-xs text-muted">
              {user?.email || 'Loading…'}
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-strong dark:hover:bg-white/5"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
