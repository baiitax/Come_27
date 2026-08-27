'use client';

import React, { useState, useRef } from 'react';

const BOOLEAN_FIELDS = new Set(['published', 'featured', 'enabled', 'consent', 'remember']);

type Result = { ok?: boolean; id?: string; error?: string; [k: string]: unknown };

async function postJson(endpoint: string, payload: Record<string, unknown>): Promise<Result> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as Result;
  if (res.status === 401) {
    window.location.href = '/admin/login?reason=expired';
    throw new Error('expired');
  }
  if (!res.ok) return { error: data.error || 'Unable to save changes. Please try again.' };
  return data;
}

/**
 * Generic admin form. Submits the form's fields as JSON to the given API
 * endpoint, shows inline errors, and redirects to `successUrl` on success.
 */
export function AdminForm({
  endpoint,
  successUrl,
  saveLabel = 'Save',
  children,
}: {
  endpoint: string;
  successUrl: string;
  saveLabel?: string;
  children: React.ReactNode;
}) {
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(undefined);
    setSaving(true);
    const payload: Record<string, unknown> = {};
    const fd = new FormData(form);
    for (const [key, value] of fd.entries()) {
      if (value instanceof File) continue;
      payload[key] = BOOLEAN_FIELDS.has(key) ? value === 'true' || value === 'on' : value;
    }
    try {
      const res = await postJson(endpoint, payload);
      if (res.error) {
        setError(res.error);
      } else {
        setDone(true);
        setTimeout(() => {
          window.location.href = successUrl;
        }, 350);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'expired') return;
      setError('Unable to save changes. Try again.');
    }
    setSaving(false);
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-[rgba(240,68,56,0.35)] bg-[rgba(240,68,56,0.07)] px-4 py-3 text-sm text-[#B42318]" role="alert">
          {error}
        </div>
      )}
      {done && (
        <div className="rounded-xl border border-[rgba(18,183,106,0.35)] bg-[rgba(18,183,106,0.08)] px-4 py-3 text-sm text-[#027A48]" role="status">
          Saved — returning…
        </div>
      )}
      {children}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? window.history.back() : (window.location.href = successUrl))}
          className="rounded-lg border border-[rgba(16,24,40,0.12)] px-4 py-2.5 text-sm font-semibold text-[#364152] transition hover:bg-[rgba(16,24,40,0.03)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || done}
          className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(11,107,69,0.3)] transition hover:brightness-110 disabled:opacity-70"
        >
          {saving ? 'Saving…' : saveLabel}
        </button>
      </div>
    </form>
  );
}

export function In({ name, value = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { name: string }) {
  return (
    <input
      name={name}
      defaultValue={value}
      {...rest}
      className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3.5 py-2.5 text-sm text-[#172033] placeholder:text-[#98A2B3] outline-none focus:border-[#0E8A5A]/50 focus:ring-4 focus:ring-[#0E8A5A]/10"
    />
  );
}

export function Ta({ name, value = '', ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string }) {
  return (
    <textarea
      name={name}
      defaultValue={value}
      {...rest}
      className="w-full min-h-[110px] rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[#172033] placeholder:text-[#98A2B3] outline-none focus:border-[#0E8A5A]/50 focus:ring-4 focus:ring-[#0E8A5A]/10"
    />
  );
}

export function Sel({ name, value, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { name: string }) {
  return (
    <select
      name={name}
      defaultValue={value}
      {...rest}
      className="w-full rounded-lg border border-[rgba(16,24,40,0.1)] bg-white px-3.5 py-2.5 text-sm text-[#172033] outline-none focus:border-[#0E8A5A]/50 focus:ring-4 focus:ring-[#0E8A5A]/10"
    >
      {children}
    </select>
  );
}

export function Chk({ name, checked, label }: { name: string; checked?: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#364152]">
      <input type="checkbox" name={name} defaultChecked={checked} className="h-4 w-4 rounded border-[rgba(16,24,40,0.2)] accent-[#0E8A5A]" />
      {label}
    </label>
  );
}
