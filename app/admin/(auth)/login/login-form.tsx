'use client';

import React, { useState, useTransition } from 'react';
import { loginAction } from '@admin/actions/auth';

export function LoginForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAction(undefined, fd);
      if (res && 'error' in res && res.error) setError(res.error);
    });
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(201,162,75,0.4),rgba(163,22,33,0.3))] font-display text-base font-extrabold text-[#E8CE8F] ring-1 ring-[rgba(201,162,75,0.45)]">
            G27
          </div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-white">
            GWARZO <span className="text-[#C9A24B]">2027</span> COMMAND CENTER
          </h1>
          <p className="mt-1.5 text-xs text-[#8A968E]">Authorized campaign personnel only. All activity is logged.</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-white/[0.08] bg-[#12161A] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-4 rounded-lg border border-[#C0323E]/40 bg-[#C0323E]/10 px-3.5 py-2.5 text-sm text-[#E06A75]">{error}</div>
          )}
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#9AA39C]">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder="admin@gwarzo2027.ng"
              className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3.5 py-2.5 text-sm text-[#ECEDEA] placeholder:text-[#5E6A63] outline-none focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20"
            />
          </label>
          <label className="mb-6 block">
            <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#9AA39C]">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3.5 py-2.5 text-sm text-[#ECEDEA] placeholder:text-[#5E6A63] outline-none focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20"
            />
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_26px_rgba(11,107,69,0.4)] transition-all hover:brightness-110 disabled:opacity-60"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="mt-4 text-center text-[0.62rem] text-[#5E6A63]">
            Login attempts are rate-limited. MFA support is staged for rollout.
          </p>
        </form>
      </div>
    </div>
  );
}
