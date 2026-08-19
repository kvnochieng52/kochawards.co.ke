'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  X,
  Plus,
  Save,
  Trash2,
  ShieldCheck,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Music2,
  User,
  Building2,
  Sparkles,
  ListTodo,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Campaign, Nominee } from '@/lib/types';
import { adminApi, ApiError } from '@/lib/api';

type NomineeDraft = Partial<Nominee> & {
  photoDataUrl?: string;
  coverDataUrl?: string;
};

interface Props {
  initial?: Partial<Nominee>;
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

export function NomineeForm({ initial, mode }: Props) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [data, setData] = useState<NomineeDraft>({
    campaignId: initial?.campaignId ?? '',
    fullName: initial?.fullName ?? '',
    code: initial?.code ?? '',
    photo: initial?.photo ?? '',
    coverPhoto: initial?.coverPhoto ?? '',
    headline: initial?.headline ?? '',
    bio: initial?.bio ?? '',
    location: initial?.location ?? '',
    category: initial?.category ?? '',
    verified: initial?.verified ?? false,
    role: initial?.role ?? '',
    organization: initial?.organization ?? '',
    yearsOfService: initial?.yearsOfService,
    peopleReached: initial?.peopleReached,
    age: initial?.age,
    languages: initial?.languages ?? [],
    chairperson: initial?.chairperson ?? '',
    memberCount: initial?.memberCount,
    foundedYear: initial?.foundedYear,
    amountMobilizedKes: initial?.amountMobilizedKes,
    registrationNo: initial?.registrationNo ?? '',
    meetingCadence: initial?.meetingCadence ?? '',
    programs: initial?.programs ?? [],
    achievements: initial?.achievements ?? [],
    website: initial?.website ?? '',
    socials: initial?.socials ?? {},
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [langInput, setLangInput] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi
      .listCampaigns()
      .then((cs) => {
        setCampaigns(cs);
        if (!initial?.campaignId && cs.length > 0) {
          setData((d) => ({ ...d, campaignId: cs[0].id }));
        }
      })
      .catch(() => {});
  }, [initial?.campaignId]);

