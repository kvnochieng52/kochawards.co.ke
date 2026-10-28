import type { Metadata } from 'next';
import { BomaSiteShell } from '@/components/BomaSiteShell';

export const metadata: Metadata = {
  title: 'About — Restoring Dignity Foundation',
  description:
    'Who we are, what we believe in, and why BOMA BORA matters — restoring dignity to vulnerable elderly persons in Kenya.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <BomaSiteShell>{children}</BomaSiteShell>;
}
