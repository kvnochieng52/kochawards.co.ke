'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '/boma-bora', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/library', label: 'Library' },
  { href: '/contact', label: 'Contact' },
];

export function BomaSiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40 dark:opacity-100" />
      <BomaHeader />
      <main className="pb-20 pt-4">{children}</main>
      <BomaFooter />
    </>
  );
}

function BomaHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-ink-950/70">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/boma-bora" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white/95 dark:ring-white/30">
            <Image
              src="/logo.png"
              alt="Restoring Dignity Foundation"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div className="leading-tight">
            <div className="heading-display text-lg text-strong">BOMA BORA</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
              Restoring Dignity Foundation
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === '/boma-bora' && pathname?.startsWith('/boma-bora'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? 'bg-amber-500/10 font-semibold text-amber-700 dark:text-amber-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/boma-bora#donate"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
          >
            <Heart className="h-4 w-4" />
            Donate
          </Link>
          <button
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white/95 dark:border-white/5 dark:bg-ink-900/95 md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-white/80 dark:hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function BomaFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 py-10 dark:border-white/5 dark:bg-ink-950/50">
      <div className="container-x grid gap-6 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200 dark:bg-white/95 dark:ring-white/30">
              <Image src="/logo.png" alt="RDF" fill className="object-contain p-0.5" />
            </div>
            <div className="heading-display text-base text-strong">BOMA BORA</div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Safe Relocation · Dignified Living · Restored Hope.
          </p>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-faint">
            Explore
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-amber-600 dark:hover:text-amber-300">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-faint">
            Support the programme
          </div>
          <Link
            href="/boma-bora#donate"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
          >
            <Heart className="h-4 w-4" />
            Donate any amount
          </Link>
          <p className="mt-3 text-xs text-faint">
            © {new Date().getFullYear()} Restoring Dignity Foundation
          </p>
        </div>
      </div>
    </footer>
  );
}
