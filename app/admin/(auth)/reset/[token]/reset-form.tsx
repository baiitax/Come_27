'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export function ResetForm({ tokenPromise }: { tokenPromise: Promise<{ token: string }> }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let live = true;
    tokenPromise.then((p) => { if (live) setToken(p.token); });
    return () => { live = false; };
  }, [tokenPromise]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: String(fd.get('password') ?? ''),
          confirm: String(fd.get('confirm') ?? ''),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) setDone(true);
      else setError(data.error || 'Something went wrong. Please try again.');
    } catch {
      setError('Authentication service is temporarily unavailable. Please try again.');
    }
    setLoading(false);
  }

  const inputCls = 'w-full rounded-xl border border-[rgba(16,24,40,0.1)] bg-white px-4 py-3 text-sm text-[#172033] outline-none focus:border-[#0E8A5A]/50 focus:ring-4 focus:ring-[#0E8A5A]/10';

  return (
    <div className="admin-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#0E8A5A]/[0.07] blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-[#C9A24B]/[0.08] blur-3xl" />
      </div>
      <div className="glass relative w-full max-w-[420px] rounded-3xl p-8 shadow-[0_24px_80px_rgba(16,24,40,0.12)] md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(14,138,90,0.16),rgba(201,162,75,0.14))] text-xl ring-1 ring-[rgba(14,138,90,0.25)]">🔒</div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#172033]">Choose a new password</h1>
          <p className="mt-1.5 text-sm text-[#667085]">Minimum 10 characters with a lowercase letter, uppercase letter and number.</p>
        </div>

        {done ? (
          <div className="rounded-xl border border-[rgba(18,183,106,0.35)] bg-[rgba(18,183,106,0.08)] px-4 py-3.5 text-sm text-[#027A48]" role="status">
            Password updated successfully.
            <Link href="/admin/login?reset=success" className="mt-2 block font-bold text-[#0E8A5A] hover:underline">Return to sign in →</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-[rgba(240,68,56,0.35)] bg-[rgba(240,68,56,0.07)] px-4 py-3 text-sm text-[#B42318]" role="alert">{error}</div>
            )}
            <div>
              <label htmlFor="pw" className="mb-1.5 block text-[0.72rem] font-semibold text-[#364152]">New password</label>
              <input id="pw" name="password" type="password" required autoComplete="new-password" className={inputCls} />
            </div>
            <div>
              <label htmlFor="pw2" className="mb-1.5 block text-[0.72rem] font-semibold text-[#364152]">Confirm new password</label>
              <input id="pw2" name="confirm" type="password" required autoComplete="new-password" className={inputCls} />
            </div>
            <button type="submit" disabled={loading || !token}
              className="w-full rounded-xl bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(11,107,69,0.32)] transition-all disabled:opacity-70">
              {loading ? 'Updating…' : 'Update password'}
            </button>
            <Link href="/admin/login" className="block text-center text-[0.72rem] font-semibold text-[#667085] hover:text-[#172033]">← Back to sign in</Link>
          </form>
        )}
      </div>
    </div>
  );
}
