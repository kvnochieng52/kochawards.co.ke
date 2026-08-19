import { AdminShell } from '@/components/admin/AdminShell';
import { AdminGuard } from '@/lib/authGuard';

export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
