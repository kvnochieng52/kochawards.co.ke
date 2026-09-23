import type { Campaign } from '@/lib/types';

export function StatsStrip({ campaigns }: { campaigns: Campaign[] }) {
  const totalNominees = campaigns.reduce((s, c) => s + c.totalNominees, 0);
  const live = campaigns.filter((c) => c.status === 'live').length;

  const stats = [
    { label: 'Live campaigns', value: live },
    { label: 'Nominees', value: totalNominees },
    { label: 'Counties reached', value: 47 },
  ];

  return (
    <section className="container-x mt-10">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass flex flex-col rounded-2xl px-5 py-4">
            <div className="heading-display text-3xl text-strong tabular-nums">{s.value}</div>
            <div className="text-xs uppercase tracking-widest text-faint">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
