'use client';

import { useTransition } from 'react';
import Link from 'next/link';

const btn = 'rounded-md border border-[rgba(16,24,40,0.1)] px-2 py-1 text-[0.62rem] font-bold uppercase text-[#667085] transition hover:bg-[rgba(16,24,40,0.04)] hover:text-[#172033] disabled:opacity-40';

export function NewsRowActions({ article }: { article: { id: string; status: string; deletedAt: boolean; canPublish: boolean } }) {
  const [pending, start] = useTransition();

  const post = (url: string, body?: Record<string, unknown>) =>
    start(async () => {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (r.status === 401) window.location.href = '/admin/login?reason=expired';
    });

  if (article.deletedAt) {
    return <button type="button" disabled={pending} onClick={() => post(`/api/admin/articles/${article.id}/restore`)} className={btn}>Restore</button>;
  }
  return (
    <span className="flex items-center justify-end gap-1.5">
      <Link href={`/admin/content/news/${article.id}`} className={btn}>Edit</Link>
      {article.status !== 'published' && article.canPublish && (
        <button type="button" disabled={pending} onClick={() => post(`/api/admin/articles/${article.id}/status`, { status: 'published' })} className={`${btn} hover:text-[#027A48]`}>
          Publish
        </button>
      )}
      {article.status === 'published' && article.canPublish && (
        <button type="button" disabled={pending} onClick={() => post(`/api/admin/articles/${article.id}/status`, { status: 'draft' })} className={btn}>
          Unpublish
        </button>
      )}
      {article.status === 'draft' && (
        <button type="button" disabled={pending} onClick={() => post(`/api/admin/articles/${article.id}/status`, { status: 'review' })} className={btn}>
          To review
        </button>
      )}
      <button type="button" disabled={pending} onClick={() => post(`/api/admin/articles/${article.id}/delete`)} className={`${btn} hover:text-[#B42318]`}>
        Delete
      </button>
    </span>
  );
}
