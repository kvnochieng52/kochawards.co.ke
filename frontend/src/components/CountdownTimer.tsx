'use client';

import { useEffect, useState } from 'react';
import { timeRemaining } from '@/lib/utils';

interface Props {
  endDate: string;
  compact?: boolean;
}

export function CountdownTimer({ endDate, compact }: Props) {
  const [t, setT] = useState<ReturnType<typeof timeRemaining> | null>(null);

  useEffect(() => {
    setT(timeRemaining(endDate));
    const id = setInterval(() => setT(timeRemaining(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (t?.ended) {
    return <span className="chip">Voting closed</span>;
  }

  if (compact) {
    return (
      <span
        suppressHydrationWarning
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
        {t
          ? t.days > 0
            ? `${t.days}d ${t.hours}h left`
            : `${t.hours}h ${t.minutes}m left`
          : '— left'}
      </span>
    );
  }

  const cells = [
    { v: t?.days, l: 'Days' },
    { v: t?.hours, l: 'Hours' },
    { v: t?.minutes, l: 'Min' },
    { v: t?.seconds, l: 'Sec' },
  ];

  return (
    <div className="flex items-center gap-2">
      {cells.map((c) => (
        <div key={c.l} className="glass min-w-[64px] rounded-2xl px-3 py-2 text-center">
          <div
            suppressHydrationWarning
            className="heading-display text-2xl leading-none text-strong tabular-nums"
          >
            {c.v === undefined ? '--' : String(c.v).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-faint">{c.l}</div>
        </div>
      ))}
    </div>
  );
}
