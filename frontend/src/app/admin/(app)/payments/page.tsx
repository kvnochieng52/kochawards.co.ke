'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { adminApi } from '@/lib/api';
import { formatKes } from '@/lib/utils';

type Status = 'pending' | 'success' | 'failed' | 'cancelled';

interface Payment {
  id: string;
  timestamp?: string;
  createdAt?: string;
  mpesaReceipt?: string | null;
  phone: string;
  nominee?: { id: string; fullName: string; photo?: string; code: string };
  amountKes: number;
  voteCount: number;
  status: Status;
}

const statusPill: Record<
  Status,
  { cls: string; icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  success: {
    cls: 'border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-300',
    icon: CheckCircle2,
    label: 'Success',
  },
  pending: {
    cls: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    icon: Clock,
    label: 'Pending',
  },
  failed: {
    cls: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400',
    icon: XCircle,
    label: 'Failed',
  },
  cancelled: {
    cls: 'border-slate-400/40 bg-slate-400/10 text-slate-700 dark:text-white/60',
    icon: XCircle,
    label: 'Cancelled',
  },
};

interface Summary {
  revenue: number;
  success: number;
  pending: number;
  failed: number;
}

interface Meta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
}

const PER_PAGE = 20;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [range, setRange] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [status, range]);

  useEffect(() => {
    setLoading(true);
    adminApi
      .payments({
        status: status || undefined,
        range,
        search: search || undefined,
        page,
        per_page: PER_PAGE,
      })
      .then((r) => {
        setPayments(r.data ?? []);
        setSummary(r.summary ?? null);
        setMeta(r.meta ?? null);
        setMessage(r.message ?? '');
      })
      .catch(() => {
        setMessage('Failed to load payments.');
      })
      .finally(() => setLoading(false));
  }, [status, range, search, page]);

  const lastPage = meta?.lastPage ?? 1;
  const currentPage = meta?.currentPage ?? page;

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await adminApi.paymentsExport({
        status: status || undefined,
        range,
        search: search || undefined,
      });
      setMessage('Export downloaded.');
    } catch {
      setMessage('Failed to export payments.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <AdminTopBar
        title="Payments"
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Payments' }]}
        actions={
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-ghost !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-60 md:!text-sm"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {exporting ? 'Exporting…' : 'Export CSV'}
            </span>
          </button>
        }
      />

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Today’s revenue" value={summary ? formatKes(summary.revenue) : '—'} />
          <Card label="Successful" value={summary?.success ?? '—'} hint="payments" />
          <Card label="Pending" value={summary?.pending ?? '—'} hint="awaiting confirmation" />
          <Card label="Failed" value={summary?.failed ?? '—'} hint="retry available" />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search receipt, phone, nominee…"
              className="w-64 rounded-full border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-strong outline-none focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-strong outline-none focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <option value="">All statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-strong outline-none focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
          {message && (
            <div className="ml-auto text-xs text-muted" aria-live="polite">
              {message}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-ink-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-widest text-faint dark:border-white/5 dark:bg-white/[0.02]">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">M-Pesa code</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Nominee</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Votes</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {loading && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                      </div>
                    </td>
                  </tr>
                )}
                {!loading &&
                  payments.map((p) => {
                    const s = statusPill[p.status];
                    const Icon = s.icon;
                    return (
                      <tr
                        key={p.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-muted tabular-nums">
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleString('en-KE', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-strong">
                          {p.mpesaReceipt || <span className="text-faint">—</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted">+{p.phone}</td>
                        <td className="px-4 py-3">
                          {p.nominee ? (
                            <Link
                              href={`/admin/nominees/${p.nominee.id}/edit`}
                              className="flex items-center gap-2.5 hover:text-brand-700 dark:hover:text-brand-300"
                            >
                              {p.nominee.photo && (
                                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                                  <Image
                                    src={p.nominee.photo}
                                    alt={p.nominee.fullName}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-strong">
                                  {p.nominee.fullName}
                                </div>
                                <div className="truncate text-[11px] text-faint">
                                  {p.nominee.code}
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <span className="text-faint">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-strong tabular-nums">
                          {formatKes(p.amountKes)}
                        </td>
                        <td className="px-4 py-3 text-right text-muted tabular-nums">
                          {p.voteCount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${s.cls}`}
                          >
                            <Icon className="h-3 w-3" />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                {!loading && payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-muted">
                      No payments in this range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!loading && meta && meta.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-white/5">
              <div className="text-xs text-muted">
                Page {currentPage} of {lastPage}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-strong transition hover:border-brand-500/60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={currentPage >= lastPage}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-strong transition hover:border-brand-500/60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Card({ label, value, hint }: { label: string; value: any; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-ink-900">
      <div className="text-xs font-medium uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="heading-display text-2xl text-strong tabular-nums">{value}</div>
        {hint && <div className="text-xs text-muted">{hint}</div>}
      </div>
    </div>
  );
}
