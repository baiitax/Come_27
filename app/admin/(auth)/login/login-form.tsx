'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function LoginForm({ reason, resetDone, next }: { reason?: string; resetDone?: boolean; next?: string }) {
  const [error, setError] = useState<string>();
  const [phase, setPhase] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showPw, setShowPw] = useState(false);
  const nextPath = next && next.startsWith('/admin') ? next : '/admin/dashboard';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setPhase('loading');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(fd.get('email') ?? ''),
          password: String(fd.get('password') ?? ''),
          remember: fd.get('remember') === 'on',
          next: nextPath,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 303 || res.status === 307 || res.redirected) {
        setPhase('success');
        window.location.href = nextPath;
        return;
      }
      if (res.ok && !data.error) {
        setPhase('success');
        window.location.href = nextPath;
        return;
      }
      setError(data.error || 'Something went wrong. Please try again.');
      setPhase('idle');
    } catch {
      setError('Authentication service is temporarily unavailable. Please try again.');
      setPhase('idle');
    }
  }

  const inputCls = 'w-full rounded-xl border border-[rgba(16,24,40,0.1)] bg-white px-4 py-3 text-sm text-[#172033] placeholder:text-[#98A2B3] outline-none transition-shadow focus:border-[#0E8A5A]/50 focus:ring-4 focus:ring-[#0E8A5A]/10';

  return (
    <div className="admin-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#0E8A5A]/[0.07] blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-[#C9A24B]/[0.08] blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-[#A31621]/[0.045] blur-3xl" />
      </div>

      <div className="glass relative w-full max-w-[420px] rounded-3xl p-8 shadow-[0_24px_80px_rgba(16,24,40,0.12)] md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(14,138,90,0.16),rgba(201,162,75,0.14))] font-display text-base font-extrabold text-[#0B6B45] ring-1 ring-[rgba(14,138,90,0.25)]">
            G27
          </div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-[#667085]">Gwarzo 2027 CMS</p>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#172033]">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#667085]">Sign in to your administration workspace</p>
        </div>

        {reason === 'expired' && (
          <div className="mb-5 rounded-xl border border-[rgba(247,144,9,0.35)] bg-[rgba(247,144,9,0.08)] px-4 py-3 text-sm text-[#B54708]" role="alert">
            Your session has expired. Please sign in again.
          </div>
        )}
        {resetDone && (
          <div className="mb-5 rounded-xl border border-[rgba(18,183,106,0.35)] bg-[rgba(18,183,106,0.08)] px-4 py-3 text-sm text-[#027A48]" role="status">
            Password updated successfully. You can now sign in.
          </div>
        )}
        {phase === 'success' && (
          <div className="mb-5 rounded-xl border border-[rgba(18,183,106,0.35)] bg-[rgba(18,183,106,0.08)] px-4 py-3 text-sm text-[#027A48]" role="status">
            Authentication successful — opening workspace…
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-xl border border-[rgba(240,68,56,0.35)] bg-[rgba(240,68,56,0.07)] px-4 py-3 text-sm text-[#B42318]" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <div>
            <label htmlFor="email" className="mb-1.5 block text-[0.72rem] font-semibold text-[#364152]">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="username" placeholder="admin@example.com" className={inputCls} />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-[0.72rem] font-semibold text-[#364152]">
                Password
              </label>
              <Link href="/admin/forgot" className="text-[0.7rem] font-semibold text-[#0E8A5A] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#98A2B3] transition-colors hover:text-[#364152]"
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 pt-1">
            <input type="checkbox" name="remember" className="h-4 w-4 rounded border-[rgba(16,24,40,0.2)] accent-[#0E8A5A]" />
            <span className="text-sm text-[#667085]">Remember this device</span>
          </label>

          <button
            type="submit"
            disabled={phase === 'loading' || phase === 'success'}
            className="relative w-full rounded-xl bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(11,107,69,0.32)] transition-all hover:shadow-[0_14px_34px_rgba(11,107,69,0.42)] disabled:cursor-wait disabled:opacity-70"
          >
            {phase === 'loading' ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing you in…
              </span>
            ) : phase === 'success' ? (
              'Authentication successful'
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[0.68rem] leading-relaxed text-[#98A2B3]">
          Authorized campaign personnel only. All activity is logged.
        </p>
      </div>
    </div>
  );
}
