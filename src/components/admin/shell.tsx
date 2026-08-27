'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { roleLabel } from '@/lib/auth-admin-client';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: 'Command Center',
    items: [
      { label: 'Overview', href: '/admin/dashboard', icon: '◈' },
      { label: 'Analytics', href: '/admin/analytics', icon: '∿' },
      { label: 'Intelligence', href: '/admin/intelligence', icon: '◉' },
    ],
  },
  {
    group: 'Content',
    items: [
      { label: 'Pages & Sections', href: '/admin/content', icon: '▤' },
      { label: 'News', href: '/admin/content/news', icon: '✎' },
      { label: 'Speeches', href: '/admin/speeches', icon: '❝' },
      { label: 'Events', href: '/admin/events', icon: '▦' },
      { label: 'Timeline', href: '/admin/timeline', icon: '⧗' },
      { label: 'Record', href: '/admin/record', icon: '▣' },
      { label: 'Vision & Policies', href: '/admin/policies', icon: '◎' },
      { label: 'Media Library', href: '/admin/media', icon: '❐' },
    ],
  },
  {
    group: 'Verification',
    items: [
      { label: 'Claims', href: '/admin/facts/claims', icon: '✓' },
      { label: 'Evidence', href: '/admin/facts/evidence', icon: '⚖' },
      { label: 'Sources', href: '/admin/facts/sources', icon: '⌘' },
    ],
  },
  {
    group: 'Engagement',
    items: [
      { label: 'Submissions', href: '/admin/engagement', icon: '✉' },
      { label: 'Priorities', href: '/admin/engagement/priorities', icon: '▲' },
      { label: 'LGAs', href: '/admin/engagement/lgas', icon: '⌖' },
      { label: 'Volunteers', href: '/admin/engagement/volunteers', icon: '☰' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Reports', href: '/admin/reports', icon: '▥' },
      { label: 'Audit Logs', href: '/admin/audit', icon: '⌗' },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Users', href: '/admin/users', icon: '☺' },
      { label: 'Roles', href: '/admin/roles', icon: '⛨' },
      { label: 'SEO', href: '/admin/seo', icon: '⌕' },
      { label: 'Settings', href: '/admin/settings', icon: '⚙' },
    ],
  },
];

const QUICK_CREATE = [
  { label: 'News Article', href: '/admin/content/news/new' },
  { label: 'Speech', href: '/admin/speeches/new' },
  { label: 'Event', href: '/admin/events/new' },
  { label: 'Fact Claim', href: '/admin/facts/claims/new' },
  { label: 'Timeline Entry', href: '/admin/timeline/new' },
  { label: 'Service Record', href: '/admin/record/new' },
  { label: 'Policy Sector', href: '/admin/policies/new' },
  { label: 'Media Upload', href: '/admin/media' },
];

