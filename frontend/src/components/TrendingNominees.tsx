import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { formatNumber } from '@/lib/utils';

export async function TrendingNominees() {
  const top = await publicApi.trending(6).catch(() => []);
  if (top.length === 0) return null;

  return (
    <section id="trending" className="container-x mt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-700 dark:text-brand-300">
            <TrendingUp className="h-3.5 w-3.5" /> Trending nominees
          </div>
          <h2 className="heading-display mt-2 text-3xl text-strong md:text-4xl">
            The people Kenya is voting for right now
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((n, i) => (
          <Link
            href={`/nominees/${n.slug ?? n.id}`}
            key={n.id}
            className="card group flex items-center gap-4 p-4 transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/20"
          >
            <div className="heading-display text-4xl text-slate-200 dark:text-white/10 tabular-nums">
              #{i + 1}
            </div>
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
              {n.photo ? (
                <Image src={n.photo} alt={n.fullName} fill className="object-contain" />
              ) : (
                <span className="text-sm font-semibold text-muted">
                  {n.fullName
                    .split(' ')
                    .map((s) => s[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="truncate font-semibold text-strong">{n.fullName}</span>
                {n.verified && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 fill-brand-500 text-white dark:text-ink-950" />
                )}
              </div>
              <div className="mt-0.5 truncate text-xs text-muted">{n.headline}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                    style={{ width: `${Math.min(100, (n.votes / 15000) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-strong tabular-nums">
                  {formatNumber(n.votes)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
