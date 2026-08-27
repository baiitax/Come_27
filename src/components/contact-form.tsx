'use client';

import React, { useState } from 'react';

interface Lga {
  id: string;
  name: string;
}

export function ContactForm({ lgas }: { lgas: Lga[] }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(20,35,28,0.1)',
    color: '#14231C',
  };
  const label = 'text-sm text-[var(--muted-text)] uppercase tracking-wider mb-2';
  const field = 'w-full rounded-xl p-3 mb-4 outline-none focus:border-[var(--primary-green)] transition-colors';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/public/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        lga: String(fd.get('lga') ?? ''),
        topic: String(fd.get('topic') ?? 'general'),
        message: String(fd.get('message') ?? ''),
        name: String(fd.get('name') ?? ''),
        consent: !!fd.get('consent'),
      }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) setDone(true);
      else setError(data.error || 'Unable to submit. Please try again.');
    } catch {
      setError('Unable to submit. Please try again.');
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[rgba(0,121,91,0.35)] bg-[rgba(0,121,91,0.08)] p-6 text-center">
        <p className="font-display text-lg font-bold text-[var(--primary-green)]">Ashe, thank you.</p>
        <p className="mt-2 text-sm text-[var(--muted-text)]">
          Your submission has been received and is with the community engagement desk. Priority
          statistics are only published once sufficient submissions are collected.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-[rgba(163,22,33,0.35)] bg-[rgba(163,22,33,0.08)] px-4 py-3 text-sm text-[var(--kwankwasiya)]" role="alert">{error}</div>
      )}

      <div>
        <label htmlFor="cf-name" className={label}>Name (optional)</label>
        <input id="cf-name" name="name" type="text" placeholder="Your name" className={field} style={inputStyle} />
      </div>

      <div>
        <label htmlFor="cf-lga" className={label}>LGA</label>
        <select id="cf-lga" name="lga" className={field} style={inputStyle} defaultValue="">
          <option value="">Select LGA</option>
          {lgas.map((l) => (
            <option key={l.id} value={l.name}>{l.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-topic" className={label}>Topic</label>
        <select id="cf-topic" name="topic" className={field} style={inputStyle} defaultValue="general">
          {['general', 'education', 'water', 'roads', 'healthcare', 'agriculture', 'employment', 'security', 'youth', 'women', 'commerce'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className={label}>Message</label>
        <textarea
          id="cf-message"
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="Share your thoughts, priorities, or ideas for Kano&apos;s development..."
          className={`${field} resize-none`}
          style={inputStyle}
        />
      </div>

      <label className="flex items-start gap-2.5">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 rounded accent-[var(--primary-green)]" />
        <span className="text-sm text-[var(--muted-text)]">
          I consent to my submission being used in aggregate to improve public dialogue. My identity is never published.
        </span>
      </label>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
        {loading ? 'Sending…' : (<>SUBMIT <span aria-hidden>→</span></>)}
      </button>
    </form>
  );
}
