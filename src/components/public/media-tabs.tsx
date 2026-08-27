'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type News = { slug: string; title: string; date: string; category: string; summary: string; venue?: string };
type Media = { path: string; alt: string; id: string };

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'news', label: 'News' },
  { id: 'speeches', label: 'Speeches' },
  { id: 'events', label: 'Events' },
  { id: 'photo', label: 'Photo' },
  { id: 'video', label: 'Video' },
  { id: 'documents', label: 'Documents' },
];

export function MediaTabs({ news, speeches, events, photos, videos }: {
  news: News[]; speeches: News[]; events: News[]; photos: Media[]; videos: Media[];
}) {
  const [tab, setTab] = useState('all');
  const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

  const card = (n: News, href: string) => (
    <Link key={href + n.title} href={href} className="group">
      <div className="glass-card glass-panel-hover flex h-full flex-col p-5">
        <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-2)]">
          {n.category.replace('-', ' ')} · {fmt(n.date)}
        </p>
        <p className="mt-2 flex-1 font-display text-sm font-bold leading-snug text-[var(--white)] group-hover:text-[var(--brand)]">{n.title}</p>
        {n.summary && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--muted-text)]">{n.summary}</p>}
        {n.venue && <p className="mt-2 text-[0.65rem] text-[var(--muted-2)]">{n.venue}</p>}
      </div>
    </Link>
  );

  const photo = (m: Media, key: string) => (
    <Link key={key} href="/media" className="group">
      <div className="photo-frame aspect-[4/3]">
        <Image src={m.path} alt={m.alt} width={800} height={600} loading="lazy" className="h-full w-full object-cover" />
      </div>
    </Link>
  );

  const showNews = tab === 'all' || tab === 'news';
  const showSpeeches = tab === 'all' || tab === 'speeches';
  const showEvents = tab === 'all' || tab === 'events';
  const showPhoto = tab === 'all' || tab === 'photo';
  const showVideo = tab === 'all' || tab === 'video';

  return (
    <div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Media categories">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] transition-all ${
              tab === t.id
                ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                : 'border-[var(--glass-border)] bg-white/70 text-[var(--muted-text)] hover:text-[var(--white)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showPhoto && photos.map((m) => photo(m, 'p' + m.id))}
        {showNews && news.map((n) => card(n, `/news/${n.slug}`))}
        {showSpeeches && speeches.map((s) => card(s, `/media/speeches/${s.slug}`))}
        {showEvents && events.map((e) => card(e, `/media/events/${e.slug}`))}
        {showVideo && videos.map((m) => photo(m, 'v' + m.id))}
        {tab === 'documents' && (
          <div className="glass-card col-span-full !p-10 text-center">
            <p className="font-display text-base font-bold text-[var(--white)]">Documents are being digitised.</p>
            <p className="mt-2 text-sm text-[var(--muted-text)]">Official documents will be published with sources and verification status.</p>
          </div>
        )}
        {tab === 'all' && !news.length && !speeches.length && !events.length && !photos.length && (
          <div className="glass-card col-span-full !p-10 text-center">
            <p className="font-display text-base font-bold text-[var(--white)]">Media is being prepared.</p>
          </div>
        )}
      </div>
    </div>
  );
}
