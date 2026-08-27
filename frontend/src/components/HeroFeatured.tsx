import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Trophy } from 'lucide-react';
import type { Campaign } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { CountdownTimer } from './CountdownTimer';

export function HeroFeatured({ campaign }: { campaign: Campaign }) {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pt-6 md:pt-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-transparent dark:shadow-card md:p-6">
          <div className="pointer-events-none absolute inset-0 -z-0 opacity-70">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
          </div>

          <div className="relative grid gap-5 md:grid-cols-[minmax(0,1fr)_320px] md:items-center md:gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip-brand">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured campaign
                </span>
                <span className="chip">{campaign.category}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                  Live
                </span>
              </div>
              <h1 className="mt-3 heading-display text-2xl leading-[1.1] text-strong text-balance md:text-4xl">
                {campaign.title}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted md:text-base text-balance">
                {campaign.tagline}
              </p>

              {campaign.prize && (
                <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="rounded-lg bg-brand-500/15 p-1.5 text-brand-700 dark:text-brand-300">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-faint">
                      Grand prize
                    </div>
                    <div className="truncate text-sm font-semibold text-strong">
                      {campaign.prize}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div className="mb-1.5 text-[10px] uppercase tracking-widest text-faint">
                  Voting closes in
                </div>
                <CountdownTimer endDate={campaign.endDate} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link href={`/campaigns/${campaign.slug}`} className="btn-primary">
                  See nominees
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="text-xs text-muted">
                  <span className="font-semibold text-strong">
                    {formatNumber(campaign.totalVotes)}
                  </span>{' '}
                  votes · {campaign.totalNominees} nominees ·{' '}
                  <span className="font-semibold text-strong">KES {campaign.votePriceKes}</span>{' '}
                  per vote
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] md:aspect-[4/5]">
              {campaign.featuredImage && (
                <Image
                  src={campaign.featuredImage}
                  alt={campaign.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 320px, 100vw"
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
