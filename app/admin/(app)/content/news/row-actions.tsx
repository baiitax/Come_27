'use client';

import { useTransition } from 'react';
import { setArticleStatus, deleteArticle, restoreArticle } from '@admin/actions/content';

export function NewsRowActions({ article }: { article: { id: string; status: string; deletedAt: boolean; canPublish: boolean } }) {
  const [pending, start] = useTransition();
  const run = (fn: () => void) => start(() => fn());
  const btn = 'rounded-md border border-white/[0.1] px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-[#9AA39C] hover:bg-white/[0.06] hover:text-white disabled:opacity-40';

  if (article.deletedAt) {
    return (
      <button type="button" disabled={pending} onClick={() => run(() => restoreArticle(article.id))} className={btn}>
        Restore
      </button>
    );
  }

  return (
    <span className="flex items-center justify-end gap-1.5">
      <a href={`/admin/content/news/${article.id}`} className={btn}>
        Edit
      </a>
      {article.status !== 'published' && article.canPublish && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => setArticleStatus(article.id, 'published'))}
          className={`${btn} border-[#0E8A5A]/40 text-[#4CC39A] hover:bg-[#0E8A5A]/15`}
        >
          Publish
        </button>
      )}
      {article.status === 'published' && article.canPublish && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => setArticleStatus(article.id, 'draft'))}
          className={btn}
        >
          Unpublish
        </button>
      )}
      {article.status === 'draft' && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => setArticleStatus(article.id, 'review'))}
          className={btn}
        >
          To review
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => deleteArticle(article.id))}
        className={`${btn} hover:bg-[#C0323E]/15 hover:text-[#E06A75]`}
      >
        Delete
      </button>
    </span>
  );
}
