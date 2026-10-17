import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Lock } from 'lucide-react';

export default function PublicLayout({ children: _children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40 dark:opacity-100" />
      <Header />
      <main className="pb-24 pt-4">
        <VotingClosed />
      </main>
      <Footer />
    </>
  );
}

function VotingClosed() {
  return (
    <section className="container-x">
      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-ink-900 md:p-12">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="heading-display text-3xl text-strong md:text-4xl">Voting has been closed</h1>
        <p className="mt-3 text-sm text-muted md:text-base">
          Thank you to everyone who participated. All campaigns are now closed and no further votes
          can be submitted. Results will be communicated through official channels.
        </p>
      </div>
    </section>
  );
}
