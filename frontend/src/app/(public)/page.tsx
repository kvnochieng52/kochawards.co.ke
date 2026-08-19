import { CampaignCard } from '@/components/CampaignCard';
import { HeroFeatured } from '@/components/HeroFeatured';
import { StatsStrip } from '@/components/StatsStrip';
import { CategoryPills } from '@/components/CategoryPills';
import { TrendingNominees } from '@/components/TrendingNominees';
import { HowItWorks } from '@/components/HowItWorks';
import { publicApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const campaigns = await publicApi.campaigns().catch(() => []);
  if (campaigns.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <div className="heading-display text-3xl text-strong">Kura is starting up…</div>
        <p className="mt-2 text-muted">
          Backend not reachable. Start the Laravel server on port 8000.
        </p>
      </div>
    );
  }
  const featured = campaigns.find((c) => c.featured) ?? campaigns[0];
  const live = campaigns.filter((c) => c.status === 'live' && c.id !== featured.id);
  const upcoming = campaigns.filter((c) => c.status === 'upcoming');
  const ended = campaigns.filter((c) => c.status === 'ended');

  return (
    <>
      <HeroFeatured campaign={featured} />
      <StatsStrip campaigns={campaigns} />

      {live.length > 0 && (
        <section id="live" className="container-x mt-20">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-faint">Currently voting</div>
              <h2 className="heading-display mt-2 text-3xl text-strong md:text-4xl">
                Live campaigns
              </h2>
              <p className="mt-1 max-w-lg text-sm text-muted">
                Vote for the community workers moving the needle right now.
              </p>
            </div>
            <CategoryPills />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((c) => (
              <CampaignCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      <TrendingNominees />

      {upcoming.length > 0 && (
        <section className="container-x mt-24">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-faint">Save the date</div>
            <h2 className="heading-display mt-2 text-3xl text-strong md:text-4xl">
              Coming soon
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((c) => (
              <CampaignCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      <HowItWorks />

      {ended.length > 0 && (
        <section className="container-x mt-24">
          <div className="mb-6 flex items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-faint">Reference</div>
              <h2 className="heading-display mt-2 text-3xl text-strong md:text-4xl">
                Past campaigns
              </h2>
              <p className="mt-1 max-w-lg text-sm text-muted">
                A quick look at previous Kura campaigns and their winners.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ended.map((c) => (
              <CampaignCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      <section id="organizers" className="container-x mt-24">
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-transparent dark:shadow-card md:p-14">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />
          </div>
          <div className="relative max-w-2xl">
            <div className="chip-brand">For organizers</div>
            <h2 className="heading-display mt-4 text-3xl text-strong md:text-5xl text-balance">
              Run your own public voting campaign in minutes.
            </h2>
            <p className="mt-4 text-muted">
              County awards, community-worker recognitions, youth contests — we handle payments,
              ID verification and the live leaderboard. You just tell the stories.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn-primary">Apply to host</button>
              <button className="btn-ghost">See pricing</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
