export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-ink-950">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60 dark:opacity-100">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent-500/25 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
