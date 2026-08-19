'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import type { Campaign, Nominee } from '@/lib/types';
import { adminApi } from '@/lib/api';
import { formatNumber } from '@/lib/utils';

export default function AdminNomineesPage() {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignFilter, setCampaignFilter] = useState<string>('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi
      .listNominees(campaignFilter ? { campaign_id: campaignFilter } : {})
      .then(setNominees)
      .catch(() => setNominees([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    adminApi.listCampaigns().then(setCampaigns).catch(() => {});
  }, []);

  useEffect(load, [campaignFilter]);

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteNominee(id);
      setNominees((ns) => ns.filter((n) => n.id !== id));
    } catch {
      alert('Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <AdminTopBar
        title="Nominees"
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Nominees' }]}
        actions={
          <Link href="/admin/nominees/new" className="btn-primary !px-4 !py-2 !text-xs md:!text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add nominee</span>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-strong outline-none focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <option value="">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button className="btn-ghost !py-2 !text-xs md:!text-sm">
            <Filter className="h-4 w-4" />
            More filters
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted">{nominees.length} nominees</span>
            <button className="btn-ghost !py-2 !text-xs md:!text-sm">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-ink-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-widest text-faint dark:border-white/5 dark:bg-white/[0.02]">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                  <th className="px-4 py-3">Nominee</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3 text-right">Votes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {loading && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                      </div>
                    </td>
                  </tr>
                )}
                {!loading &&
                  nominees.map((n) => {
                    const campaign = (n as any).campaign as
                      | { title: string; status: string }
                      | undefined;
                    const closed = campaign?.status === 'ended';
                    return (
                      <tr
                        key={n.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {n.photo && (
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-200 dark:ring-white/10">
                                <Image
                                  src={n.photo}
                                  alt={n.fullName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 truncate font-semibold text-strong">
                                {n.fullName}
                                {n.verified && (
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-brand-500 text-white dark:text-ink-950" />
                                )}
                              </div>
                              <div className="truncate text-xs text-muted">{n.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted">
                          <div className="max-w-[180px] truncate">
                            {campaign?.title ?? '—'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="chip !bg-accent-500/10 !border-accent-500/30 !text-accent-700 dark:!text-accent-400">
                            {n.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted">{n.code}</td>
                        <td className="px-4 py-3 text-right font-semibold text-strong tabular-nums">
                          {closed ? <span className="text-faint">—</span> : formatNumber(n.votes)}
                        </td>
                        <td className="px-4 py-3">
                          {closed ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-brand-500/40 bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-700 dark:text-brand-300">
                              <CheckCircle2 className="h-3 w-3" /> Closed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-brand-500 bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                              <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                              Live
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/nominees/${n.id}/edit`}
                              className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-strong dark:hover:bg-white/5"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <button
                              disabled={deleting === n.id}
                              onClick={() => onDelete(n.id, n.fullName)}
                              className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-600 disabled:opacity-40"
                              title="Delete"
                            >
                              {deleting === n.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-strong dark:hover:bg-white/5"
                              aria-label="More"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {!loading && nominees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-sm text-muted">
                      No nominees yet.{' '}
                      <Link
                        href="/admin/nominees/new"
                        className="font-semibold text-brand-700 hover:underline dark:text-brand-300"
                      >
                        Add one →
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-muted dark:border-white/5">
            <div>
              Showing <span className="font-semibold text-strong">{nominees.length}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
