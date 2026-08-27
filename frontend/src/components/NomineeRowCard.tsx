'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, Vote } from 'lucide-react';
import type { Nominee } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { VoteModal } from './VoteModal';

interface Props {
  nominee: Nominee;
  rank: number;
  leaderVotes: number;
  closed?: boolean;
}

export function NomineeRowCard({ nominee, rank, leaderVotes, closed }: Props) {
  const [open, setOpen] = useState(false);
  const pct = leaderVotes > 0 ? Math.round((nominee.votes / leaderVotes) * 100) : 0;

  const rankStyle = closed
    ? 'from-slate-200/60 to-white/0 text-slate-500 dark:from-white/10 dark:text-white/60'
    : rank === 1
      ? 'from-yellow-400/30 to-yellow-500/0 text-yellow-700 dark:text-yellow-300'
      : rank === 2
        ? 'from-slate-300/50 to-white/0 text-slate-700 dark:text-white'
        : rank === 3
          ? 'from-orange-400/30 to-orange-500/0 text-orange-700 dark:text-orange-300'
          : 'from-slate-200/60 to-white/0 text-slate-500 dark:from-white/10 dark:text-white/70';

  return (
    <>
      <div
        className={`card group relative overflow-hidden p-3 md:p-3.5 ${closed ? 'opacity-95' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`heading-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${rankStyle} text-base tabular-nums md:h-11 md:w-11 md:text-lg`}
          >
            {closed ? '·' : rank}
          </div>

          <Link
            href={`/nominees/${nominee.slug ?? nominee.id}`}
            className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-2 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
          >
            {nominee.photo ? (
              <Image
                src={nominee.photo}
                alt={nominee.fullName}
                fill
                className={`object-contain ${closed ? 'grayscale-[40%]' : ''}`}
              />
            ) : (
              <span className="text-sm font-semibold text-muted">
                {nominee.fullName
                  .split(' ')
                  .map((s) => s[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <Link
                href={`/nominees/${nominee.slug ?? nominee.id}`}
                className="truncate text-sm font-semibold text-strong hover:text-brand-700 dark:hover:text-brand-300 md:text-base"
              >
                {nominee.fullName}
              </Link>
              {nominee.verified && (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-brand-500 text-white dark:text-ink-950" />
              )}
              <span className="hidden text-xs font-medium text-accent-700 dark:text-accent-400 md:inline">
                · {nominee.category}
              </span>
            </div>
            <p className="line-clamp-1 text-xs text-muted md:text-[13px]">{nominee.headline}</p>

            {!closed && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="shrink-0 text-xs font-semibold text-strong tabular-nums">
                  {formatNumber(nominee.votes)}
                </div>
              </div>
            )}
          </div>

          {closed ? (
            <span
              className="shrink-0 rotate-[-4deg] rounded-md border-2 border-brand-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-brand-700 dark:border-brand-400 dark:text-brand-400"
              title="Campaign closed"
            >
              Closed
            </span>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="btn-primary shrink-0 !px-4 !py-2 !text-xs md:!text-sm"
            >
              <Vote className="h-4 w-4" />
              Vote
            </button>
          )}
        </div>
      </div>
      {!closed && (
        <VoteModal nominee={nominee} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
