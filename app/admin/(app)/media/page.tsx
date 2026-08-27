import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Badge, EmptyState, DemoTag } from '@/components/admin/ui';
import { MediaUpload } from './media-upload';
import { MediaRow } from './media-row';

export const dynamic = 'force-dynamic';
export async function generateStaticParams() {
  return [];
}

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const [assets, albums] = await Promise.all([
    prisma.mediaAsset.findMany({ where: sp.kind ? { kind: sp.kind } : undefined, orderBy: { createdAt: 'desc' }, take: 200 }),
    prisma.mediaAlbum.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { assets: true } } } }),
  ]);
  const kinds = ['image', 'video', 'audio', 'pdf', 'document'];

  return (
    <div>
      <PageHeader crumb="Content" title="Media Library" sub="Digital asset management — images, video, audio, PDFs and documents. Uploads are type-validated with a 15MB limit." />
      <div className="mb-4 flex flex-wrap gap-2">
        <a href="/admin/media" className={KINDPILL(!sp.kind)}>All</a>
        {kinds.map((k) => (
          <a key={k} href={`/admin/media?kind=${k}`} className={KINDPILL(sp.kind === k)}>{k}</a>
        ))}
      </div>

      <Card className="mb-6">
        <MediaUpload albums={albums.map((a) => ({ id: a.id, name: a.name }))} />
      </Card>

      <Card>
        {assets.length === 0 ? (
          <EmptyState title="No media yet" sub="Upload the first asset — images, video, audio, PDFs or documents." />
        ) : (
          <ul className="divide-y divide-[rgba(16,24,40,0.06)]">
            {assets.map((a) => (
              <MediaRow key={a.id} asset={{ id: a.id, filename: a.filename, path: a.path, kind: a.kind, size: a.size, altText: a.altText, copyright: a.copyright, source: a.source, tags: JSON.parse(a.tagsJson || '[]'), isDemo: a.isDemo, createdAt: a.createdAt.toISOString() }} canManage />
            ))}
          </ul>
        )}
      </Card>

      <Card className="mt-6">
        <CardHead title="Albums" sub="Organize assets by campaign, event or category." />
        {albums.length === 0 ? (
          <p className="px-5 py-4 text-sm text-[#667085]">No albums yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 px-5 py-4 md:grid-cols-4">
            {albums.map((a) => (
              <li key={a.id} className="rounded-lg border border-[rgba(16,24,40,0.08)] bg-[rgba(16,24,40,0.03)] px-4 py-3">
                <p className="text-sm font-bold text-white">{a.name}</p>
                <p className="text-xs text-[#667085]">{a._count.assets} asset(s)</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function KINDPILL(active: boolean) {
  return `rounded-full border px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-wide transition-colors ${
    active ? 'border-[#C9A24B]/50 bg-[#C9A24B]/10 text-[#9C7427]' : 'border-[rgba(16,24,40,0.1)] text-[#667085] hover:bg-[rgba(16,24,40,0.04)]'
  }`;
}
