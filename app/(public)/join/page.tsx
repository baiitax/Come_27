'use client';

import React, { useState } from 'react';
import { SectionHead } from '@/components/public/section-head';

const ROLES = [
  { id: 'volunteer', label: 'Volunteer', icon: '✊', desc: 'Canvass, mobilise and support events in your community.' },
  { id: 'leader', label: 'Community Leader', icon: '⌂', desc: 'Represent your LGA and channel community priorities.' },
  { id: 'fact-checker', label: 'Fact Checker', icon: '✓', desc: 'Help verify claims and sources with documented evidence.' },
  { id: 'media', label: 'Media Contributor', icon: '✦', desc: 'Document events, speeches and campaign activity.' },
  { id: 'events', label: 'Event Support', icon: '▦', desc: 'Logistics, coordination and crowd safety at events.' },
  { id: 'digital', label: 'Digital Support', icon: '◉', desc: 'Run the digital conversation responsibly and factually.' },
];

const LGAS = [
  'Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa',
  'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garum Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo',
  'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir',
  'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa',
  'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil',
];

const STEPS = [
  { n: '01', title: 'Register', desc: 'Choose your role and share how to reach you. It takes under a minute.' },
  { n: '02', title: 'LGA desk', desc: 'Your Local Government coordination desk assigns your first task and points of contact.' },
  { n: '03', title: 'Code of conduct', desc: 'A short onboarding on the campaign’s rules — facts first, no personal attacks, no fees.' },
];

