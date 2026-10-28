'use client';

import { useState } from 'react';
import {
  Mail,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Heart,
} from 'lucide-react';
import { contactApi } from '@/lib/api';

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; message: string }
  | { kind: 'failed'; message: string };

export default function ContactPage() {
  return (
    <div>
      <Hero />
      <ContactSection />
      <WaysToSupport />
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
            <Mail className="h-3 w-3" />
            Contact
          </span>
          <h1 className="heading-display mx-auto mt-4 max-w-3xl text-4xl leading-tight text-strong md:text-6xl">
            We would love to hear from you.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
            Partner with us, donate, volunteer, or simply reach out. Every message helps us
            reach another elder.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="container-x mt-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
        <ContactInfo />
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactInfo() {
  const items: Array<{ icon: typeof Mail; label: string; value: string; href?: string }> = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@kochawards.co.ke',
      href: 'mailto:info@kochawards.co.ke',
    },
    { icon: MapPin, label: 'Office', value: 'Nairobi, Kenya' },
  ];

  return (
    <div className="lg:col-span-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-ink-900 md:p-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
          Reach us
        </div>
        <h2 className="heading-display mt-2 text-2xl text-strong">Get in touch</h2>
        <p className="mt-2 text-sm text-muted">
          Our team responds within one working day.
        </p>
        <ul className="mt-6 space-y-5">
          {items.map((i) => (
            <li key={i.label} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
                <i.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-faint">
                  {i.label}
                </div>
                {i.href ? (
                  <a
                    href={i.href}
                    className="mt-0.5 block break-all text-sm font-semibold text-strong hover:text-amber-600"
                  >
                    {i.value}
                  </a>
                ) : (
                  <div className="mt-0.5 text-sm font-semibold text-strong">{i.value}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind === 'submitting') return;

    if (!name.trim() || !email.trim() || message.trim().length < 5) {
      setState({
        kind: 'failed',
        message: 'Please share your name, email and a short message (at least 5 characters).',
      });
      return;
    }

    setState({ kind: 'submitting' });
    try {
      const r = await contactApi.send({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim() || undefined,
        message: message.trim(),
      });
      setState({ kind: 'success', message: r.message });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setState({
        kind: 'failed',
        message: err?.message || 'We could not send your message. Please try again shortly.',
      });
    }
  };

  const isBusy = state.kind === 'submitting';

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50 to-white p-6 shadow-md dark:border-amber-500/20 dark:from-amber-950/30 dark:to-ink-900 md:p-8">
      {state.kind === 'success' ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="heading-display mt-4 text-2xl text-strong">Message sent</h3>
          <p className="mt-2 text-sm text-muted">{state.message}</p>
          <button
            type="button"
            onClick={() => setState({ kind: 'idle' })}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-strong transition hover:border-amber-500 dark:border-white/10 dark:bg-white/[0.03]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <div className="heading-display text-2xl text-strong">Send us a message</div>
            <div className="mt-1 text-sm text-muted">
              We’ll get back to you within one working day.
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isBusy}
                required
                className="input-field"
                placeholder="e.g. Jane Mwangi"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isBusy}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone" optional>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isBusy}
                className="input-field"
                placeholder="0712 345 678"
              />
            </Field>
            <Field label="Subject" optional>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isBusy}
                className="input-field"
                placeholder="How can we help?"
              />
            </Field>
          </div>

          <Field label="Message">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isBusy}
              required
              rows={5}
              className="input-field resize-none"
              placeholder="Tell us a little about why you’re reaching out…"
            />
          </Field>

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
            {isBusy ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>
        </form>
      )}
      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: #fff;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: inherit;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field:focus {
          border-color: rgb(245 158 11);
        }
        .input-field:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .dark .input-field {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-faint">
        {label}
        {optional && <span className="ml-1 normal-case text-faint">(optional)</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function WaysToSupport() {
  const ways = [
    {
      kicker: 'Donate',
      title: 'Give any amount',
      body: 'Instant M-Pesa STK push. Every shilling builds a dignified home.',
      href: '/boma-bora#donate',
      cta: 'Donate now',
    },
    {
      kicker: 'Partner',
      title: 'Walk with us',
      body: 'For organisations, churches and well-wishers looking to co-build.',
      href: '/contact#top',
      cta: 'Reach the team',
    },
    {
      kicker: 'Share',
      title: 'Tell the story',
      body: 'Watch and share the beneficiary story — awareness is action.',
      href: '/library',
      cta: 'Visit the library',
    },
  ];

  return (
    <section className="container-x mt-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            Other ways to help
          </div>
          <h2 className="heading-display mt-1 text-2xl text-strong md:text-3xl">
            Three ways to walk with us
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {ways.map((w) => (
            <div
              key={w.kicker}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-500/40 dark:border-white/10 dark:bg-ink-900"
            >
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                {w.kicker}
              </div>
              <div className="mt-2 text-lg font-semibold text-strong">{w.title}</div>
              <p className="mt-2 flex-1 text-sm text-muted">{w.body}</p>
              <a
                href={w.href}
                className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600"
              >
                <Heart className="h-3.5 w-3.5" />
                {w.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
