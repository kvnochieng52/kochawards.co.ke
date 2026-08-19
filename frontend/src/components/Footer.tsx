import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 dark:border-white/5 dark:bg-ink-950/60">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-white/95 dark:ring-white/30">
              <Image src="/logo.png" alt="Kura" fill className="object-contain p-0.5" />
            </div>
            <div>
              <div className="heading-display text-xl text-strong">Kura</div>
              <div className="text-xs uppercase tracking-widest text-muted">
                Every vote is a story.
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm text-muted">
            Kura is Kenya’s public voting platform for the community workers, teachers and
            volunteers holding our neighborhoods together. Pay via M-Pesa, cast your vote, back
            the people doing the work.
          </p>
          <div className="mt-6 flex items-center gap-3 text-slate-600 dark:text-white/70">
            <a className="rounded-full border border-slate-200 p-2 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5" href="#">
              <Twitter className="h-4 w-4" />
            </a>
            <a className="rounded-full border border-slate-200 p-2 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5" href="#">
              <Instagram className="h-4 w-4" />
            </a>
            <a className="rounded-full border border-slate-200 p-2 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5" href="#">
              <Facebook className="h-4 w-4" />
            </a>
            <a className="rounded-full border border-slate-200 p-2 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5" href="#">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-faint">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm text-body">
            <li>
              <Link href="/">Live campaigns</Link>
            </li>
            <li>
              <Link href="/">Upcoming</Link>
            </li>
            <li>
              <Link href="/">Results</Link>
            </li>
            <li>
              <Link href="/">Categories</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-faint">
            Company
          </div>
          <ul className="mt-4 space-y-2 text-sm text-body">
            <li>About Kura</li>
            <li>Host a campaign</li>
            <li>Trust &amp; Safety</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-faint md:flex-row">
          <div>© {new Date().getFullYear()} Kura Voting Ltd. Nairobi, Kenya.</div>
          <div className="flex items-center gap-4">
            <span>Payments powered by M-Pesa</span>
            <span className="rounded-full bg-brand-500/10 px-3 py-1 text-brand-700 dark:text-brand-300">
              PCI-DSS · GDPR-ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
