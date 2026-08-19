'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { CampaignForm } from '@/components/admin/CampaignForm';
import type { Campaign } from '@/lib/types';
import { ApiError, publicApi } from '@/lib/api';

export default function EditCampaignPage() {
  const params = useParams<{ slug: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'notfound'>('loading');

  useEffect(() => {
    publicApi
      .campaign(params.slug)
      .then((c) => {
        setCampaign(c);
        setState('ready');
      })
      .catch((e) => {
        setState(e instanceof ApiError && e.status === 404 ? 'notfound' : 'ready');
      });
  }, [params.slug]);

  if (state === 'notfound') return notFound();

  return (
    <>
      <AdminTopBar
        title={campaign ? `Edit · ${campaign.title}` : 'Loading campaign…'}
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Campaigns', href: '/admin/campaigns' },
          { label: 'Edit' },
        ]}
      />
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        {state === 'loading' && (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-muted dark:border-white/10 dark:bg-ink-900">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading campaign…
          </div>
        )}
        {campaign && <CampaignForm mode="edit" initial={campaign} />}
      </div>
    </>
  );
}
