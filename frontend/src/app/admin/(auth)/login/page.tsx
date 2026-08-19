'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ApiError, authApi, setToken } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      setToken(res.token);
      router.push('/admin');
    } catch (err) {
      if (err instanceof ApiError) {
        const first = err.errors ? Object.values(err.errors)[0]?.[0] : null;
        setError(first || err.message);
      } else {
        setError('Could not reach the server. Is the API running on port 8000?');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:ring-white/10">
            <Image src="/logo.png" alt="Kura" fill className="object-contain p-0.5" />
          </div>
          <div className="leading-tight">
            <div className="heading-display text-xl text-strong">Kura</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
              Admin console
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-ink-900 dark:shadow-card md:p-8">
          <h1 className="heading-display text-2xl text-strong">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to manage campaigns and nominees.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-faint">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@kura.co.ke"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-strong outline-none placeholder:text-faint focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-widest text-faint">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-[11px] font-semibold text-brand-700 hover:underline dark:text-brand-300"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-strong outline-none placeholder:text-faint focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:text-strong"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                defaultChecked
              />
              Remember me on this device
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] text-muted dark:border-white/10 dark:bg-white/[0.03]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" />
            Access is restricted. All actions are logged and audited.
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted">
          Back to{' '}
          <Link href="/" className="font-semibold text-strong hover:underline">
            Kura homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
