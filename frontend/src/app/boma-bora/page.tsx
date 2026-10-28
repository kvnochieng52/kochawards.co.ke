'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Heart,
  HomeIcon,
  Shield,
  Users,
  CheckCircle2,
  Loader2,
  Smartphone,
  AlertTriangle,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';
import { donationApi, type DonationRecord } from '@/lib/api';
import { formatKes } from '@/lib/utils';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

type DonationState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'awaiting'; donation: DonationRecord; message: string }
  | { kind: 'success'; donation: DonationRecord }
  | { kind: 'failed'; message: string };

export default function BomaBoraPage() {
  return (
    <div>
      <Hero />
      <PillarsStrip />
      <IntroVideoSection />
      <DonateSection />
      <StorySection />
      <ClosingCTA />
    </div>
  );
}

/* -------------------------------------------------------------------- Hero */

function Hero() {
  return (
    <section className="container-x pt-6">
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm dark:border-amber-500/20 dark:from-ink-900 dark:via-ink-900 dark:to-amber-950/40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl"
        />

        <div className="relative px-6 py-10 text-center md:px-10 md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            A Restoring Dignity Foundation Initiative
          </span>

          <h1 className="heading-display mx-auto mt-5 max-w-3xl text-5xl leading-[1.05] text-strong md:text-7xl">
            BOMA BORA
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xl font-semibold text-amber-700 dark:text-amber-300 md:text-2xl">
            A home of dignity. A future of hope.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
            Safe homes for vulnerable elderly persons — one house, one elder, one dignity restored at a time.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#donate"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600 md:text-base"
            >
              <Heart className="h-4 w-4" />
              Donate any amount
            </a>
            <a
              href="#intro-video"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-strong transition hover:border-amber-500/60 dark:border-white/10 dark:bg-white/[0.03] md:text-base"
            >
              <PlayCircle className="h-4 w-4" />
              Watch the story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Pillars */

function PillarsStrip() {
  const pillars = [
    { icon: HomeIcon, title: 'Safe Relocation', body: 'Back to roots. Back to family.' },
    { icon: Shield, title: 'Dignified Living', body: 'Decent, secure houses.' },
    { icon: Users, title: 'Restored Hope', body: 'Belonging. Peace. Purpose.' },
  ];

  return (
    <section className="container-x mt-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-500/40 dark:border-white/10 dark:bg-ink-900"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
              <p.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-strong">{p.title}</div>
              <div className="text-xs text-muted">{p.body}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Introductory video */

function IntroVideoSection() {
  return (
    <section id="intro-video" className="container-x mt-10 scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <YoutubeEmbed
          videoId="vRlWxDldJE4"
          title="BOMA BORA — Introduction"
        />
        <p className="mt-3 text-center text-xs uppercase tracking-widest text-faint">
          Introduction · 2 minutes
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Beneficiary */

function StorySection() {
  return (
    <section className="container-x mt-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            A beneficiary story
          </div>
          <h2 className="heading-display mt-1 text-2xl text-strong md:text-3xl">
            One elder. One home. A life renewed.
          </h2>
        </div>
        <YoutubeEmbed
          videoId="YWj1nLR5JoA"
          title="BOMA BORA — Beneficiary Story"
        />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Donate */

function DonateSection() {
  const [amount, setAmount] = useState<number | ''>(1000);
  const [customFocused, setCustomFocused] = useState(false);
  const [phone, setPhone] = useState('');
  const [donorName, setDonorName] = useState('');
  const [state, setState] = useState<DonationState>({ kind: 'idle' });
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stop = () => {
      if (pollRef.current) {
        clearTimeout(pollRef.current);
        pollRef.current = null;
      }
    };

    if (state.kind !== 'awaiting') {
      stop();
      return;
    }

    const id = state.donation.id;
    let cancelled = false;

    const tick = async () => {
      try {
        const r = await donationApi.status(id);
        const d = r.data;
        if (cancelled) return;
        if (d.status === 'success') {
          setState({ kind: 'success', donation: d });
          return;
        }
        if (d.status === 'failed' || d.status === 'cancelled') {
          setState({
            kind: 'failed',
            message:
              d.status === 'cancelled'
                ? 'You cancelled the M-Pesa prompt. You can try again any time.'
                : 'The donation didn’t go through. Please try again.',
          });
          return;
        }
        pollRef.current = setTimeout(tick, 3000);
      } catch {
        pollRef.current = setTimeout(tick, 5000);
      }
    };

    pollRef.current = setTimeout(tick, 3000);
    return () => {
      cancelled = true;
      stop();
    };
  }, [state]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind === 'submitting' || state.kind === 'awaiting') return;
    const amt = typeof amount === 'number' ? amount : 0;
    if (!amt || amt < 10) {
      setState({ kind: 'failed', message: 'Please enter an amount of at least KES 10.' });
      return;
    }
    if (!phone.trim()) {
      setState({ kind: 'failed', message: 'Please enter the phone number to donate from.' });
      return;
    }

    setState({ kind: 'submitting' });
    try {
      const r = await donationApi.initiate({
        program: 'boma-bora',
        donor_name: donorName.trim() || undefined,
        phone: phone.trim(),
        amount: amt,
      });
      setState({ kind: 'awaiting', donation: r.data, message: r.message });
    } catch (err: any) {
      setState({
        kind: 'failed',
        message:
          err?.message || 'We could not reach the payment service. Please try again shortly.',
      });
    }
  };

  const reset = () => setState({ kind: 'idle' });
  const isBusy = state.kind === 'submitting' || state.kind === 'awaiting';

  return (
    <section id="donate" className="container-x mt-14 scroll-mt-24">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50 to-white p-6 shadow-md dark:border-amber-500/20 dark:from-amber-950/30 dark:to-ink-900 md:p-8">
          {state.kind === 'success' ? (
            <SuccessPanel donation={state.donation} onDonateAgain={reset} />
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                  <Heart className="h-3 w-3" />
                  Donate
                </div>
                <div className="heading-display mt-3 text-3xl text-strong md:text-4xl">
                  Give an elder a home
                </div>
                <div className="mt-1 text-sm text-muted">Any amount. Instant M-Pesa.</div>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((a) => {
                    const active = amount === a && !customFocused;
                    return (
                      <button
                        type="button"
                        key={a}
                        onClick={() => {
                          setAmount(a);
                          setCustomFocused(false);
                        }}
                        disabled={isBusy}
                        className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          active
                            ? 'border-amber-500 bg-amber-500 text-white shadow'
                            : 'border-slate-200 bg-white text-strong hover:border-amber-400 dark:border-white/10 dark:bg-white/[0.03]'
                        }`}
                      >
                        {a.toLocaleString('en-KE')}
                      </button>
                    );
                  })}
                </div>
                <div className="relative mt-3">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-faint">
                    KES
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={10}
                    step={10}
                    value={amount}
                    onFocus={() => setCustomFocused(true)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAmount(v === '' ? '' : Math.max(0, parseInt(v, 10) || 0));
                    }}
                    disabled={isBusy}
                    placeholder="Enter a custom amount"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-14 pr-4 text-lg font-semibold text-strong outline-none transition focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.03]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isBusy}
                    placeholder="M-Pesa phone (0712…)"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm text-strong outline-none transition focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.03]"
                  />
                </div>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  disabled={isBusy}
                  placeholder="Your name (optional)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-strong outline-none transition focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.03]"
                />
              </div>

              {state.kind === 'awaiting' && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
                  <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
                  <div>
                    <div className="font-semibold">Check your phone</div>
                    <div className="mt-0.5 text-xs">{state.message}</div>
                  </div>
                </div>
              )}

              {state.kind === 'failed' && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>{state.message}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {state.kind === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending STK push…
                  </>
                ) : state.kind === 'awaiting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Waiting for M-Pesa…
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    Donate {typeof amount === 'number' && amount > 0 ? formatKes(amount) : 'now'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-faint">
                Secure M-Pesa STK Push · 100% to the programme
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function SuccessPanel({
  donation,
  onDonateAgain,
}: {
  donation: DonationRecord;
  onDonateAgain: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h3 className="heading-display mt-4 text-2xl text-strong">Asante sana!</h3>
      <p className="mt-2 text-sm text-muted">
        Your gift of{' '}
        <span className="font-semibold text-strong">{formatKes(donation.amountKes)}</span>{' '}
        brings an elder closer to a safe home.
      </p>
      {donation.mpesaReceipt && (
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-xs font-semibold text-amber-800 dark:text-amber-200">
          M-Pesa receipt: {donation.mpesaReceipt}
        </div>
      )}
      <div className="mt-6">
        <button
          type="button"
          onClick={onDonateAgain}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-strong transition hover:border-amber-500 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <Heart className="h-4 w-4" />
          Give again
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Closing CTA */

function ClosingCTA() {
  return (
    <section className="container-x mt-14">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-center text-white shadow-lg md:p-12">
        <h2 className="heading-display text-2xl md:text-4xl">
          Every elder. Every one. One home at a time.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 md:text-base">
          Because no one should grow old feeling forgotten.
        </p>
        <a
          href="#donate"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50"
        >
          <Heart className="h-4 w-4" />
          Donate to BOMA BORA
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Youtube embed */

function YoutubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm dark:border-white/10">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
