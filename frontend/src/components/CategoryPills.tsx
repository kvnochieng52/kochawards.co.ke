'use client';

import { useState } from 'react';
import clsx from 'clsx';

const filters = [
  'All',
  'Live',
  'Health',
  'Education',
  'Youth',
  'Women',
  'Environment',
  'Advocacy',
];

export function CategoryPills() {
  const [active, setActive] = useState('All');
  return (
    <div className="no-scrollbar mask-fade-r flex gap-2 overflow-x-auto pb-1">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setActive(f)}
          className={clsx(
            'shrink-0 rounded-full border px-4 py-2 text-sm transition',
            active === f
              ? 'border-brand-500/60 bg-brand-500/10 text-brand-700 dark:text-brand-200'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70 dark:hover:border-white/20 dark:hover:text-white'
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
