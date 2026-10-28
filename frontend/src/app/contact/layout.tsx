import type { Metadata } from 'next';
import { BomaSiteShell } from '@/components/BomaSiteShell';

export const metadata: Metadata = {
  title: 'Contact — Restoring Dignity Foundation',
  description:
    'Partner, donate or ask us anything about the BOMA BORA programme. We would love to hear from you.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <BomaSiteShell>{children}</BomaSiteShell>;
}
