'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Plus,
  Save,
  Trash2,
  ShieldCheck,
  Info,
  Calendar,
  Trophy,
  Star,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { Campaign, Category } from '@/lib/types';
import { adminApi, ApiError } from '@/lib/api';

const CATEGORIES: Category[] = [
  'Community',
  'Health',
  'Education',
  'Environment',
  'Youth',
  'Women',
  'Advocacy',
  'Farming',
  'Savings',
];

type CampaignDraft = Partial<Campaign> & {
  featuredImageDataUrl?: string;
};

interface Props {
  initial?: Partial<Campaign>;
  mode: 'create' | 'edit';
}

function Section({
  title,
  hint,
  icon: Icon,
  children,
}: {
  title: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-ink-900">
      <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-white/5">
        <div className="rounded-xl bg-brand-500/10 p-2 text-brand-700 dark:text-brand-300">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-strong">{title}</div>
          {hint && <div className="text-xs text-muted">{hint}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Label({
  children,
  required,
  hint,
}: {
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between">
      <label className="text-xs font-semibold uppercase tracking-widest text-faint">
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {hint && <span className="text-[11px] text-muted">{hint}</span>}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-strong outline-none placeholder:text-faint focus:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toDateTimeLocal(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CampaignForm({ initial, mode }: Props) {
  const router = useRouter();
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CampaignDraft>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    tagline: initial?.tagline ?? '',
    description: initial?.description ?? '',
    featuredImage: initial?.featuredImage ?? '',
    category: initial?.category ?? 'Community',
    organizer: initial?.organizer ?? '',
    location: initial?.location ?? 'Nationwide',
    startDate: initial?.startDate ?? '',
    endDate: initial?.endDate ?? '',
    votePriceKes: initial?.votePriceKes ?? 20,
    status: initial?.status ?? 'upcoming',
    featured: initial?.featured ?? false,
    prize: initial?.prize ?? '',
    rules: initial?.rules ?? [],
    sponsors: initial?.sponsors ?? [],
  });
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [sponsorInput, setSponsorInput] = useState('');
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof CampaignDraft>(k: K, v: CampaignDraft[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const onTitleChange = (v: string) => {
    setData((d) => ({
      ...d,
      title: v,
      slug: slugTouched ? d.slug : slugify(v),
    }));
  };

  const handleImage = (file: File) => {
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = (e) => set('featuredImageDataUrl', e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addSponsor = () => {
    const v = sponsorInput.trim();
    if (!v) return;
    set('sponsors', [...(data.sponsors ?? []), v]);
    setSponsorInput('');
  };

  const removeSponsor = (idx: number) => {
    set('sponsors', (data.sponsors ?? []).filter((_, i) => i !== idx));
  };

  const addRule = () => set('rules', [...(data.rules ?? []), '']);

  const updateRule = (idx: number, value: string) => {
    const list = [...(data.rules ?? [])];
    list[idx] = value;
    set('rules', list);
  };

  const removeRule = (idx: number) => {
    set('rules', (data.rules ?? []).filter((_, i) => i !== idx));
  };

  const buildPayload = async () => {
    let featured_image = data.featuredImage || undefined;
    if (imgFile) {
      const up = await adminApi.uploadImage(imgFile, 'campaign');
      featured_image = up.url;
    }
    return {
      title: data.title,
      slug: data.slug || undefined,
      tagline: data.tagline || undefined,
      description: data.description || undefined,
      featured_image,
      category: data.category,
      organizer: data.organizer || undefined,
      location: data.location || undefined,
      start_date: data.startDate,
      end_date: data.endDate,
      vote_price_kes: Number(data.votePriceKes ?? 20),
      status: data.status,
      featured: !!data.featured,
      prize: data.prize || undefined,
      rules: data.rules?.filter(Boolean).length ? data.rules?.filter(Boolean) : undefined,
      sponsors: data.sponsors?.filter(Boolean).length
        ? data.sponsors?.filter(Boolean)
        : undefined,
    };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving('saving');
    try {
      const payload = await buildPayload();
      if (mode === 'create') {
        await adminApi.createCampaign(payload);
        setSaving('saved');
        setTimeout(() => router.push('/admin/campaigns'), 800);
        return;
      }
      await adminApi.updateCampaign(initial?.id!, payload);
      setSaving('saved');
      setTimeout(() => setSaving('idle'), 1500);
    } catch (err) {
      setSaving('idle');
      if (err instanceof ApiError) {
        const first = err.errors ? Object.values(err.errors)[0]?.[0] : null;
        setError(first || err.message);
      } else {
        setError('Could not reach the server. Is the API running?');
      }
    }
  };

  const displayImage = data.featuredImageDataUrl || data.featuredImage;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Featured image */}
      <Section
        title="Featured image"
        icon={Upload}
        hint="Shown on the homepage hero and campaign detail banner · 16:9 · JPG/PNG · max 5MB"
      >
        <input
          ref={imgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImage(f);
          }}
        />
        <button
          type="button"
          onClick={() => imgInputRef.current?.click()}
          className="group relative flex aspect-[16/6] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-500/60 hover:bg-brand-500/5 dark:border-white/10 dark:bg-white/[0.02]"
        >
          {displayImage ? (
            <>
              <Image
                src={displayImage}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={displayImage.startsWith('data:')}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition group-hover:opacity-100">
                <span className="text-xs font-semibold text-white">Replace image</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-6 w-6 text-muted" />
              <div className="mt-2 text-xs font-semibold text-strong">Click to upload</div>
              <div className="text-[10px] text-faint">or paste a URL below</div>
            </div>
          )}
        </button>
        <div className="mt-3">
          <Label hint="Alternative to file upload">Image URL</Label>
          <input
            type="url"
            value={data.featuredImage}
            onChange={(e) => set('featuredImage', e.target.value)}
            placeholder="https://images.unsplash.com/…"
            className={inputCls}
          />
        </div>
      </Section>

      {/* Basic info */}
      <Section title="Basic info" icon={Info}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label required>Title</Label>
            <input
              required
              value={data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Best Community Worker 2026"
              className={inputCls}
            />
          </div>

          <div>
            <Label required hint="Auto-generated · edit if needed">
              Slug
            </Label>
            <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs text-muted dark:border-white/10 dark:bg-white/[0.03]">
                /campaigns/
              </span>
              <input
                required
                value={data.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
                placeholder="best-community-worker-2026"
                className="w-full bg-transparent px-3 py-2.5 font-mono text-sm text-strong outline-none placeholder:text-faint"
              />
            </div>
          </div>

          <div>
            <Label required>Category</Label>
            <select
              required
              value={data.category}
              onChange={(e) => set('category', e.target.value as Category)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Label>Tagline</Label>
            <input
              value={data.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              placeholder="One-line hook shown under the title"
              className={inputCls}
              maxLength={140}
            />
            <div className="mt-1 text-right text-[11px] text-faint">
              {(data.tagline ?? '').length}/140
            </div>
          </div>

          <div>
            <Label>Organizer</Label>
            <input
              value={data.organizer}
              onChange={(e) => set('organizer', e.target.value)}
              placeholder="e.g. Ministry of Public Service"
              className={inputCls}
            />
          </div>

          <div>
            <Label>Location</Label>
            <input
              value={data.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Nationwide"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <textarea
              rows={5}
              value={data.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Tell the story of the campaign…"
              className={inputCls + ' resize-y'}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.02]">
              <input
                type="checkbox"
                checked={!!data.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <Star className="h-4 w-4 text-brand-700 dark:text-brand-300" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-strong">Feature on homepage</div>
                <div className="text-xs text-muted">
                  Only one featured campaign at a time. Overrides any other featured campaign.
                </div>
              </div>
            </label>
          </div>
        </div>
      </Section>

      {/* Timing & pricing */}
      <Section title="Timing & pricing" icon={Calendar}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label required>Start date &amp; time</Label>
            <input
              type="datetime-local"
              required
              value={toDateTimeLocal(data.startDate)}
              onChange={(e) =>
                set('startDate', new Date(e.target.value).toISOString())
              }
              className={inputCls}
            />
          </div>
          <div>
            <Label required>End date &amp; time</Label>
            <input
              type="datetime-local"
              required
              value={toDateTimeLocal(data.endDate)}
              onChange={(e) =>
                set('endDate', new Date(e.target.value).toISOString())
              }
              className={inputCls}
            />
          </div>

          <div>
            <Label required hint="KES per vote">
              Vote price
            </Label>
            <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]">
              <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-muted dark:border-white/10 dark:bg-white/[0.03]">
                KES
              </span>
              <input
                required
                type="number"
                min={1}
                value={data.votePriceKes ?? 20}
                onChange={(e) => set('votePriceKes', Number(e.target.value))}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-strong outline-none"
              />
            </div>
          </div>

          <div>
            <Label required>Status</Label>
            <select
              required
              value={data.status}
              onChange={(e) => set('status', e.target.value as Campaign['status'])}
              className={inputCls}
            >
              <option value="upcoming">Upcoming — not yet open</option>
              <option value="live">Live — accepting votes</option>
              <option value="ended">Ended — voting closed</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Prize */}
      <Section title="Prize" icon={Trophy}>
        <div>
          <Label>Grand prize</Label>
          <textarea
            rows={2}
            value={data.prize}
            onChange={(e) => set('prize', e.target.value)}
            placeholder="e.g. KES 500,000 personal grant + KES 500,000 project fund"
            className={inputCls + ' resize-y'}
          />
        </div>
      </Section>

      {/* Rules */}
      <Section title="Rules" icon={ShieldCheck}>
        <div className="space-y-2">
          {(data.rules ?? []).length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-muted dark:border-white/10">
              No rules yet — add clear guidelines for voters and nominees.
            </div>
          )}
          {(data.rules ?? []).map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={r}
                onChange={(e) => updateRule(i, e.target.value)}
                placeholder={`Rule ${i + 1}`}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => removeRule(i)}
                className="rounded-xl border border-slate-200 p-2.5 text-muted hover:border-red-500/40 hover:text-red-500 dark:border-white/10"
                aria-label={`Remove rule ${i + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRule}
            className="btn-ghost !py-1.5 !text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add rule
          </button>
        </div>
      </Section>

      {/* Sponsors */}
      <Section title="Sponsors" icon={Sparkles}>
        <div className="flex items-center gap-2">
          <input
            value={sponsorInput}
            onChange={(e) => setSponsorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSponsor();
              }
            }}
            placeholder="Type a sponsor name and press Enter"
            className={inputCls}
          />
          <button
            type="button"
            onClick={addSponsor}
            className="rounded-xl border border-slate-200 p-2.5 text-muted hover:text-strong dark:border-white/10"
            aria-label="Add sponsor"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {(data.sponsors ?? []).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(data.sponsors ?? []).map((s, i) => (
              <span key={i} className="chip">
                {s}
                <button
                  type="button"
                  onClick={() => removeSponsor(i)}
                  className="ml-1 text-faint hover:text-red-500"
                  aria-label={`Remove ${s}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Section>

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sticky action bar */}
      <div className="sticky bottom-4 z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-ink-900">
          <div className="text-xs text-muted">
            {mode === 'create' ? 'Creating a new campaign.' : 'Editing an existing campaign.'}{' '}
            Nominees can be added after saving.
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-ghost !py-2 !text-xs">
              Save as draft
            </button>
            <button
              type="submit"
              disabled={saving !== 'idle'}
              className="btn-primary !py-2 !text-xs md:!text-sm"
            >
              {saving === 'saving' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : saving === 'saved' ? (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === 'create' ? 'Publish campaign' : 'Save changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