  const set = <K extends keyof NomineeDraft>(k: K, v: NomineeDraft[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const setSocial = (k: keyof NonNullable<Nominee['socials']>, v: string) =>
    setData((d) => ({ ...d, socials: { ...(d.socials ?? {}), [k]: v } }));

  const handlePhoto = (which: 'photo' | 'cover', file: File) => {
    if (which === 'photo') setPhotoFile(file);
    else setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (which === 'photo') set('photoDataUrl', url);
      else set('coverDataUrl', url);
    };
    reader.readAsDataURL(file);
  };

  const addLanguage = () => {
    const v = langInput.trim();
    if (!v) return;
    set('languages', [...(data.languages ?? []), v]);
    setLangInput('');
  };

  const removeItem = (key: 'languages' | 'programs' | 'achievements', idx: number) => {
    const list = (data[key] as string[]) ?? [];
    set(key, list.filter((_, i) => i !== idx) as any);
  };

  const updateItem = (
    key: 'programs' | 'achievements',
    idx: number,
    value: string
  ) => {
    const list = [...((data[key] as string[]) ?? [])];
    list[idx] = value;
    set(key, list as any);
  };

  const addItem = (key: 'programs' | 'achievements') => {
    const list = (data[key] as string[]) ?? [];
    set(key, [...list, ''] as any);
  };

  const buildPayload = async () => {
    let photoUrl = data.photo || undefined;
    let coverUrl = data.coverPhoto || undefined;

    if (photoFile) {
      const up = await adminApi.uploadImage(photoFile, 'photo');
      photoUrl = up.url;
    }
    if (coverFile) {
      const up = await adminApi.uploadImage(coverFile, 'cover');
      coverUrl = up.url;
    }

    // Snake_case + drop preview fields
    const cleanSocials = Object.fromEntries(
      Object.entries(data.socials ?? {}).filter(([, v]) => !!v)
    );

    return {
      campaign_id: Number(data.campaignId),
      code: data.code,
      full_name: data.fullName,
      photo: photoUrl,
      cover_photo: coverUrl,
      headline: data.headline || undefined,
      bio: data.bio || undefined,
      location: data.location || undefined,
      category: data.category || undefined,
      verified: !!data.verified,
      role: data.role || undefined,
      organization: data.organization || undefined,
      years_of_service: data.yearsOfService ?? undefined,
      people_reached: data.peopleReached ?? undefined,
      age: data.age ?? undefined,
      languages: data.languages?.length ? data.languages : undefined,
      chairperson: data.chairperson || undefined,
      member_count: data.memberCount ?? undefined,
      founded_year: data.foundedYear ?? undefined,
      amount_mobilized_kes: data.amountMobilizedKes ?? undefined,
      registration_no: data.registrationNo || undefined,
      meeting_cadence: data.meetingCadence || undefined,
      programs: data.programs?.filter(Boolean).length ? data.programs?.filter(Boolean) : undefined,
      achievements: data.achievements?.filter(Boolean).length
        ? data.achievements?.filter(Boolean)
        : undefined,
      website: data.website || undefined,
      socials: Object.keys(cleanSocials).length ? cleanSocials : undefined,
    };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving('saving');
    try {
      const payload = await buildPayload();
      if (mode === 'create') {
        await adminApi.createNominee(payload);
        setSaving('saved');
        setTimeout(() => router.push('/admin/nominees'), 800);
        return;
      }
      await adminApi.updateNominee(initial?.id!, payload);
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

  const displayPhoto = data.photoDataUrl || data.photo;
  const displayCover = data.coverDataUrl || data.coverPhoto;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Photo card */}
      <Section title="Photo & cover" icon={Upload} hint="Square headshot recommended · 1:1 · JPG/PNG · max 5MB">
        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <div>
            <Label>Headshot</Label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePhoto('photo', f);
              }}
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-500/60 hover:bg-brand-500/5 dark:border-white/10 dark:bg-white/[0.02]"
            >
              {displayPhoto ? (
                <>
                  <Image src={displayPhoto} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition group-hover:opacity-100">
                    <span className="text-xs font-semibold text-white">Replace photo</span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted" />
                  <div className="mt-2 text-xs font-semibold text-strong">Click to upload</div>
                  <div className="text-[10px] text-faint">or drag &amp; drop</div>
                </div>
              )}
            </button>
          </div>
          <div>
            <Label>Cover image (optional)</Label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePhoto('cover', f);
              }}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-500/60 hover:bg-brand-500/5 dark:border-white/10 dark:bg-white/[0.02]"
            >
              {displayCover ? (
                <>
                  <Image src={displayCover} alt="Cover" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition group-hover:opacity-100">
                    <span className="text-xs font-semibold text-white">Replace cover</span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted" />
                  <div className="mt-2 text-xs font-semibold text-strong">
                    Upload a wide cover
                  </div>
                  <div className="text-[10px] text-faint">
                    Shown on the nominee’s profile hero
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </Section>

      {/* Basic info */}
      <Section title="Basic info" icon={User} hint="Displayed everywhere this nominee appears">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label required>Campaign</Label>
            <select
              required
              value={data.campaignId}
              onChange={(e) => set('campaignId', e.target.value)}
              className={inputCls}
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} · {c.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label required>Full name</Label>
            <input
              required
              value={data.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="e.g. Grace Wanjiru Kamau"
              className={inputCls}
            />
          </div>

          <div>
            <Label required hint="Unique · used for SMS voting">Voting code</Label>
            <input
              required
              value={data.code}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              placeholder="e.g. BCW001"
              className={`${inputCls} font-mono uppercase`}
            />
          </div>

          <div>
            <Label>Category / cause</Label>
            <input
              value={data.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="e.g. Maternal Health"
              className={inputCls}
            />
          </div>

          <div>
            <Label>Location</Label>
            <input
              value={data.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Kibera, Nairobi"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Headline</Label>
            <input
              value={data.headline}
              onChange={(e) => set('headline', e.target.value)}
              placeholder="One-line summary shown on cards"
              className={inputCls}
              maxLength={140}
            />
            <div className="mt-1 text-right text-[11px] text-faint">
              {(data.headline ?? '').length}/140
            </div>
          </div>

          <div className="md:col-span-2">
            <Label hint="Supports basic Markdown">Bio</Label>
            <textarea
              rows={5}
              value={data.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Tell the nominee’s story…"
              className={inputCls + ' resize-y'}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.02]">
              <input
                type="checkbox"
                checked={!!data.verified}
                onChange={(e) => set('verified', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <ShieldCheck className="h-4 w-4 text-brand-700 dark:text-brand-300" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-strong">Verified nominee</div>
                <div className="text-xs text-muted">
                  Shows a blue checkmark next to their name across the site.
                </div>
              </div>
            </label>
          </div>
        </div>
      </Section>

      {/* Individual details */}
      <Section
        title="Individual details"
        icon={User}
        hint="Fill these if the nominee is a person"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Role / title</Label>
            <input
              value={data.role}
              onChange={(e) => set('role', e.target.value)}
              placeholder="e.g. Community Health Volunteer"
              className={inputCls}
            />
          </div>
          <div>
            <Label>Affiliated organization</Label>
            <input
              value={data.organization}
              onChange={(e) => set('organization', e.target.value)}
              placeholder="e.g. Amref Health Africa"
              className={inputCls}
            />
          </div>
          <div>
            <Label>Years of service</Label>
            <input
              type="number"
              min={0}
              value={data.yearsOfService ?? ''}
              onChange={(e) =>
                set(
                  'yearsOfService',
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
              className={inputCls}
            />
          </div>
          <div>
            <Label>People reached</Label>
            <input
              type="number"
              min={0}
              value={data.peopleReached ?? ''}
              onChange={(e) =>
                set(
                  'peopleReached',
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
              className={inputCls}
            />
          </div>
          <div>
            <Label>Age</Label>
            <input
              type="number"
              min={0}
              value={data.age ?? ''}
              onChange={(e) =>
                set('age', e.target.value === '' ? undefined : Number(e.target.value))
              }
              className={inputCls}
            />
          </div>
          <div>
            <Label>Languages</Label>
            <div className="flex items-center gap-2">
              <input
                value={langInput}
                onChange={(e) => setLangInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLanguage();
                  }
                }}
                placeholder="Type a language and press Enter"
                className={inputCls}
              />
              <button
                type="button"
                onClick={addLanguage}
                className="rounded-xl border border-slate-200 p-2.5 text-muted hover:text-strong dark:border-white/10"
                aria-label="Add language"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {(data.languages ?? []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(data.languages ?? []).map((l, i) => (
                  <span key={i} className="chip">
                    {l}
                    <button
                      type="button"
                      onClick={() => removeItem('languages', i)}
                      className="ml-1 text-faint hover:text-red-500"
                      aria-label={`Remove ${l}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Organization details */}
      <Section
        title="Organization details"
        icon={Building2}
        hint="Fill these if the nominee is a chama, SACCO, group or organization"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Chairperson</Label>
            <input
              value={data.chairperson}
              onChange={(e) => set('chairperson', e.target.value)}
              placeholder="e.g. Grace Awino"
              className={inputCls}
            />
          </div>
          <div>
            <Label>Member count</Label>
            <input
              type="number"
              min={0}
              value={data.memberCount ?? ''}
              onChange={(e) =>
                set(
                  'memberCount',
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
              className={inputCls}
            />
          </div>
          <div>
            <Label>Founded year</Label>
            <input
              type="number"
              min={1900}
              max={2100}
              value={data.foundedYear ?? ''}
              onChange={(e) =>
                set(
                  'foundedYear',
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
              className={inputCls}
            />
          </div>
          <div>
            <Label hint="KES">Amount mobilized</Label>
            <input
              type="number"
              min={0}
              value={data.amountMobilizedKes ?? ''}
              onChange={(e) =>
                set(
                  'amountMobilizedKes',
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
              placeholder="e.g. 42000000"
              className={inputCls}
            />
          </div>
          <div>
            <Label>Registration No.</Label>
            <input
              value={data.registrationNo}
              onChange={(e) => set('registrationNo', e.target.value)}
              placeholder="e.g. SDO/NRB/CBO/8891"
              className={inputCls}
            />
          </div>
          <div>
            <Label>Meeting cadence</Label>
            <input
              value={data.meetingCadence}
              onChange={(e) => set('meetingCadence', e.target.value)}
              placeholder="e.g. Every 2nd Saturday"
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      {/* Programs & Achievements */}
      <Section title="Programs & achievements" icon={ListTodo}>
        <div className="grid gap-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-strong">Programs</div>
              <button
                type="button"
                onClick={() => addItem('programs')}
                className="btn-ghost !py-1.5 !text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add program
              </button>
            </div>
            <div className="space-y-2">
              {(data.programs ?? []).length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-muted dark:border-white/10">
                  No programs yet — click <b>Add program</b> to list what they run.
                </div>
              )}
              {(data.programs ?? []).map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={p}
                    onChange={(e) => updateItem('programs', i, e.target.value)}
                    placeholder={`Program ${i + 1}`}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem('programs', i)}
                    className="rounded-xl border border-slate-200 p-2.5 text-muted hover:border-red-500/40 hover:text-red-500 dark:border-white/10"
                    aria-label={`Remove program ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-strong">Achievements</div>
              <button
                type="button"
                onClick={() => addItem('achievements')}
                className="btn-ghost !py-1.5 !text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add achievement
              </button>
            </div>
            <div className="space-y-2">
              {(data.achievements ?? []).length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-muted dark:border-white/10">
                  No achievements yet — highlight awards, milestones or press.
                </div>
              )}
              {(data.achievements ?? []).map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={a}
                    onChange={(e) => updateItem('achievements', i, e.target.value)}
                    placeholder={`Achievement ${i + 1}`}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem('achievements', i)}
                    className="rounded-xl border border-slate-200 p-2.5 text-muted hover:border-red-500/40 hover:text-red-500 dark:border-white/10"
                    aria-label={`Remove achievement ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Web & Socials */}
      <Section title="Web & socials" icon={Sparkles}>
        <div className="grid gap-4">
          <div>
            <Label>Website</Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
              <input
                value={data.website}
                onChange={(e) => set('website', e.target.value)}
                placeholder="https://example.co.ke"
                className={`${inputCls} pl-9`}
                type="url"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                { key: 'twitter', label: 'X (Twitter)', icon: Twitter, prefix: '@' },
                { key: 'instagram', label: 'Instagram', icon: Instagram, prefix: '@' },
                { key: 'facebook', label: 'Facebook', icon: Facebook, prefix: '' },
                { key: 'tiktok', label: 'TikTok', icon: Music2, prefix: '@' },
                { key: 'youtube', label: 'YouTube', icon: Youtube, prefix: '@' },
                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, prefix: '' },
              ] as const
            ).map(({ key, label, icon: Icon, prefix }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-brand-500/60 dark:border-white/10 dark:bg-white/[0.03]">
                  <span className="flex items-center gap-1 border-r border-slate-200 bg-slate-50 px-3 text-xs text-muted dark:border-white/10 dark:bg-white/[0.03]">
                    <Icon className="h-3.5 w-3.5" />
                    {prefix}
                  </span>
                  <input
                    value={(data.socials as any)?.[key] ?? ''}
                    onChange={(e) => setSocial(key, e.target.value)}
                    placeholder={label === 'LinkedIn' ? 'company-slug' : 'handle'}
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-strong outline-none placeholder:text-faint"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
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
            {mode === 'create' ? 'Adding a new nominee.' : 'Editing existing nominee.'} Changes
            are saved to Kura and immediately visible on the campaign leaderboard.
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
                  {mode === 'create' ? 'Publish nominee' : 'Save changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
