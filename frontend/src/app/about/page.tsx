import Link from 'next/link';
import { Heart, HomeIcon, Shield, Users, Target, Eye, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <Hero />
      <StoryGrid />
      <MissionVision />
      <Values />
      <JoinCTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="container-x pt-6">
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm dark:border-amber-500/20 dark:from-ink-900 dark:via-ink-900 dark:to-amber-950/40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div className="relative px-6 py-10 text-center md:px-10 md:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            About us
          </span>
          <h1 className="heading-display mx-auto mt-4 max-w-3xl text-4xl leading-tight text-strong md:text-6xl">
            Restoring the dignity of our elders.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
            Restoring Dignity Foundation exists so that no elderly person has to grow old
            without a safe, decent place to call home.
          </p>
        </div>
      </div>
    </section>
  );
}

function StoryGrid() {
  return (
    <section className="container-x mt-10">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-ink-900 md:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            Our story
          </div>
          <h2 className="heading-display mt-2 text-2xl text-strong md:text-3xl">
            Born from a conviction
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Too many of our elders spend their sunset years in loneliness, unsafe conditions,
            or without a safe place to call home. Restoring Dignity Foundation was founded on a
            simple conviction — that growing old should never mean losing one’s dignity.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-ink-900 md:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            What is BOMA BORA?
          </div>
          <h2 className="heading-display mt-2 text-2xl text-strong md:text-3xl">
            Safe homes, back where they belong
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            BOMA BORA is our flagship programme — safely relocating vulnerable elderly persons
            from urban hardship back to their rural roots, and building them decent houses
            where they can live out their years in peace, comfort and dignity.
          </p>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  const items = [
    {
      icon: Target,
      kicker: 'Mission',
      title: 'Build safe, dignified homes',
      body:
        'To relocate and resettle vulnerable elderly persons in safe, decent houses — restoring hope and dignity, one home at a time.',
    },
    {
      icon: Eye,
      kicker: 'Vision',
      title: 'Homes where elders feel loved',
      body:
        'A Kenya where every elder sleeps peacefully in a home where they feel safe, valued, respected and loved.',
    },
  ];

  return (
    <section className="container-x mt-10">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.kicker}
            className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm dark:border-amber-500/20 dark:from-amber-950/30 dark:to-ink-900 md:p-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
              <i.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
              {i.kicker}
            </div>
            <div className="heading-display mt-1 text-xl text-strong md:text-2xl">
              {i.title}
            </div>
            <p className="mt-3 text-sm text-muted">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Values() {
  const values = [
    { icon: HomeIcon, title: 'Dignity', body: 'The right to a safe, decent home is non-negotiable.' },
    { icon: Shield, title: 'Compassion', body: 'We serve the vulnerable with respect and love.' },
    { icon: Users, title: 'Community', body: 'Reconnecting elders with roots, family and belonging.' },
    { icon: Sparkles, title: 'Hope', body: 'Every house is a reason to smile again.' },
  ];

  return (
    <section className="container-x mt-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            Our values
          </div>
          <h2 className="heading-display mt-1 text-2xl text-strong md:text-3xl">
            What guides our work
          </h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-500/40 dark:border-white/10 dark:bg-ink-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
                <v.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-semibold text-strong">{v.title}</div>
              <p className="mt-1 text-xs text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinCTA() {
  return (
    <section className="container-x mt-14">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-center text-white shadow-lg md:p-12">
        <h2 className="heading-display text-2xl md:text-4xl">Walk with us.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 md:text-base">
          Partner, donate, or share the mission. Every elder matters.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/boma-bora#donate"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50"
          >
            <Heart className="h-4 w-4" />
            Donate
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Partner with us
          </Link>
        </div>
      </div>
    </section>
  );
}
