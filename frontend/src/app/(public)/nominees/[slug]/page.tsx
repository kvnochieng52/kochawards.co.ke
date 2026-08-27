import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Music2,
  Linkedin,
  MapPin,
  Sparkles,
  Users,
  Briefcase,
  Building2,
  Clock,
  Languages,
  Cake,
  Hammer,
  UserRound,
  Calendar,
  Wallet,
  FileBadge,
  Repeat,
} from 'lucide-react';
import { publicApi } from '@/lib/api';
import { formatKes, formatNumber } from '@/lib/utils';
import { NomineeVoteCTA } from '@/components/NomineeVoteCTA';

export const dynamic = 'force-dynamic';

const socialMap = {
  website: { icon: Globe, base: '' },
  twitter: { icon: Twitter, base: 'https://twitter.com/' },
  instagram: { icon: Instagram, base: 'https://instagram.com/' },
  facebook: { icon: Facebook, base: 'https://facebook.com/' },
  youtube: { icon: Youtube, base: 'https://youtube.com/' },
  tiktok: { icon: Music2, base: 'https://tiktok.com/@' },
  linkedin: { icon: Linkedin, base: 'https://linkedin.com/company/' },
};

interface Params {
  params: { slug: string };
}

export default async function NomineePage({ params }: Params) {
  const n = await publicApi.nominee(params.slug).catch(() => null);
  if (!n) return notFound();
  const campaign = (n as any).campaign as { id: string; slug: string; title: string; status: string } | undefined;
  const siblings = campaign
    ? await publicApi.campaignNominees(campaign.slug).catch(() => [])
    : [];
  const others = siblings.filter((x) => x.id !== n.id).slice(0, 3);

  const facts = [
    n.role && { icon: Briefcase, label: 'Role', value: n.role },
    n.chairperson && { icon: UserRound, label: 'Chairperson', value: n.chairperson },
    n.organization && { icon: Building2, label: 'Organization', value: n.organization },
    n.memberCount && {
      icon: Users,
      label: 'Members',
      value: formatNumber(n.memberCount),
    },
    n.foundedYear && {
      icon: Calendar,
      label: 'Founded',
      value: n.foundedYear.toString(),
    },
    n.yearsOfService && {
      icon: Clock,
      label: 'Years serving',
      value: `${n.yearsOfService} yrs`,
    },
    n.peopleReached && {
      icon: Users,
      label: 'People reached',
      value: `${formatNumber(n.peopleReached)}+`,
    },
    n.amountMobilizedKes && {
      icon: Wallet,
      label: 'Mobilized',
      value: formatKes(n.amountMobilizedKes),
    },
    n.registrationNo && {
      icon: FileBadge,
      label: 'Registration',
      value: n.registrationNo,
    },
    n.meetingCadence && { icon: Repeat, label: 'Meets', value: n.meetingCadence },
    n.age && { icon: Cake, label: 'Age', value: `${n.age}` },
    n.languages && n.languages.length > 0 && {
      icon: Languages,
      label: 'Languages',
      value: n.languages.join(' · '),
    },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <div>
      <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        {(n.coverPhoto ?? n.photo) && (
          <Image
            src={n.coverPhoto ?? n.photo!}
            alt={n.fullName}
            fill
            priority
            className="object-cover blur-md scale-110 opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-white dark:to-ink-950" />
      </div>

      <div className="container-x -mt-56 relative">
        {campaign && (
          <Link href={`/campaigns/${campaign.slug}`} className="link-back mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to {campaign.title}
          </Link>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <div className="glass rounded-[36px] p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end">
                <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 ring-4 ring-slate-100 dark:bg-white/5 dark:ring-white/10">
                  {n.photo ? (
                    <Image src={n.photo} alt={n.fullName} fill className="object-contain" />
                  ) : (
                    <span className="heading-display text-3xl text-muted">
                      {n.fullName
                        .split(' ')
                        .map((s) => s[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip-brand uppercase">{n.category}</span>
                    <span className="chip">
                      <MapPin className="h-3 w-3" />
                      {n.location}
                    </span>
                    <span className="chip">Code {n.code}</span>
                  </div>
                  <h1 className="heading-display mt-3 flex items-center gap-2 text-4xl text-strong md:text-5xl">
                    {n.fullName}
                    {n.verified && (
                      <CheckCircle2 className="h-7 w-7 fill-brand-500 text-white dark:text-ink-950" />
                    )}
                  </h1>
                  <p className="mt-2 text-lg text-muted">{n.headline}</p>
                </div>
              </div>

              {facts.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {facts.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.label}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
                      >
                        <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
                          <Icon className="h-4 w-4" />
                          <div className="text-[10px] font-semibold uppercase tracking-widest">
                            {f.label}
                          </div>
                        </div>
                        <div className="mt-1 text-sm font-semibold text-strong">
                          {f.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 space-y-4">
                <h2 className="heading-display text-xl text-strong">About</h2>
                <p className="leading-relaxed text-body">{n.bio}</p>
              </div>

              {n.programs && n.programs.length > 0 && (
                <div className="mt-8">
                  <h2 className="heading-display flex items-center gap-2 text-xl text-strong">
                    <Hammer className="h-5 w-5 text-brand-700 dark:text-brand-300" /> Programs
                    they run
                  </h2>
                  <ul className="mt-3 grid gap-2 md:grid-cols-2">
                    {n.programs.map((p) => (
                      <li
                        key={p}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-body dark:border-white/10 dark:bg-white/[0.03]"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {n.achievements && n.achievements.length > 0 && (
                <div className="mt-8">
                  <h2 className="heading-display flex items-center gap-2 text-xl text-strong">
                    <Sparkles className="h-5 w-5 text-brand-700 dark:text-brand-300" /> Highlights
                  </h2>
                  <ul className="mt-3 grid gap-2 md:grid-cols-2">
                    {n.achievements.map((a) => (
                      <li
                        key={a}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-body dark:border-white/10 dark:bg-white/[0.03]"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8">
                <h2 className="heading-display text-xl text-strong">Connect</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {n.website && (
                    <a
                      href={n.website}
                      target="_blank"
                      className="chip !text-sm hover:!border-slate-300 dark:hover:!border-white/30"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {(Object.keys(n.socials) as Array<keyof typeof n.socials>).map((key) => {
                    const val = n.socials[key];
                    if (!val) return null;
                    const meta = socialMap[key as keyof typeof socialMap];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    const href = meta.base ? `${meta.base}${val.replace('@', '')}` : val;
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="chip !text-sm capitalize hover:!border-slate-300 dark:hover:!border-white/30"
                      >
                        <Icon className="h-4 w-4" />
                        {key}
                      </a>
                    );
                  })}
                  {!n.website && Object.values(n.socials).filter(Boolean).length === 0 && (
                    <span className="text-sm text-muted">
                      This group hasn’t added their contact channels yet.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {others.length > 0 && (
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-faint">
                      Same campaign
                    </div>
                    <h2 className="heading-display mt-1 text-2xl text-strong">
                      Other nominees
                    </h2>
                  </div>
                  {campaign && (
                    <Link
                      href={`/campaigns/${campaign.slug}`}
                      className="text-sm text-brand-700 hover:underline dark:text-brand-300"
                    >
                      See all →
                    </Link>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {others.map((o) => (
                    <Link
                      key={o.id}
                      href={`/nominees/${o.slug ?? o.id}`}
                      className="card group p-4 transition hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/20"
                    >
                      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
                        {o.photo ? (
                          <Image
                            src={o.photo}
                            alt={o.fullName}
                            fill
                            className="object-contain transition group-hover:scale-[1.03]"
                          />
                        ) : (
                          <span className="heading-display text-xl text-muted">
                            {o.fullName
                              .split(' ')
                              .map((s) => s[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-1 truncate font-semibold text-strong">
                        {o.fullName}
                        {o.verified && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 fill-brand-500 text-white dark:text-ink-950" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted">
                        <span className="truncate">{o.category}</span>
                        <span className="tabular-nums text-strong">
                          {formatNumber(o.votes)} votes
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <NomineeVoteCTA nominee={n} />
          </div>
        </div>
      </div>
    </div>
  );
}
