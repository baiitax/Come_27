'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface InboxMessage {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  status: string;
  response: string;
  respondedBy: string;
  respondedAt: Date | string | null;
  sessionId: string | null;
  createdAt: Date | string;
}

const TONE: Record<string, string> = {
  new: 'text-[#B42318] bg-[rgba(240,68,56,0.08)] border-[rgba(240,68,56,0.3)]',
  opened: 'text-[#B54708] bg-[rgba(247,144,9,0.08)] border-[rgba(247,144,9,0.3)]',
  responded: 'text-[#1D4ED8] bg-[rgba(46,144,250,0.08)] border-[rgba(46,144,250,0.3)]',
  resolved: 'text-[#027A48] bg-[rgba(18,183,106,0.08)] border-[rgba(18,183,106,0.3)]',
};

export function ChatInboxItem({ msg }: { msg: InboxMessage }) {
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  async function act(payload: { response?: string; status?: string }) {
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch(`/api/admin/chat/${msg.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Action failed.');
      router.refresh();
      setReply('');
      setExpanded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed.');
    }
    setBusy(false);
  }

  const when = new Date(msg.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <li className="rounded-2xl border border-[rgba(16,24,40,0.07)] bg-white/80 transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-start gap-4 px-5 py-4 text-left"
      >
        <span className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide ${TONE[msg.status] ?? TONE.new}`}>
          {msg.status}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-sm font-bold text-[#172033]">{msg.name || 'Anonymous visitor'}</span>
            <span className="text-[0.65rem] font-semibold text-[#98A2B3]">{when}</span>
          </span>
          <span className="mt-1 block truncate text-sm text-[#475467]">{msg.message}</span>
          {(msg.phone || msg.email) && (
            <span className="mt-1 block text-[0.65rem] font-semibold text-[#98A2B3]">
              {[msg.phone, msg.email].filter(Boolean).join(' · ')}
            </span>
          )}
        </span>
        <span aria-hidden className={`mt-1 text-[#98A2B3] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {expanded && (
        <div className="border-t border-[rgba(16,24,40,0.06)] px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#344054]">{msg.message}</p>

          {msg.response && (
            <div className="mt-4 rounded-xl border border-[rgba(46,144,250,0.2)] bg-[rgba(46,144,250,0.04)] px-4 py-3">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#1D4ED8]">
                Response · {msg.respondedBy}
                {msg.respondedAt && ` · ${new Date(msg.respondedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[#344054]">{msg.response}</p>
            </div>
          )}

          {msg.status !== 'resolved' && (
            <div className="mt-4">
              <label className="block">
                <span className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#667085]">Reply to visitor</span>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  placeholder="Type the campaign response…"
                  className="w-full rounded-xl border border-[rgba(16,24,40,0.1)] bg-white px-3.5 py-2.5 text-sm text-[#172033] outline-none transition focus:border-[#2E90FA] focus:ring-4 focus:ring-[rgba(46,144,250,0.1)]"
                />
              </label>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={busy || !reply.trim()}
                  onClick={() => act({ response: reply })}
                  className="rounded-full bg-[#172033] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:-translate-y-px disabled:opacity-40"
                >
                  {busy ? 'Saving…' : 'Send response'}
                </button>
                {msg.status === 'new' && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act({ status: 'opened' })}
                    className="rounded-full border border-[rgba(16,24,40,0.15)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#344054] transition hover:-translate-y-px disabled:opacity-40"
                  >
                    Mark opened
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => act({ status: 'resolved' })}
                  className="rounded-full border border-[rgba(18,183,106,0.35)] bg-[rgba(18,183,106,0.06)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#027A48] transition hover:-translate-y-px disabled:opacity-40"
                >
                  Mark resolved
                </button>
              </div>
              {error && <p className="mt-2 text-xs font-semibold text-[#B42318]">{error}</p>}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
