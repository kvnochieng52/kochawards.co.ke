import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Users, MapPin, Trophy, CheckCircle2 } from 'lucide-react';
import type { Campaign } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { CountdownTimer } from './CountdownTimer';

const statusStyles: Record<Campaign['status'], string> = {
  live: 'bg-brand-600 text-white border-brand-500 shadow-sm',
  upcoming: 'bg-accent-600 text-white border-accent-500 shadow-sm',
  ended: 'bg-brand-700 text-white border-brand-600 shadow-sm',
};

export function CampaignCard({ c }: { c: Campaign }) {
  const ended = c.status === 'ended';

  return (
    <Link
      href={`/campaigns/${c.slug}`}
      className="group card relative flex flex-col transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-500/25 via-brand-500/10 to-accent-500/25">
        {c.featuredImage && (
          <Image
            src={c.featuredImage}
            alt={c.title}
            fill
            className={`object-cover transition duration-700 group-hover:scale-105 ${ended ? 'grayscale-[35%]' : ''}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${statusStyles[c.status]}`}
          >
            {ended ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            )}
            {ended ? 'Closed' : c.status}
          </span>
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {c.category}
          </span>
        </div>

        {!ended && (
          <div className="absolute right-4 top-4">
            <CountdownTimer endDate={c.endDate} compact />
          </div>
        )}

        <div className="absolute inset-x-4 bottom-4">
          <h3 className="heading-display text-2xl text-white text-balance">{c.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/80">{c.tagline}</p>
        </div>
      </div>

      {ended ? (
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-xs text-muted dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {c.totalNominees} nominees participated
          </div>
          <div className="flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-300">
            View closed campaign
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 px-5 py-4 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {formatNumber(c.totalVotes)} votes
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5" />
            {c.totalNominees} nominees
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-white/10" />
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{c.location}</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-strong">
            View
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      )}
    </Link>
  );
}