export default function JoinPage() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lga, setLga] = useState('');
  const [error, setError] = useState<string>();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setSending(true);
    try {
      const res = await fetch('/api/public/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, lga }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) setDone(true);
      else setError(data.error || 'Unable to submit. Please try again.');
    } catch {
      setError('Unable to submit. Please try again.');
    }
    setSending(false);
  }

  const inputCls =
    'w-full rounded-xl border border-[var(--glass-border)] bg-white px-4 py-3 text-sm text-[var(--white)] outline-none transition focus:border-[var(--brand)]/50 focus:ring-4 focus:ring-[rgba(166,27,27,0.08)]';
  const labelCls = 'mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]';
  const canSubmit = role && name.trim() && (phone.trim() || email.trim());

  return (
    <div className="pt-32 md:pt-40">
      {/* Header */}
      <section className="relative mx-auto max-w-7xl px-6">
        <div aria-hidden className="tricolor-bar absolute inset-x-0 top-0 h-1 rounded-b" />
        <SectionHead
          eyebrow="Join the movement"
          title={<>Kano&apos;s next chapter <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">starts with you.</span></>}
          sub="The 2027 movement is built one voice at a time. Choose your role and register — the campaign desk will reach out. No fees, ever."
        />
      </section>

      {/* What happens next */}
      <section className="mx-auto mt-12 max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" data-reveal>
          {STEPS.map((s) => (
            <div key={s.n} className="glass-card glass-panel-hover relative !p-5">
              <span aria-hidden className="font-display text-3xl font-extrabold text-[rgba(166,27,27,0.16)]">{s.n}</span>
              <p className="mt-2 font-display text-base font-extrabold text-[var(--white)]">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted-text)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role + form */}
      <section className="mx-auto mt-10 max-w-7xl px-6 pb-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Roles */}
          <div className="lg:col-span-2" data-reveal="left">
            <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">
              Step 1 — Choose your role
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {ROLES.map((r) => {
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    aria-pressed={active}
                    className={`group relative rounded-2xl border p-4 text-left transition-all duration-300 ${
                      active
                        ? 'border-[var(--brand)]/60 bg-[rgba(166,27,27,0.05)] shadow-[0_10px_28px_rgba(166,27,27,0.14)]'
                        : 'border-[var(--glass-border)] bg-white/60 hover:-translate-y-0.5 hover:border-[var(--brand)]/30 hover:shadow-[0_8px_24px_rgba(23,32,51,0.08)]'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border text-base transition-colors ${
                        active
                          ? 'border-[var(--brand)]/40 bg-[rgba(166,27,27,0.1)] text-[var(--brand)]'
                          : 'border-[var(--glass-border)] bg-white text-[var(--muted-2)] group-hover:text-[var(--brand)]'
                      }`}
                    >
                      {r.icon}
                    </span>
                    <p className="mt-2.5 font-display text-sm font-extrabold text-[var(--white)]">{r.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted-text)]">{r.desc}</p>
                    {active && (
                      <span aria-hidden className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-[0.6rem] font-bold text-white">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3" data-reveal="right" data-delay="120">
            {done ? (
              <div className="glass-card relative overflow-hidden !p-10 text-center" role="status">
                <div aria-hidden className="tricolor-bar absolute inset-x-0 top-0 h-1" />
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(18,183,106,0.12)] text-3xl text-[#027A48]">✓</div>
                <h3 className="mt-5 font-display text-2xl font-extrabold text-[var(--white)]">Ashe — thank you for standing with Kano.</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-text)]">
                  Your registration has been received
                  {lga ? <> for <strong className="text-[var(--white)]">{lga}</strong></> : null}. The {ROLES.find((r) => r.id === role)?.label.toLowerCase() ?? 'campaign'}
                  coordination desk will contact you about your first task.
                </p>
                <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
                  {STEPS.slice(1).map((s) => (
                    <div key={s.n} className="rounded-xl border border-[var(--glass-border)] bg-white/70 px-2 py-3">
                      <p className="font-display text-xs font-extrabold text-[var(--brand)]">{s.n}</p>
                      <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[var(--muted-text)]">{s.title}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-7">
                  <a
                    href="/newsroom"
                    className="inline-block rounded-full border border-[var(--glass-border)] bg-white/80 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--white)] transition hover:-translate-y-px hover:border-[var(--brand)]/40"
                  >
                    Follow the Newsroom →
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="glass-card relative overflow-hidden !p-7 md:!p-9">
                <div aria-hidden className="tricolor-bar absolute inset-x-0 top-0 h-1" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Step 2 — Your details</p>
                  <p className="text-[0.6rem] font-semibold text-[var(--muted-2)]">Takes under a minute</p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className={labelCls}>Full name *</span>
                    <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your name" autoComplete="name" />
                  </label>
                  <label>
                    <span className={labelCls}>Phone</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+234 …" autoComplete="tel" inputMode="tel" />
                  </label>
                  <label>
                    <span className={labelCls}>Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" autoComplete="email" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelCls}>Your LGA</span>
                    <select value={lga} onChange={(e) => setLga(e.target.value)} className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%228%22%3E%3Cpath%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%235E7168%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}>
                      <option value="">Select your Local Government Area</option>
                      {LGAS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </label>
                </div>
                {!phone && !email && (
                  <p className="mt-3 rounded-xl border border-[rgba(201,162,75,0.35)] bg-[rgba(201,162,75,0.08)] px-4 py-2.5 text-xs text-[#9C7427]">
                    Provide at least a phone number or an email so the campaign desk can reach you.
                  </p>
                )}
                {error && (
                  <p className="mt-4 rounded-xl border border-[rgba(240,68,56,0.35)] bg-[rgba(240,68,56,0.06)] px-4 py-3 text-sm text-[#B42318]" role="alert">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending || !canSubmit}
                  className="mt-6 w-full rounded-full bg-[linear-gradient(135deg,#B32424,var(--brand) 60%,var(--brand-deep))] px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_26px_rgba(166,27,27,0.32)] transition-all hover:-translate-y-px hover:shadow-[0_14px_34px_rgba(166,27,27,0.42)] disabled:opacity-50"
                >
                  {sending ? 'Registering…' : role ? `Join as ${ROLES.find((r) => r.id === role)?.label} →` : 'Register with the campaign'}
                </button>
                <p className="mt-3 text-center text-[0.62rem] text-[var(--muted-2)]">
                  Free to join. Your details are used only by the campaign desk — never sold or shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