export function Sidebar({ user, mobileOpen, onClose }: { user: { name: string; email: string; role: string }; mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* mobile backdrop */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-[rgba(16,24,40,0.08)] bg-white/60 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* brand */}
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 border-b border-[rgba(16,24,40,0.08)] px-5 py-4" onClick={onClose}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(201,162,75,0.35),rgba(163,22,33,0.25))] font-display text-[0.7rem] font-extrabold text-[#8A6A1F] ring-1 ring-[rgba(201,162,75,0.4)]">
            G27
          </span>
          <span>
            <span className="block font-display text-sm font-extrabold tracking-wide text-white">
              GWARZO <span className="text-[#9C7427]">2027</span>
            </span>
            <span className="block text-[0.58rem] font-bold uppercase tracking-[0.24em] text-[#98A2B3]">Command Center</span>
          </span>
        </Link>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((g) => (
            <div key={g.group} className="mb-4">
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [g.group]: !c[g.group] }))}
                className="mb-1.5 flex w-full items-center justify-between px-2 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[#98A2B3]"
              >
                {g.group}
                <span className="text-[0.6rem]">{collapsed[g.group] ? '▸' : '▾'}</span>
              </button>
              {!collapsed[g.group] && (
                <ul className="space-y-0.5">
                  {g.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.8rem] font-semibold transition-colors ${
                            active
                              ? 'bg-[#C9A24B]/[0.12] text-[#9C7427] ring-1 ring-[#C9A24B]/25'
                              : 'text-[#667085] hover:bg-[rgba(16,24,40,0.04)] hover:text-white'
                          }`}
                        >
                          <span aria-hidden className="w-4 text-center text-[0.75rem] opacity-80">{item.icon}</span>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* user */}
        <div className="border-t border-[rgba(16,24,40,0.08)] px-4 py-3.5">
          <p className="truncate text-[0.78rem] font-bold text-white">{user.name}</p>
          <p className="text-[0.62rem] text-[#667085]">{roleLabel(user.role)}</p>
        </div>
      </aside>
    </>
  );
}

export function TopBar({ user, onMenu }: { user: { name: string; email: string; role: string }; onMenu: () => void }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[rgba(16,24,40,0.08)] bg-white/75 backdrop-blur-xl px-4 py-3 backdrop-blur md:px-6">
      <button type="button" onClick={onMenu} aria-label="Open menu" className="rounded-lg border border-[rgba(16,24,40,0.1)] p-2 text-[#364152] lg:hidden">
        ☰
      </button>

      <div className="hidden items-center gap-2 rounded-lg border border-[rgba(16,24,40,0.08)] bg-[rgba(16,24,40,0.03)] px-3.5 py-2 text-sm text-[#98A2B3] md:flex md:w-72">
        <span aria-hidden>⌕</span>
        <input
          placeholder="Search content, claims, submissions…"
          className="w-full bg-transparent text-[#364152] outline-none placeholder:text-[#98A2B3]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const q = (e.target as HTMLInputElement).value.trim();
              router.push(q ? `/admin/search?q=${encodeURIComponent(q)}` : '/admin/search');
            }
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* quick create */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setCreateOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-3.5 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_6px_18px_rgba(11,107,69,0.35)] transition-all hover:brightness-110"
          >
            + Create
          </button>
          {createOpen && (
            <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-[rgba(16,24,40,0.08)] bg-white/75 p-1.5 shadow-[0_20px_60px_rgba(16,24,40,0.15)]">
              {QUICK_CREATE.map((c) => (
                <Link key={c.href} href={c.href} onClick={() => setCreateOpen(false)} className="block rounded-lg px-3 py-2 text-[0.8rem] font-semibold text-[#364152] hover:bg-[rgba(16,24,40,0.04)] hover:text-white">
                  {c.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* notifications */}
        <div className="relative">
          <button type="button" onClick={() => { setNotifOpen((v) => !v); setCreateOpen(false); }} aria-label="Notifications" className="relative rounded-lg border border-[rgba(16,24,40,0.1)] p-2 text-[#364152] hover:bg-[rgba(16,24,40,0.04)]">
            ◷
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#C0323E] px-1 text-[0.55rem] font-bold text-white">•</span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-[rgba(16,24,40,0.08)] bg-white/75 p-4 shadow-[0_20px_60px_rgba(16,24,40,0.15)]">
              <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#667085]">Notifications</p>
              <p className="text-xs text-[#667085]">Open the dashboard to see the live activity feed and attention queue.</p>
              <button
                type="button"
                onClick={() => startTransition(async () => {
                  const r = await fetch('/api/admin/notifications/read', { method: 'POST' });
                  if (r.status === 401) window.location.href = '/admin/login?reason=expired';
                })}
                className="mt-3 text-xs font-bold text-[#9C7427] hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* visit website */}
        <a href="/" target="_blank" rel="noreferrer" className="hidden rounded-lg border border-[rgba(16,24,40,0.1)] px-3.5 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#364152] hover:bg-[rgba(16,24,40,0.04)] hover:text-white md:block">
          Visit site ↗
        </a>

        {/* user / logout */}
        <div className="flex items-center gap-2 rounded-lg border border-[rgba(16,24,40,0.1)] py-1.5 pl-3 pr-1.5">
          <div className="hidden text-right sm:block">
            <p className="text-[0.72rem] font-bold leading-tight text-white">{user.name}</p>
            <p className="text-[0.58rem] text-[#667085]">{roleLabel(user.role)}</p>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const r = await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = r.status === 401 ? '/admin/login' : '/admin/login';
              })
            }
            className="rounded-md bg-[rgba(16,24,40,0.03)] px-2.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-wide text-[#667085] hover:bg-[rgba(192,50,62,0.1)] hover:text-[#B42318]"
          >
            Exit
          </button>
        </div>
      </div>
    </header>
  );
}
