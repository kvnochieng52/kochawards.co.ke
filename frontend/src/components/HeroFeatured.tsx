import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Trophy } from 'lucide-react';
import type { Campaign } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { CountdownTimer } from './CountdownTimer';

export function HeroFeatured({ campaign }: { campaign: Campaign }) {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pt-8 md:pt-12">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-transparent dark:shadow-card md:p-10">
          <div className="pointer-events-none absolute inset-0 -z-0 opacity-70">
            <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
          </div>

          <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="chip-brand">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured campaign
                </span>
                <span className="chip">{campaign.category}</span>
              </div>
              <h1 className="mt-5 heading-display text-4xl leading-[1.05] text-strong md:text-6xl text-balance">
                {campaign.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted text-balance">{campaign.tagline}</p>

              {campaign.prize && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="rounded-xl bg-brand-500/15 p-2 text-brand-700 dark:text-brand-300">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-faint">
                      Grand prize
                    </div>
                    <div className="text-sm font-semibold text-strong">{campaign.prize}</div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={`/campaigns/${campaign.slug}`} className="btn-primary">
                  See nominees
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="text-sm text-muted">
                  <span className="font-semibold text-strong">
                    {formatNumber(campaign.totalVotes)}
                  </span>{' '}
                  votes cast · {campaign.totalNominees} nominees
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-2 text-xs uppercase tracking-widest text-faint">
                  Voting closes in
                </div>
                <CountdownTimer endDate={campaign.endDate} />
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-500/30 to-accent-500/30 dark:border-white/10">
                {campaign.featuredImage && (
                  <Image
                    src={campaign.featuredImage}
                    alt={campaign.title}
                    fill
                    priority
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/50 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span>Vote from</span>
                    <span className="rounded-full bg-brand-500/25 px-2 py-0.5 font-semibold text-white">
                      KES {campaign.votePriceKes}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-white">
                    Paid instantly via M-Pesa STK push.
                  </div>
                </div>
              </div>

              <div className="absolute -left-6 -top-6 hidden md:block">
                <div className="glass rounded-2xl px-4 py-3 text-xs text-strong shadow-glow">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500 dark:bg-brand-400" />
                    Live now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
