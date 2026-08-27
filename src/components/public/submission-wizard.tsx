'use client';

import React, { useState } from 'react';

const STEPS = ['What would you like to share?', 'Where are you from?', 'Your details', 'Review & submit'];

const KINDS = [
  { id: 'question', label: 'Question', desc: 'Ask a question to the campaign' },
  { id: 'priority', label: 'Community Priority', desc: 'Raise an issue your community cares about' },
  { id: 'idea', label: 'Development Idea', desc: 'Share an idea for Kano’s development' },
  { id: 'fact', label: 'Fact for Review', desc: 'Flag a claim you would like verified' },
  { id: 'feedback', label: 'Policy Feedback', desc: 'Respond to a policy proposal' },
];

const TOPICS = ['general', 'education', 'water', 'roads', 'healthcare', 'agriculture', 'employment', 'security', 'youth', 'women', 'commerce'];

export function SubmissionWizard({ lgas }: { lgas: { id: string; name: string }[] }) {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState('');
  const [lga, setLga] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string>();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const kindLabel = KINDS.find((k) => k.id === kind)?.label ?? 'Submission';
  const canNext = step === 0 ? !!kind : step === 1 ? message.trim().length >= 10 : step === 2 ? consent : true;

  async function submit() {
    setSending(true);
    setError(undefined);
    try {
      const lgaName = lgas.find((l) => l.id === lga)?.name ?? '';
      const res = await fetch('/api/public/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lga: lgaName, topic, message, name, consent }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) setDone(true);
      else setError(data.error || 'Unable to submit. Please try again.');
    } catch {
      setError('Unable to submit. Please try again.');
    }
    setSending(false);
  }

  if (done) {
    return (
      <div className="glass-card !p-10 text-center" role="status">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(18,183,106,0.12)] text-2xl text-[#027A48]">✓</div>
        <h3 className="mt-5 font-display text-2xl font-extrabold text-[var(--white)]">Ashe, thank you.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-text)]">
          Your submission has been received and is with the community engagement desk. Your
          identity is never displayed publicly — aggregate submissions help shape the public conversation.
        </p>
      </div>
    );
  }

  const inputCls = 'w-full rounded-xl border border-[var(--glass-border)] bg-white px-4 py-3 text-sm text-[var(--white)] outline-none transition focus:border-[var(--brand)]/50 focus:ring-4 focus:ring-[rgba(166,27,27,0.08)]';

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-[var(--glass-border)] bg-white/50 px-6 py-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.68rem] font-bold transition-colors ${
                  i <= step ? 'bg-[var(--brand)] text-white' : 'bg-[rgba(23,32,51,0.06)] text-[var(--muted-text)]'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden className={`hidden h-px w-6 md:block ${i < step ? 'bg-[var(--brand)]' : 'bg-[rgba(23,32,51,0.1)]'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-text)]">{STEPS[step]}</p>
      </div>

      <div className="px-6 py-7 md:px-8">
        {step === 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setKind(k.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  kind === k.id
                    ? 'border-[var(--brand)]/50 bg-[rgba(166,27,27,0.04)] shadow-[0_8px_24px_rgba(166,27,27,0.08)]'
                    : 'border-[var(--glass-border)] bg-white/60 hover:border-[var(--brand)]/25'
                }`}
              >
                <p className="font-display text-sm font-bold text-[var(--white)]">{k.label}</p>
                <p className="mt-1 text-xs text-[var(--muted-text)]">{k.desc}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Your LGA</span>
                <select value={lga} onChange={(e) => setLga(e.target.value)} className={inputCls}>
                  <option value="">Select LGA</option>
                  {lgas.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Topic</span>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls}>
                  {TOPICS.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
                </select>
              </label>
            </div>
            <label>
              <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">
                Message{' '}
                {message.trim().length < 10 && (
                  <span className="normal-case tracking-normal text-[var(--muted-2)]">(at least 10 characters)</span>
                )}
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className={`${inputCls} resize-none`}
                placeholder="Share your thoughts, priorities, or ideas for Kano's development…"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label>
              <span className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted-text)]">Name (optional)</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="We never display your name publicly" />
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--glass-border)] bg-white/60 p-4">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-[var(--brand)]" />
              <span className="text-sm leading-relaxed text-[var(--muted-text)]">
                I consent to my submission being used <strong className="text-[var(--white)]">in aggregate</strong> to understand
                community priorities and improve public dialogue. My identity will not be displayed publicly.
              </span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {[
              ['Type', kindLabel],
              ['LGA', lgas.find((l) => l.id === lga)?.name ?? 'Not specified'],
              ['Topic', topic],
              ['Message', message],
              ['Name', name || 'Anonymous'],
              ['Consent', consent ? 'Granted' : 'Not granted'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 rounded-xl bg-white/60 px-4 py-3">
                <span className="w-24 shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-2)]">{k}</span>
                <span className="whitespace-pre-wrap break-words text-sm text-[var(--white)]">{v}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-[rgba(240,68,56,0.35)] bg-[rgba(240,68,56,0.06)] px-4 py-3 text-sm text-[#B42318]" role="alert">
            {error}
          </p>
        )}

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-sm font-semibold text-[var(--muted-text)] transition-colors hover:text-[var(--white)]"
          >
            ← Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-full bg-[var(--brand)] px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_22px_rgba(166,27,27,0.28)] transition-all hover:-translate-y-px disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={sending || !consent}
              onClick={submit}
              className="rounded-full bg-[linear-gradient(135deg,#B32424,var(--brand) 60%,var(--brand-deep))] px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_10px_26px_rgba(166,27,27,0.32)] transition-all hover:-translate-y-px disabled:opacity-50"
            >
              {sending ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
