'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, Zap } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Only show "Vote now" on a campaign detail page (/campaigns/[slug])
  const showVoteNow = pathname?.startsWith('/campaigns/');
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-ink-950/70">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white/95 dark:ring-white/30">
            <Image src="/logo.png" alt="Kura" fill className="object-contain p-0.5" />
          </div>
          <div className="leading-tight">
            <div className="heading-display text-lg text-strong">Kura</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
              Vote. Support. Uplift.
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5"
          >
            Campaigns
          </Link>
          <Link
            href="/#trending"
            className="rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5"
          >
            Trending
          </Link>
          <Link
            href="/#how"
            className="rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5"
          >
            How it works
          </Link>
          <Link
            href="/#organizers"
            className="rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5"
          >
            For organizers
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button className="btn-ghost hidden sm:inline-flex">
            <Search className="h-4 w-4" />
            Search
          </button>
          <ThemeToggle />
          {showVoteNow && (
            <Link href="#live" className="btn-primary">
              <Zap className="h-4 w-4" />
              Vote now
            </Link>
          )}
          <button
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white/95 dark:border-white/5 dark:bg-ink-900/95 md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {['Campaigns', 'Trending', 'How it works', 'For organizers'].map((label) => (
              <Link
                key={label}
                href="/"
                className="rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
