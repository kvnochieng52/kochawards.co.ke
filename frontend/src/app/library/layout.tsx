import type { Metadata } from 'next';
import { BomaSiteShell } from '@/components/BomaSiteShell';

export const metadata: Metadata = {
  title: 'Library — BOMA BORA',
  description:
    'Videos, moments and stories from the BOMA BORA programme — restoring dignity to elderly persons across Kenya.',
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <BomaSiteShell>{children}</BomaSiteShell>;
}
