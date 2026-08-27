import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Trophy,
  Share2,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { publicApi } from '@/lib/api';
import { CountdownTimer } from '@/components/CountdownTimer';
import { NomineeRowCard } from '@/components/NomineeRowCard';
import { formatDate, formatKes, formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Params {
  params: { slug: string };
}

export default async function CampaignPage({ params }: Params) {
  const c = await publicApi.campaign(params.slug).catch(() => null);
  if (!c) return notFound();
  const nominees = await publicApi.campaignNominees(params.slug).catch(() => []);
  const closed = c.status === 'ended';
  const leader = closed ? 0 : nominees[0]?.votes ?? 0;

  return (
    <div>
      {/* Poster + title header — poster shown clean, title lives below */}
      <div className="container-x pt-6">
        <Link href="/" className="link-back mb-4 w-fit">
          <ArrowLeft className="h-4 w-4" /> All campaigns
        </Link>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] md:aspect-[16/6]">
          {c.featuredImage && (
            <Image
              src={c.featuredImage}
              alt={c.title}
              fill
              priority
              className={`object-contain ${closed ? 'grayscale-[35%]' : ''}`}
            />
          )}
        </div>

        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {closed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500 bg-brand-600 px-3 py-1 text-xs font-semibold uppercase text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                {c.status}
              </span>
            )}
            <span className="chip">{c.category}</span>
            <span className="chip">
              <MapPin className="h-3 w-3" />
              {c.location}
            </span>
          </div>
          <h1 className="heading-display text-3xl text-strong text-balance md:text-4xl">
            {c.title}
          </h1>
          <p className="mt-2 max-w-3xl text-base text-muted md:text-lg">{c.tagline}</p>
        </div>
      </div>

      <div className="container-x mt-8">
        <div className="grid gap-6 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr]">
          <aside className="space-y-3 md:sticky md:top-20 md:self-start">
            {closed ? (
              <div className="rounded-2xl border border-brand-500/40 bg-brand-500/10 p-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <div className="text-[10px] font-semibold uppercase tracking-widest">
                    This campaign has closed
                  </div>
                </div>
                <div className="mt-2 text-sm text-strong">
                  Voting ended {formatDate(c.endDate)}. Results are archived.
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-faint">
                  Voting closes in
                </div>
                <div className="mt-2">
                  <CountdownTimer endDate={c.endDate} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div>
                    <div className="text-faint">Vote price</div>
                    <div className="font-semibold text-strong">
                      {formatKes(c.votePriceKes)}
                    </div>
                  </div>
                  <div>
                    <div className="text-faint">Total votes</div>
                    <div className="font-semibold text-strong">
                      {formatNumber(c.totalVotes)}
                    </div>
                  </div>
                  <div>
                    <div className="text-faint">Starts</div>
                    <div className="font-semibold text-strong">
                      {formatDate(c.startDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-faint">Ends</div>
                    <div className="font-semibold text-strong">
                      {formatDate(c.endDate)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {c.prize && (
              <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
                  <Trophy className="h-4 w-4" />
                  <div className="text-[10px] font-semibold uppercase tracking-widest">
                    {closed ? 'Grand prize (awarded)' : 'Grand prize'}
                  </div>
                </div>
                <div className="mt-1 text-sm font-medium leading-snug text-strong">
                  {c.prize}
                </div>
              </div>
            )}

            {!closed && (
              <button className="btn-ghost w-full">
                <Share2 className="h-4 w-4" />
                Share this campaign
              </button>
            )}

            <details className="group glass rounded-2xl p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-strong">
                <span>About &amp; rules</span>
                <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-body">{c.description}</p>
              {c.rules && (
                <div className="mt-4">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-faint">
                    Rules
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted">
                    {c.rules.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {c.sponsors && c.sponsors.length > 0 && (
                <div className="mt-4 border-t border-slate-200 pt-3 dark:border-white/10">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-faint">
                    Powered by
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.sponsors.map((s) => (
                      <span key={s} className="chip !py-0.5 !text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </details>
          </aside>

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-faint">
                  {closed ? 'Archive' : 'Leaderboard'}
                </div>
                <h2 className="heading-display mt-1 text-2xl text-strong md:text-3xl">
                  {closed
                    ? `${nominees.length} nominees participated`
                    : `${nominees.length} nominees. You decide.`}
                </h2>
              </div>
              {closed ? (
                <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300 md:flex">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Voting closed
                </div>
              ) : (
                <div className="hidden shrink-0 items-center gap-1.5 text-xs text-muted md:flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                  Live · updates in real-time
                </div>
              )}
            </div>

            {nominees.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-sm text-muted">
                  Nominee list has been archived for this campaign.
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {nominees.map((n, i) => (
                  <NomineeRowCard
                    key={n.id}
                    nominee={n}
                    rank={i + 1}
                    leaderVotes={leader}
                    closed={closed}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
