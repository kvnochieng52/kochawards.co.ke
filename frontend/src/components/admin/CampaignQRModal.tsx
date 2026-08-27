'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Download, Loader2, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import type { Campaign } from '@/lib/types';

interface Props {
  campaign: Campaign | null;
  onClose: () => void;
}

export function CampaignQRModal({ campaign, onClose }: Props) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const publicUrl =
    campaign && typeof window !== 'undefined'
      ? `${window.location.origin}/campaigns/${campaign.slug}`
      : '';

  useEffect(() => {
    if (!campaign) return;
    setLoading(true);
    QRCode.toDataURL(publicUrl, {
      errorCorrectionLevel: 'H',
      width: 512,
      margin: 2,
      color: { dark: '#0a5634', light: '#ffffff' },
    })
      .then((url) => {
        setDataUrl(url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [campaign, publicUrl]);

  if (!campaign) return null;

  const filename = `${campaign.slug || 'campaign'}.png`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-ink-900"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
            Scan to vote
          </div>
          <h2 className="heading-display mt-1 text-xl text-strong">{campaign.title}</h2>
          <p className="mt-1 text-xs text-muted">
            Print or share this QR — voters land straight on the campaign page.
          </p>

          <div className="mt-6 flex justify-center">
            {loading ? (
              <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
                <Loader2 className="h-6 w-6 animate-spin text-muted" />
              </div>
            ) : dataUrl ? (
              <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/10">
                <Image
                  src={dataUrl}
                  alt={`QR code for ${campaign.title}`}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-red-50 text-xs text-red-600">
                Failed to generate QR
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={copyUrl}
              className="mx-auto flex max-w-full items-center gap-2 truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-muted hover:text-strong dark:border-white/10 dark:bg-white/[0.03]"
            >
              {copied ? (
                <Check className="h-3 w-3 shrink-0 text-brand-600" />
              ) : (
                <Copy className="h-3 w-3 shrink-0" />
              )}
              <span className="truncate font-mono">{publicUrl}</span>
            </button>
          </div>

          <a
            href={dataUrl || '#'}
            download={filename}
            onClick={(e) => {
              if (!dataUrl) e.preventDefault();
            }}
            className="btn-primary mt-6 inline-flex w-full items-center justify-center"
          >
            <Download className="h-4 w-4" />
            Download PNG
          </a>

          <div className="mt-2 text-[11px] text-faint">Saves as {filename}</div>
        </div>
      </div>
    </div>
  );
}
