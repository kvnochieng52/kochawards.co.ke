'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Trophy, User, X } from 'lucide-react';
import {
  publicApi,
  type SearchCampaignHit,
  type SearchNomineeHit,
  type SearchResponse,
} from '@/lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Hit =
  | { kind: 'campaign'; item: SearchCampaignHit }
  | { kind: 'nominee'; item: SearchNomineeHit };

const MIN_CHARS = 2;

export function SearchAutocomplete({ open, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hits: Hit[] = useMemo(() => {
    if (!results) return [];
    return [
      ...results.campaigns.map<Hit>((item) => ({ kind: 'campaign', item })),
      ...results.nominees.map<Hit>((item) => ({ kind: 'nominee', item })),
    ];
  }, [results]);

  useEffect(() => {
    if (!open) return;
    // Autofocus on open, reset state
    setQuery('');
    setResults(null);
    setActiveIndex(0);
    setLoading(false);
    const id = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const trimmed = query.trim();
    if (trimmed.length < MIN_CHARS) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await publicApi.search(trimmed, { signal: ctrl.signal, limit: 6 });
        setResults(res);
        setActiveIndex(0);
      } catch (err) {
        if ((err as { name?: string })?.name !== 'AbortError') {
          setResults({ query: trimmed, campaigns: [], nominees: [] });
        }
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const go = (hit: Hit) => {
    const href =
      hit.kind === 'campaign'
        ? `/campaigns/${hit.item.slug}`
        : `/nominees/${hit.item.slug}`;
    onClose();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hits.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + hits.length) % hits.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = hits[activeIndex];
      if (hit) go(hit);
    }
  };

  if (!open) return null;

  const trimmed = query.trim();
  const showEmpty =
    !loading && trimmed.length >= MIN_CHARS && hits.length === 0;
  const showHint = trimmed.length < MIN_CHARS && !loading;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-3 backdrop-blur-sm dark:bg-ink-950/70"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mt-16 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-900 dark:shadow-glow">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-white/10">
          <Search className="h-4 w-4 text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search campaigns or nominees…"
            className="w-full bg-transparent text-base text-strong outline-none placeholder:text-slate-400 dark:placeholder:text-white/30"
            autoComplete="off"
            spellCheck={false}
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-muted hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {showHint && (
            <div className="px-4 py-8 text-center text-sm text-muted">
              Type at least {MIN_CHARS} characters to search.
            </div>
          )}

          {showEmpty && (
            <div className="px-4 py-8 text-center text-sm text-muted">
              No matches for &ldquo;{trimmed}&rdquo;.
            </div>
          )}

          {results && results.campaigns.length > 0 && (
            <Group label="Campaigns">
              {results.campaigns.map((c) => {
                const index = hits.findIndex(
                  (h) => h.kind === 'campaign' && h.item.id === c.id,
                );
                return (
                  <CampaignRow
                    key={`c-${c.id}`}
                    item={c}
                    active={index === activeIndex}
                    onSelect={() => go({ kind: 'campaign', item: c })}
                    onHover={() => setActiveIndex(index)}
                  />
                );
              })}
            </Group>
          )}

          {results && results.nominees.length > 0 && (
            <Group label="Nominees">
              {results.nominees.map((n) => {
                const index = hits.findIndex(
                  (h) => h.kind === 'nominee' && h.item.id === n.id,
                );
                return (
                  <NomineeRow
                    key={`n-${n.id}`}
                    item={n}
                    active={index === activeIndex}
                    onSelect={() => go({ kind: 'nominee', item: n })}
                    onHover={() => setActiveIndex(index)}
                  />
                );
              })}
            </Group>
          )}
        </div>

        <div className="hidden items-center justify-between gap-3 border-t border-slate-200 px-4 py-2 text-[11px] text-faint sm:flex dark:border-white/10">
          <span className="flex items-center gap-3">
            <span>
              <kbd className="mx-0.5 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-semibold text-strong dark:border-white/10 dark:bg-white/5">↑</kbd>
              <kbd className="mx-0.5 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-semibold text-strong dark:border-white/10 dark:bg-white/5">↓</kbd> navigate
            </span>
            <span>
              <kbd className="mx-0.5 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-semibold text-strong dark:border-white/10 dark:bg-white/5">↵</kbd> open
            </span>
            <span>
              <kbd className="mx-0.5 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-semibold text-strong dark:border-white/10 dark:bg-white/5">Esc</kbd> close
            </span>
          </span>
          <span>Powered by Koch Awards</span>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <div className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-widest text-faint">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function CampaignRow({
  item,
  active,
  onSelect,
  onHover,
}: {
  item: SearchCampaignHit;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
        active ? 'bg-brand-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5">
        {item.featuredImage ? (
          <Image
            src={item.featuredImage}
            alt={item.title}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <Trophy className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-semibold text-strong">{item.title}</div>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${
              item.status === 'live'
                ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
                : item.status === 'upcoming'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-500/15 text-slate-600 dark:text-slate-300'
            }`}
          >
            {item.status}
          </span>
        </div>
        {item.tagline && (
          <div className="truncate text-xs text-muted">{item.tagline}</div>
        )}
      </div>
      <div className="hidden shrink-0 items-center gap-1 text-[10px] uppercase tracking-widest text-faint sm:flex">
        <Trophy className="h-3 w-3" /> Campaign
      </div>
    </button>
  );
}

function NomineeRow({
  item,
  active,
  onSelect,
  onHover,
}: {
  item: SearchNomineeHit;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
        active ? 'bg-brand-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
        {item.photo ? (
          <Image
            src={item.photo}
            alt={item.fullName}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-strong">{item.fullName}</div>
        <div className="truncate text-xs text-muted">
          {item.campaign?.title ?? 'Nominee'}
          {item.category ? ` · ${item.category}` : ''}
          {item.location ? ` · ${item.location}` : ''}
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-1 text-[10px] uppercase tracking-widest text-faint sm:flex">
        <User className="h-3 w-3" /> Nominee
      </div>
    </button>
  );
}
