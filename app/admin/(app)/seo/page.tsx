import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Table, Th, Td, Badge, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';

export const dynamic = 'force-dynamic';

export default async function SeoPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'seo.manage');
  const articles = await prisma.article.findMany({ where: { deletedAt: null, status: 'published' }, orderBy: { publishedAt: 'desc' }, take: 50 });
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: ['site.title', 'site.description'] } } });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div>
      <PageHeader crumb="System" title="SEO" sub="Per-page SEO scores with actionable gaps. Site-level metadata lives in Settings." />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-2">
        <Card className="p-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#8A968E]">Site title</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{map['site.title'] ?? '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#8A968E]">Site description</p>
          <p className="mt-1 truncate text-sm text-[#C8CFC9]">{map['site.description'] ?? '—'}</p>
        </Card>
      </div>
      <Card>
        <CardHead title="Page SEO Scores" sub="Score = title + description + length heuristics. Fix gaps in the article editor." />
        {articles.length === 0 ? <EmptyState title="No published pages" /> : (
          <Table head={<><Th>Page</Th><Th>Title</Th><Th>Description</Th><Th>Score</Th><Th>Status</Th></>}>
            {articles.map((a) => {
              const score = (a.seoTitle ? 50 : 0) + (a.seoDescription ? 30 : 0) + (a.body.length > 300 ? 20 : 0);
              return (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <Td className="text-xs">{`/news/${a.slug}`}</Td>
                  <Td className="max-w-[240px]"><p className="truncate font-semibold text-white">{a.title}</p><p className="truncate text-[0.65rem] text-[#5E6A63]">{a.seoTitle ?? 'missing'}</p></Td>
                  <Td className="max-w-[240px] truncate text-xs">{a.seoDescription ?? '— missing —'}</Td>
                  <Td className="font-display text-lg font-extrabold text-white">{score}</Td>
                  <Td><Badge tone={score >= 80 ? 'green' : score >= 50 ? 'gold' : 'crimson'}>{score >= 80 ? 'strong' : score >= 50 ? 'needs work' : 'critical'}</Badge></Td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </div>
  );
}
