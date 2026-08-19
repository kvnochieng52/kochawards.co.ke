import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40 dark:opacity-100" />
      <Header />
      <main className="pb-24 pt-4">{children}</main>
      <Footer />
    </>
  );
}
