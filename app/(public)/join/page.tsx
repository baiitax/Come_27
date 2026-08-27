'use client';

import React, { useState } from 'react';
import { SectionHead } from '@/components/public/section-head';

const ROLES = [
  { id: 'volunteer', label: 'Volunteer', desc: 'Canvass, mobilise and support events in your community.' },
  { id: 'leader', label: 'Community Leader', desc: 'Represent your LGA and channel community priorities.' },
  { id: 'fact-checker', label: 'Fact Checker', desc: 'Help verify claims and sources with documented evidence.' },
  { id: 'media', label: 'Media Contributor', desc: 'Document events, speeches and campaign activity.' },
  { id: 'events', label: 'Event Support', desc: 'Logistics, coordination and crowd safety at events.' },
  { id: 'digital', label: 'Digital Support', desc: 'Run the digital conversation responsibly and factually.' },
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

  const inputCls = 'w-full rounded-xl border border-[var(--glass-border)] bg-white px-4 py-3 text-sm text-[var(--white)] outline-none transition focus:border-[var(--brand)]/50 focus:ring-4 focus:ring-[rgba(166,27,27,0.08)]';

  return (
    <div className="pt-32 md:pt-40">
      <section className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Join the movement"
          title={<>Kano&apos;s next chapter <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">starts with you.</span></>}
          sub="The 2027 movement is built one voice at a time. Choose your role and register — the campaign desk will reach out."
        />
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-6 pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2" data-reveal="left">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    role === r.id
                      ? 'border-[var(--brand)]/50 bg-[rgba(166,27,27,0.04)] shadow-[0_8px_24px_rgba(166,27,27,0.1)]'
                      : 'border-[var(--glass-border)] bg-white/60 hover:border-[var(--brand)]/25'
                  }`}
                >
                  <p className="font-display text-sm font-bold text-[var(--white)]">{r.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted-text)]">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3" data-reveal="right" data-delay="120">
            {done ? (
              <div className="glass-card !p-10 text-center" role="status">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(18,183,106,0.12)] text-2xl text-[#027A48]">✓</div>
                <h3 className="mt-5 font-display text-2xl font-extrabold text-[var(--white)]">Ashe — thank you for standing with Kano.</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-text)]">
                  Your registration has been received. A member of the campaign desk will contact
                  you about your chosen role.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="glass-card !p-7 md:!p-9">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Volunteer registration</p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Full name</span>
                    <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your name" />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Phone</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+234 …" />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Your LGA</span>
                    <input value={lga} onChange={(e) => setLga(e.target.value)} className={inputCls} placeholder="e.g. Kano Municipal" />
                  </label>
                </div>
                {!phone && !email && <p className="mt-3 text-xs text-[var(--muted-2)]">Provide at least a phone number or an email so the campaign desk can reach you.</p>}
                {error && (
                  <p className="mt-4 rounded-xl border border-[rgba(240,68,56,0.35)] bg-[rgba(240,68,56,0.06)] px-4 py-3 text-sm text-[#B42318]" role="alert">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending || !role || !name || (!phone && !email)}
                  className="mt-6 w-full rounded-full bg-[linear-gradient(135deg,#B32424,var(--brand) 60%,var(--brand-deep))] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_26px_rgba(166,27,27,0.32)] transition-all hover:-translate-y-px disabled:opacity-50"
                >
                  {sending ? 'Registering…' : 'Register with the campaign'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
