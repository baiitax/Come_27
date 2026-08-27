'use client';

import React, { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { FormError } from './ui';

type Action = (state: unknown, formData: FormData) => Promise<unknown> | unknown;

/**
 * Generic admin form. The server action redirects on success,
 * so only error handling is needed here.
 */
export function AdminForm({
  action,
  initial,
  children,
  saveLabel = 'Save',
}: {
  action: Action;
  initial?: { error?: string };
  children: React.ReactNode;
  saveLabel?: string;
}) {
  const [state, formAction] = useActionState(action, initial ?? {});
  const router = useRouter();
  return (
    <form action={formAction} className="space-y-6">
      <FormError error={(state as { error?: string })?.error} />
      {children}
      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-white/[0.1] px-4 py-2.5 text-sm font-semibold text-[#C8CFC9] hover:bg-white/[0.05]">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(11,107,69,0.35)] hover:brightness-110">
          {saveLabel}
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
      className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3.5 py-2.5 text-sm text-[#ECEDEA] placeholder:text-[#5E6A63] outline-none focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20"
    />
  );
}

export function Ta({ name, value = '', ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string }) {
  return (
    <textarea
      name={name}
      defaultValue={value}
      {...rest}
      className="w-full min-h-[110px] rounded-lg border border-white/[0.09] bg-[#0D1114] px-3.5 py-2.5 text-sm leading-relaxed text-[#ECEDEA] placeholder:text-[#5E6A63] outline-none focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20"
    />
  );
}

export function Sel({ name, value, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { name: string }) {
  return (
    <select
      name={name}
      defaultValue={value}
      {...rest}
      className="w-full rounded-lg border border-white/[0.09] bg-[#0D1114] px-3.5 py-2.5 text-sm text-[#ECEDEA] outline-none focus:border-[#C9A24B]/60 focus:ring-2 focus:ring-[#C9A24B]/20"
    >
      {children}
    </select>
  );
}

export function Chk({ name, checked, label }: { name: string; checked?: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#C8CFC9]">
      <input type="checkbox" name={name} defaultChecked={checked} className="h-4 w-4 rounded border-white/20 bg-[#0D1114] accent-[#0E8A5A]" />
      {label}
    </label>
  );
}
