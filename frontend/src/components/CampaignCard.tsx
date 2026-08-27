import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Users, MapPin, Trophy, CheckCircle2 } from 'lucide-react';
import type { Campaign } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { CountdownTimer } from './CountdownTimer';

const statusStyles: Record<Campaign['status'], string> = {
  live: 'bg-brand-600 text-white border-brand-500',
  upcoming: 'bg-accent-600 text-white border-accent-500',
  ended: 'bg-brand-500/10 text-brand-700 border-brand-500/40 dark:text-brand-300',
};

export function CampaignCard({ c }: { c: Campaign }) {
  const ended = c.status === 'ended';

  return (
    <Link
      href={`/campaigns/${c.slug}`}
      className="group card relative flex flex-col transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/20"
    >
      {/* Poster — object-contain preserves the whole design, no overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-white/[0.03]">
        {c.featuredImage && (
          <Image
            src={c.featuredImage}
            alt={c.title}
            fill
            className={`object-contain transition duration-500 group-hover:scale-[1.02] ${ended ? 'grayscale-[35%]' : ''}`}
          />
        )}
      </div>

      {/* Everything else lives BELOW the poster */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusStyles[c.status]}`}
          >
            {ended ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <span className="h-1 w-1 rounded-full bg-current animate-pulse" />
            )}
            {ended ? 'Closed' : c.status}
          </span>
          <span className="chip !py-0.5 !text-[10px]">{c.category}</span>
          {!ended && <CountdownTimer endDate={c.endDate} compact />}
        </div>

        <div>
          <h3 className="heading-display text-lg leading-tight text-strong text-balance line-clamp-2">
            {c.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{c.tagline}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-muted dark:border-white/5">
          {ended ? (
            <>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {c.totalNominees} nominees
              </div>
              <div className="flex items-center gap-1 font-semibold text-brand-700 dark:text-brand-300">
                View closed
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {formatNumber(c.totalVotes)}
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                {c.totalNominees}
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{c.location}</span>
              </div>
              <div className="ml-auto flex items-center gap-1 font-semibold text-strong">
                View
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
