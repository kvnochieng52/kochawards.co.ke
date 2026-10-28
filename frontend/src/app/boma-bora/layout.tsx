import type { Metadata } from 'next';
import { BomaSiteShell } from '@/components/BomaSiteShell';

export const metadata: Metadata = {
  title: 'BOMA BORA — A home of dignity. A future of hope.',
  description:
    'A Restoring Dignity Foundation initiative. Help us build safe, dignified homes for vulnerable elderly persons.',
};

export default function BomaBoraLayout({ children }: { children: React.ReactNode }) {
  return <BomaSiteShell>{children}</BomaSiteShell>;
}
