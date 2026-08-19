'use client';

import { useState } from 'react';
import { Vote, Share2, Heart } from 'lucide-react';
import type { Nominee } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { VoteModal } from './VoteModal';

export function NomineeVoteCTA({ nominee }: { nominee: Nominee }) {
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  return (
    <>
      <div className="glass sticky top-24 rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-faint">Current votes</div>
        <div className="heading-display mt-1 text-5xl text-strong tabular-nums">
          {formatNumber(nominee.votes)}
        </div>
        <div className="mt-1 text-sm text-muted">Every vote is KES 10 via M-Pesa.</div>

        <button onClick={() => setOpen(true)} className="btn-primary mt-6 w-full text-base">
          <Vote className="h-5 w-5" />
          Vote {nominee.fullName.split(' ')[0]}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`btn-ghost ${liked ? '!border-brand-500/60 !text-brand-700 dark:!text-brand-200' : ''}`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Saved' : 'Save'}
          </button>
          <button className="btn-ghost">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-muted dark:border-white/10 dark:bg-white/[0.03]">
          <div className="font-semibold text-strong">Vote code:</div>
          <div className="mt-1 heading-display text-2xl tracking-widest text-brand-700 dark:text-brand-300">
            {nominee.code}
          </div>
          <div className="mt-2">
            SMS this code to <span className="font-semibold text-strong">40404</span> to vote
            offline.
          </div>
        </div>
      </div>
      <VoteModal nominee={nominee} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
