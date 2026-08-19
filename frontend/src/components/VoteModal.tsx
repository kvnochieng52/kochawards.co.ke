'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Nominee } from '@/lib/types';
import { formatKes } from '@/lib/utils';
import { ApiError, voteApi } from '@/lib/api';

type Step = 'amount' | 'phone' | 'pending' | 'success' | 'failed';

interface Props {
  nominee: Nominee;
  open: boolean;
  onClose: () => void;
}

const PRESETS = [10, 50, 100, 500, 1000];

export function VoteModal({ nominee, open, onClose }: Props) {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState<number>(10);
  const [custom, setCustom] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const votes = Math.max(1, Math.floor(amount / 10));

  useEffect(() => {
    if (!open) {
      setStep('amount');
      setAmount(10);
      setCustom('');
      setPhone('');
      setStatusMessage('');
      setError(null);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
  }, [open]);

  const initiate = async () => {
    setError(null);
    setStep('pending');
    try {
      const res = await voteApi.initiate({
        nominee_id: Number(nominee.id),
        phone: `254${phone}`,
        amount,
      });
      const id = res.data.id;
      setStatusMessage(res.message);

      // Dev: if backend simulated (no Daraja creds), auto-mark success after 2s
      const simulated = /simulated/i.test(res.message);
      if (simulated) {
        setTimeout(async () => {
          try {
            await voteApi.simulate(id);
            setStep('success');
          } catch {
            setStep('failed');
            setError('Simulation failed');
          }
        }, 2000);
        return;
      }

      // Otherwise: poll every 3s for status
      pollRef.current = setInterval(async () => {
        try {
          const s = await voteApi.status(id);
          const st = s.data.status;
          if (st === 'success') {
            if (pollRef.current) clearInterval(pollRef.current);
            setStep('success');
          } else if (st === 'failed' || st === 'cancelled') {
            if (pollRef.current) clearInterval(pollRef.current);
            setStep('failed');
            setError(
              st === 'cancelled' ? 'You cancelled the M-Pesa prompt.' : 'M-Pesa payment failed.'
            );
          }
        } catch {
          // keep polling
        }
      }, 3000);
    } catch (err) {
      setStep('failed');
      if (err instanceof ApiError) {
        const first = err.errors ? Object.values(err.errors)[0]?.[0] : null;
        setError(first || err.message);
      } else {
        setError('Could not reach the server.');
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-3 backdrop-blur-sm dark:bg-ink-950/70 md:items-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-900 dark:shadow-glow">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative h-28 bg-gradient-to-br from-brand-500/25 via-brand-500/10 to-accent-500/25">
          <div className="absolute inset-x-0 -bottom-8 flex justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 ring-4 ring-white dark:bg-white/5 dark:ring-ink-900">
              {nominee.photo ? (
                <Image
                  src={nominee.photo}
                  alt={nominee.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-muted">
                  {nominee.fullName
                    .split(' ')
                    .map((s) => s[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-12 text-center">
          <div className="text-xs uppercase tracking-widest text-faint">You’re voting for</div>
          <div className="mt-1 heading-display text-xl text-strong">{nominee.fullName}</div>
          <div className="text-sm text-muted">{nominee.category}</div>

          {step === 'amount' && (
            <div className="mt-6 space-y-5 text-left">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-faint">
                  Choose amount
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {PRESETS.map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setAmount(v);
                        setCustom('');
                      }}
                      className={`rounded-2xl border px-2 py-3 text-sm font-semibold transition ${
                        amount === v && !custom
                          ? 'border-brand-500/70 bg-brand-500/10 text-brand-700 dark:text-brand-200'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80 dark:hover:border-white/25'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-faint">
                  Or custom amount (KES)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={10}
                  step={10}
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    const n = parseInt(e.target.value || '0', 10);
                    if (!Number.isNaN(n) && n > 0) setAmount(n);
                  }}
                  placeholder="e.g. 250"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg text-strong outline-none placeholder:text-slate-400 focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03] dark:placeholder:text-white/30"
                />
              </div>

              <div className="rounded-2xl border border-brand-500/30 bg-brand-500/[0.08] p-4">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>You’ll be sending</span>
                  <span className="heading-display text-2xl text-brand-700 dark:text-brand-300">
                    {formatKes(amount)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-faint">
                  <span>KES 10 per vote</span>
                  <span>
                    ={' '}
                    <span className="font-semibold text-strong">
                      {votes} vote{votes > 1 && 's'}
                    </span>
                  </span>
                </div>
              </div>

              <button
                disabled={amount < 10}
                onClick={() => setStep('phone')}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to M-Pesa
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-faint">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure payment · No card data stored
              </p>
            </div>
          )}

          {step === 'phone' && (
            <div className="mt-6 space-y-5 text-left">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-faint">
                  M-Pesa phone number
                </label>
                <div className="flex items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]">
                  <span className="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-4 text-sm text-muted dark:border-white/10 dark:bg-white/[0.03]">
                    <span className="text-lg">🇰🇪</span> +254
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    placeholder="712 345 678"
                    className="w-full bg-transparent px-4 py-3 text-lg text-strong outline-none placeholder:text-slate-400 dark:placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-white/10 dark:bg-white/[0.02]">
                <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" />
                <div className="text-xs text-muted">
                  We’ll send an STK push to your phone. Enter your M-Pesa PIN to complete the
                  payment. You’ll cast{' '}
                  <span className="font-semibold text-strong">
                    {votes} vote{votes > 1 && 's'}
                  </span>{' '}
                  for {nominee.fullName}.
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('amount')} className="btn-ghost flex-1">
                  Back
                </button>
                <button
                  disabled={phone.length < 9}
                  onClick={initiate}
                  className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send STK push
                </button>
              </div>
            </div>
          )}

          {step === 'pending' && (
            <div className="mt-8 flex flex-col items-center gap-4 py-6">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-brand-500/40" />
                <div className="relative rounded-full bg-brand-500/15 p-5 text-brand-700 dark:text-brand-300">
                  <Smartphone className="h-8 w-8" />
                </div>
              </div>
              <div className="heading-display text-xl text-strong">Check your phone</div>
              <p className="max-w-sm text-sm text-muted">
                An M-Pesa prompt has been sent to <b className="text-strong">+254{phone}</b>. Enter
                your PIN to confirm {formatKes(amount)}.
              </p>
              {statusMessage && (
                <p className="max-w-sm text-[11px] text-faint">{statusMessage}</p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-faint">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Waiting for confirmation…
              </div>
            </div>
          )}

          {step === 'failed' && (
            <div className="mt-8 flex flex-col items-center gap-4 py-6">
              <div className="rounded-full bg-red-500/15 p-5 text-red-600">
                <AlertCircle className="h-10 w-10" />
              </div>
              <div className="heading-display text-xl text-strong">Payment didn’t go through</div>
              <p className="max-w-sm text-sm text-muted">{error ?? 'Please try again.'}</p>
              <div className="flex w-full gap-3">
                <button onClick={onClose} className="btn-ghost flex-1">
                  Close
                </button>
                <button onClick={() => setStep('amount')} className="btn-primary flex-1">
                  Try again
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="mt-8 flex flex-col items-center gap-4 py-6">
              <div className="rounded-full bg-brand-500/15 p-5 text-brand-700 dark:text-brand-300">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="heading-display text-2xl text-strong">Vote cast! 🎉</div>
              <p className="max-w-sm text-sm text-muted">
                Thank you for supporting {nominee.fullName}. You cast{' '}
                <b className="text-strong">
                  {votes} vote{votes > 1 && 's'}
                </b>{' '}
                for {formatKes(amount)}. A confirmation has been sent via SMS.
              </p>
              <button onClick={onClose} className="btn-primary mt-2 w-full">
                Done
              </button>
              <button
                onClick={() => setStep('amount')}
                className="text-xs text-muted underline underline-offset-2 hover:text-strong"
              >
                Vote again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
