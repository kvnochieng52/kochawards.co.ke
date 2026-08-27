'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Trophy,
  Wallet,
  TrendingUp,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { adminApi } from '@/lib/api';
import { formatKes, formatNumber } from '@/lib/utils';
import type { Nominee } from '@/lib/types';

interface Stats {
  total_votes: number;
  total_revenue: number;
  pending_revenue: number;
  live_campaigns: number;
  total_campaigns: number;
  total_nominees: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topNominees, setTopNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats()
      .then((r) => {
        setStats(r.stats);
        setTopNominees(r.top_nominees ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          label: 'Total votes',
          value: formatNumber(stats.total_votes),
          hint: 'Successful M-Pesa votes',
          icon: TrendingUp,
          tint: 'brand' as const,
        },
        {
          label: 'Revenue (KES)',
          value: formatNumber(stats.total_revenue),
          hint: `${formatKes(stats.pending_revenue)} pending`,
          icon: Wallet,
          tint: 'accent' as const,
        },
        {
          label: 'Live campaigns',
          value: stats.live_campaigns,
          hint: `${stats.total_campaigns} total`,
          icon: Trophy,
          tint: 'brand' as const,
        },
        {
          label: 'Nominees',
          value: stats.total_nominees,
          hint: 'across all campaigns',
          icon: Users,
          tint: 'accent' as const,
        },
      ]
    : [];

  return (
    <>
      <AdminTopBar
        title="Dashboard"
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Dashboard' }]}
        actions={
          <Link href="/admin/nominees/new" className="btn-primary !px-4 !py-2 !text-xs md:!text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add nominee</span>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading stats…
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((s) => {
            const Icon = s.icon;
            const tint =
              s.tint === 'brand'
                ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                : 'bg-accent-500/10 text-accent-700 dark:text-accent-400';
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-ink-900"
              >
                <div className="flex items-start justify-between">
                  <div className="text-xs font-medium uppercase tracking-wider text-faint">
                    {s.label}
                  </div>
                  <div className={`rounded-xl p-2 ${tint}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 heading-display text-3xl text-strong tabular-nums">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs text-muted">{s.hint}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-ink-900">
              <div className="text-xs font-semibold uppercase tracking-widest text-faint">
                Quick actions
              </div>
              <div className="mt-3 space-y-2">
                <Link
                  href="/admin/nominees/new"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-brand-500/50 hover:bg-brand-500/5 dark:border-white/10"
                >
                  <div className="rounded-xl bg-brand-500/10 p-2 text-brand-700 dark:text-brand-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-strong">Upload a nominee</div>
                    <div className="text-xs text-muted">Add a new person or organization</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </Link>
                <Link
                  href="/admin/campaigns/new"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-accent-500/50 hover:bg-accent-500/5 dark:border-white/10"
                >
                  <div className="rounded-xl bg-accent-500/10 p-2 text-accent-700 dark:text-accent-400">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-strong">Create a campaign</div>
                    <div className="text-xs text-muted">Start a new public vote</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </Link>
                <Link
                  href="/admin/payments"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-brand-500/50 hover:bg-brand-500/5 dark:border-white/10"
                >
                  <div className="rounded-xl bg-brand-500/10 p-2 text-brand-700 dark:text-brand-300">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-strong">Review payments</div>
                    <div className="text-xs text-muted">
                      {stats ? formatKes(stats.pending_revenue) : '—'} pending
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-ink-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-faint">
                    Top nominees
                  </div>
                  <div className="heading-display text-lg text-strong">Live leaderboard</div>
                </div>
                <Link
                  href="/admin/nominees"
                  className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
                >
                  View all →
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {topNominees.map((n, i) => (
                  <div
                    key={n.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5 dark:border-white/5"
                  >
                    <div className="heading-display w-6 shrink-0 text-center text-sm text-faint tabular-nums">
                      {i + 1}
                    </div>
                    {n.photo && (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image src={n.photo} alt={n.fullName} fill className="object-contain" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 truncate text-sm font-semibold text-strong">
                        {n.fullName}
                        {n.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-brand-500 text-white dark:text-ink-950" />
                        )}
                      </div>
                      <div className="truncate text-xs text-muted">{n.category}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="heading-display text-sm text-strong tabular-nums">
                        {formatNumber(n.votes)}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-faint">votes</div>
                    </div>
                  </div>
                ))}
                {topNominees.length === 0 && !loading && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-muted dark:border-white/10">
                    No votes yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
