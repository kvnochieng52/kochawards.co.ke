'use client';

import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Props {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function AdminTopBar({ title, breadcrumb, actions }: Props) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-ink-950/70">
      <div className="flex h-16 items-center gap-3 pl-14 pr-4 md:pl-6 md:pr-6">
        <div className="min-w-0 flex-1">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="flex items-center gap-1.5 text-[11px] text-faint">
              {breadcrumb.map((b, i) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  {i > 0 && <span>/</span>}
                  {b.href ? (
                    <Link href={b.href} className="hover:text-strong">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-muted">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="heading-display truncate text-lg text-strong md:text-xl">{title}</h1>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              placeholder="Search…"
              className="w-56 rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-strong outline-none placeholder:text-faint focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03] lg:w-64"
            />
          </div>
        </div>

        <button
          className="relative rounded-full border border-slate-200 p-2 text-muted hover:text-strong dark:border-white/10"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
        </button>

        <ThemeToggle />

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
