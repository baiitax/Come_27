'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ThreadItem {
  id: string;
  message: string;
  response: string;
  respondedBy: string;
  respondedAt: string | null;
  status: string;
  createdAt: string;
}

function getSessionId(): string {
  try {
    let id = window.localStorage.getItem('gwarzo_chat_session');
    if (!id) {
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem('gwarzo_chat_session', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

const fmtTime = (d: Date | string) =>
  new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/**
 * Live chat — fixed floating icon on every public page.
 * Visitors write to the campaign desk; the team replies from
 * /admin/engagement/chat (Chat Inbox). Follow-ups from the same browser
 * stay in one thread (localStorage session id).
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ThreadItem[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();
  const [seen, setSeen] = useState(false);
  const sessionIdRef = useRef('');
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!sessionIdRef.current) sessionIdRef.current = getSessionId();
    try {
      const res = await fetch(`/api/chat?sessionId=${encodeURIComponent(sessionIdRef.current)}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { items: ThreadItem[] };
      setItems((prev) => {
        if (data.items.length > prev.length) setSeen(true);
        return data.items.length ? data.items : prev;
      });
    } catch {
      /* widget must never break the page */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void load();
    const t = setInterval(() => void load(), 15000); // poll for replies
    return () => clearInterval(t);
  }, [open, load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setError(undefined);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, name: name.trim(), sessionId: sessionIdRef.current || getSessionId() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || 'Unable to send.');
      setText('');
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send. Please try again.');
    }
    setSending(false);
  }

  const hasReplies = items.some((i) => i.response);

  return (
    <>
      {/* Floating button — sits above the mobile Join bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Chat with the campaign'}
        aria-expanded={open}
        className="fixed right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#B32424,var(--brand) 60%,var(--brand-deep))] text-white shadow-[0_14px_34px_rgba(166,27,27,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_18px_40px_rgba(166,27,27,0.5)] bottom-[5.25rem] lg:bottom-6 lg:right-6"
      >
        {open ? (
          <span aria-hidden className="relative block h-3.5 w-5">
            <span className="absolute left-0 top-1.5 h-0.5 w-full rotate-45 rounded bg-white" />
            <span className="absolute left-0 top-1.5 h-0.5 w-full -rotate-45 rounded bg-white" />
          </span>
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
        {!open && !seen && (
          <span aria-hidden className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[0.55rem] font-extrabold text-[#172033] ring-2 ring-white">1</span>
        )}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Campaign chat"
        aria-hidden={!open}
        className={`fixed right-3 z-[69] flex w-[min(94vw,22.5rem)] flex-col overflow-hidden rounded-3xl border border-[rgba(23,32,51,0.08)] bg-white/95 shadow-[0_30px_80px_rgba(23,32,51,0.25)] backdrop-blur-xl transition-all duration-300 lg:right-6 ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        style={{ bottom: '8.25rem', height: 'min(70vh, 30rem)' }}
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-[rgba(23,32,51,0.06)] bg-[linear-gradient(135deg,rgba(166,27,27,0.06),rgba(198,146,50,0.06))] px-5 py-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#B32424,var(--brand-deep))] font-display text-sm font-extrabold text-white">
            G27
            <span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#12B76A] ring-2 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-extrabold tracking-tight text-[var(--white)]">Campaign Chat</p>
            <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
              Gwarzo 2027 Council · replies within 24h
            </p>
          </div>
        </div>

        {/* thread */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <div className="mx-auto w-fit rounded-full border border-[rgba(23,32,51,0.08)] bg-white px-3 py-1 text-center text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted-2)]">
            {hasReplies ? 'Conversation with the campaign desk' : 'Ask about volunteering, events or the campaign'}
          </div>

          {items.map((it) => (
            <React.Fragment key={it.id}>
              <div className="flex justify-end">
                <div className="max-w-[82%] rounded-2xl rounded-br-md bg-[linear-gradient(135deg,#B32424,var(--brand-deep))] px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                  {it.message}
                  <p className="mt-1 text-right text-[0.55rem] font-semibold opacity-75">{fmtTime(it.createdAt)}</p>
                </div>
              </div>
              {it.response && (
                <div className="flex justify-start">
                  <div className="max-w-[82%] rounded-2xl rounded-bl-md border border-[rgba(23,32,51,0.08)] bg-[rgba(23,32,51,0.04)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--white)] shadow-sm">
                    {it.response}
                    <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-[var(--gold-ink)]">
                      Campaign Council{it.respondedAt ? ` · ${fmtTime(it.respondedAt)}` : ''}
                    </p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          {items.length === 0 && (
            <p className="px-4 py-6 text-center text-xs leading-relaxed text-[var(--muted-text)]">
              The campaign desk reads every message. Write below and we&apos;ll reply right here —
              no account needed.
            </p>
          )}
          <div ref={endRef} />
        </div>

        {/* composer */}
        <form onSubmit={send} className="border-t border-[rgba(23,32,51,0.06)] bg-white/80 p-3">
          {items.length === 0 && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              aria-label="Your name (optional)"
              className="mb-2 w-full rounded-xl border border-[var(--glass-border)] bg-white px-3 py-2 text-xs text-[var(--white)] outline-none transition focus:border-[var(--brand)]/50"
            />
          )}
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 2000))}
              rows={2}
              placeholder="Write a message…"
              aria-label="Message"
              className="max-h-28 flex-1 resize-none rounded-xl border border-[var(--glass-border)] bg-white px-3 py-2.5 text-sm text-[var(--white)] outline-none transition focus:border-[var(--brand)]/50 focus:ring-4 focus:ring-[rgba(166,27,27,0.08)]"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#B32424,var(--brand) 60%,var(--brand-deep))] text-white shadow-[0_8px_20px_rgba(166,27,27,0.3)] transition-all hover:-translate-y-px disabled:opacity-40"
            >
              {sending ? (
                <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-xs font-semibold text-[#B42318]">{error}</p>}
        </form>
      </div>
    </>
  );
}
