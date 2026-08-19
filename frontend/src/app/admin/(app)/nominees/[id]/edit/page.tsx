'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { NomineeForm } from '@/components/admin/NomineeForm';
import type { Nominee } from '@/lib/types';
import { ApiError, publicApi } from '@/lib/api';

export default function EditNomineePage() {
  const params = useParams<{ id: string }>();
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'notfound'>('loading');

  useEffect(() => {
    publicApi
      .nominee(params.id)
      .then((n) => {
        setNominee(n);
        setState('ready');
      })
      .catch((e) => {
        setState(e instanceof ApiError && e.status === 404 ? 'notfound' : 'ready');
      });
  }, [params.id]);

  if (state === 'notfound') return notFound();

  return (
    <>
      <AdminTopBar
        title={nominee ? `Edit · ${nominee.fullName}` : 'Loading nominee…'}
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Nominees', href: '/admin/nominees' },
          { label: 'Edit' },
        ]}
      />
      <div className="mx-auto max-w-5xl p-4 md:p-6">
        {state === 'loading' && (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-muted dark:border-white/10 dark:bg-ink-900">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading nominee…
          </div>
        )}
        {nominee && <NomineeForm mode="edit" initial={nominee} />}
      </div>
    </>
  );
}
