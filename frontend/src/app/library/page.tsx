import { HomeIcon, HardHat, Users, Flag, Heart, Image as ImageIcon, PlayCircle } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  caption: string;
}

const VIDEOS: Video[] = [
  {
    id: 'vRlWxDldJE4',
    title: 'BOMA BORA — Introduction',
    caption: 'A short introduction to the programme and the dignity we exist to restore.',
  },
  {
    id: 'YWj1nLR5JoA',
    title: 'A beneficiary story',
    caption: 'Hear from one of the elders whose life was transformed through BOMA BORA.',
  },
];

interface Album {
  icon: typeof HomeIcon;
  title: string;
  caption: string;
  tone: 'amber' | 'orange' | 'rose' | 'emerald';
}

const ALBUMS: Album[] = [
  { icon: Flag, title: 'Groundbreakings', caption: 'The moment a new home begins.', tone: 'amber' },
  { icon: HardHat, title: 'Construction', caption: 'Walls go up, hope grows.', tone: 'orange' },
  { icon: HomeIcon, title: 'Handovers', caption: 'Keys in hand. Home at last.', tone: 'rose' },
  { icon: Users, title: 'Beneficiaries', caption: 'The faces behind the stories.', tone: 'amber' },
  { icon: Heart, title: 'Community visits', caption: 'Walking alongside our elders.', tone: 'emerald' },
  { icon: ImageIcon, title: 'Moments', caption: 'Smiles, tears, celebrations.', tone: 'orange' },
];

const toneClasses: Record<Album['tone'], string> = {
  amber: 'from-amber-200 via-amber-100 to-orange-200 dark:from-amber-900/50 dark:via-amber-900/30 dark:to-orange-900/40',
  orange: 'from-orange-200 via-amber-100 to-rose-200 dark:from-orange-900/50 dark:via-amber-900/30 dark:to-rose-900/40',
  rose: 'from-rose-200 via-amber-100 to-amber-200 dark:from-rose-900/50 dark:via-amber-900/30 dark:to-amber-900/40',
  emerald: 'from-emerald-200 via-amber-100 to-amber-200 dark:from-emerald-900/50 dark:via-amber-900/30 dark:to-amber-900/40',
};

export default function LibraryPage() {
  return (
    <div>
      <Hero />
      <VideosSection />
      <AlbumsSection />
    </div>
  );
}

function Hero() {
  return (
    <section className="container-x pt-6">
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm dark:border-amber-500/20 dark:from-ink-900 dark:via-ink-900 dark:to-amber-950/40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div className="relative px-6 py-10 text-center md:px-10 md:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            <ImageIcon className="h-3 w-3" />
            Library
          </span>
          <h1 className="heading-display mx-auto mt-4 max-w-3xl text-4xl leading-tight text-strong md:text-6xl">
            Moments of restored dignity.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:text-base">
            Videos and photographs from the BOMA BORA journey — groundbreakings, handovers, and
            the beneficiaries at the heart of it all.
          </p>
        </div>
      </div>
    </section>
  );
}

function VideosSection() {
  return (
    <section className="container-x mt-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
              Watch
            </div>
            <h2 className="heading-display mt-1 text-2xl text-strong md:text-3xl">
              Featured videos
            </h2>
          </div>
          <PlayCircle className="hidden h-6 w-6 text-amber-500 sm:block" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {VIDEOS.map((v) => (
            <div key={v.id}>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm dark:border-white/10">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${v.id}?rel=0`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="mt-3">
                <div className="text-sm font-semibold text-strong">{v.title}</div>
                <div className="mt-1 text-xs text-muted">{v.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AlbumsSection() {
  return (
    <section className="container-x mt-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
            Photo albums
          </div>
          <h2 className="heading-display mt-1 text-2xl text-strong md:text-3xl">
            From our field work
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            New photographs are added as we complete homes and visit beneficiaries. Albums
            below will fill with real images from each milestone.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALBUMS.map((a) => (
            <article
              key={a.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md dark:border-white/10 dark:bg-ink-900"
            >
              <div
                className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${toneClasses[a.tone]}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_50%)]" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-amber-600 shadow-sm backdrop-blur dark:bg-white/10 dark:text-amber-300">
                  <a.icon className="h-7 w-7" />
                </div>
                <span className="absolute right-3 top-3 rounded-full border border-white/60 bg-white/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-800 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-amber-200">
                  Coming soon
                </span>
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-strong">{a.title}</div>
                <div className="mt-1 text-xs text-muted">{a.caption}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
