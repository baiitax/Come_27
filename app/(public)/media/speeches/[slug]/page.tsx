import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ShareBar } from '@/components/public/share-bar';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Speech' };

export default async function SpeechPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await prisma.speech.findUnique({ where: { id: slug } });
  if (!s || s.status !== 'published') notFound();
  const themes = JSON.parse(s.themesJson || '[]') as string[];

  return (
    <div className="pt-32 md:pt-40">
      <article className="mx-auto max-w-3xl px-6 pb-20">
        <Link href="/media" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--brand)] hover:underline">
          ← Media Center
        </Link>
        <div data-reveal className="mt-8">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">
            Speech · {s.eventDate}{s.venue && ` · ${s.venue}${s.location ? `, ${s.location}` : ''}`}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-[var(--white)] md:text-4xl">{s.title}</h1>
          {s.summary && <p className="mt-4 max-w-[720px] text-base leading-relaxed text-[var(--muted-text)]">{s.summary}</p>}
        </div>
        <div className="gold-rule mt-8 w-40" />
        {s.videoUrl && (
          <div data-reveal className="mt-8 overflow-hidden rounded-2xl border border-[var(--glass-border)]">
            <video controls className="aspect-video w-full" src={s.videoUrl} />
          </div>
        )}
        {s.transcript && (
          <section data-reveal className="mt-10">
            <h2 className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[var(--brand)]">Transcript</h2>
            <div className="mt-4 space-y-4">
              {s.transcript.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} className="max-w-[720px] text-base leading-relaxed text-[var(--muted-text)]">{p}</p>
              ))}
            </div>
          </section>
        )}
        {themes.length > 0 && (
          <div data-reveal className="mt-8">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--muted-2)]">Key themes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {themes.map((t) => (
                <span key={t} className="rounded-full border border-[var(--glass-border)] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--muted-text)]">{t}</span>
              ))}
            </div>
          </div>
        )}
        <div data-reveal className="mt-10 border-t border-[var(--glass-border)] pt-8">
          <ShareBar title={s.title} url="" />
        </div>
      </article>
    </div>
  );
}
