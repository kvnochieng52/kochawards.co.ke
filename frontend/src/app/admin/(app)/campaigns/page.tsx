'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Users, Calendar, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import type { Campaign } from '@/lib/types';
import { adminApi } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';

const badgeStyles: Record<string, string> = {
  live: 'border-brand-500 bg-brand-600 text-white',
  upcoming: 'border-accent-500 bg-accent-600 text-white',
  ended: 'border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-300',
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.listCampaigns().then(setCampaigns).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (c: Campaign) => {
    if (!confirm(`Delete "${c.title}"? This will remove all its nominees and votes.`)) return;
    setDeleting(c.id);
    try {
      await adminApi.deleteCampaign(c.id);
      setCampaigns((cs) => cs.filter((x) => x.id !== c.id));
    } catch {
      alert('Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <AdminTopBar
        title="Campaigns"
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Campaigns' }]}
        actions={
          <Link
            href="/admin/campaigns/new"
            className="btn-primary !px-4 !py-2 !text-xs md:!text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New campaign</span>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading campaigns…
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-ink-900"
            >
              <div className="relative aspect-[16/8] overflow-hidden">
                {c.featuredImage && (
                  <Image
                    src={c.featuredImage}
                    alt={c.title}
                    fill
                    className={`object-cover ${c.status === 'ended' ? 'grayscale-[35%]' : ''}`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${badgeStyles[c.status]}`}
                  >
                    {c.status === 'ended' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <span className="h-1 w-1 animate-pulse rounded-full bg-current" />
                    )}
                    {c.status === 'ended' ? 'Closed' : c.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="heading-display truncate text-lg text-strong">{c.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-muted">{c.tagline}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/campaigns/${c.slug}/edit`}
                      className="btn-ghost !py-1.5 !text-xs"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(c)}
                      disabled={deleting === c.id}
                      className="rounded-lg border border-slate-200 p-2 text-muted hover:border-red-500/40 hover:text-red-600 disabled:opacity-40 dark:border-white/10"
                      aria-label="Delete campaign"
                    >
                      {deleting === c.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-white/10">
                    <div className="flex items-center gap-1 text-faint">
                      <Users className="h-3 w-3" />
                      Nominees
                    </div>
                    <div className="mt-0.5 font-semibold text-strong tabular-nums">
                      {c.totalNominees}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-white/10">
                    <div className="text-faint">Votes</div>
                    <div className="mt-0.5 font-semibold text-strong tabular-nums">
                      {formatNumber(c.totalVotes)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-white/10">
                    <div className="flex items-center gap-1 text-faint">
                      <Calendar className="h-3 w-3" />
                      Ends
                    </div>
                    <div className="mt-0.5 font-semibold text-strong">
                      {formatDate(c.endDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && campaigns.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-muted dark:border-white/10">
            No campaigns yet.{' '}
            <Link
              href="/admin/campaigns/new"
              className="font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              Create one →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
