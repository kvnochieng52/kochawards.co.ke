import { MousePointerClick, Smartphone, Trophy } from 'lucide-react';

const steps = [
  {
    icon: MousePointerClick,
    title: 'Pick a nominee',
    text: 'Scroll through the shortlist, dive into their story, and choose the community worker you want to lift.',
  },
  {
    icon: Smartphone,
    title: 'Pay via M-Pesa',
    text: 'One vote = KES 10. Enter your number, approve the STK push, done in seconds.',
  },
  {
    icon: Trophy,
    title: 'Fund their next project',
    text: 'Live leaderboards update instantly and part of every vote goes to the winner’s next project.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="container-x mt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-faint">How Kura works</div>
          <h2 className="heading-display mt-2 text-3xl text-strong md:text-4xl">
            Three taps. One winner.
          </h2>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="glass relative rounded-3xl p-6">
              <div className="absolute right-5 top-5 heading-display text-6xl text-slate-100 dark:text-white/[0.04]">
                0{i + 1}
              </div>
              <div className="inline-flex rounded-2xl bg-brand-500/15 p-3 text-brand-700 dark:text-brand-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="heading-display mt-5 text-xl text-strong">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
