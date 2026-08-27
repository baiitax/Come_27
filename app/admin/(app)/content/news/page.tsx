import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { setArticleStatus, deleteArticle, restoreArticle } from '@admin/actions/content';
import { PageHeader, Card, CardHead, Table, Th, Td, Badge, DemoTag, EmptyState } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { NewsRowActions } from './row-actions';

export const dynamic = 'force-dynamic';

export default async function NewsListPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  const [articles, counts] = await Promise.all([
    prisma.article.findMany({ orderBy: { updatedAt: 'desc' }, take: 100 }),
    prisma.article.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));

  return (
    <div>
      <PageHeader
        crumb="Content"
        title="News & Content"
        sub="Newsroom for articles, press releases, statements and announcements. Workflow: Draft → Review → Fact Review → Approval → Scheduled → Published → Monitored."
        right={
          <Link href="/admin/content/news/new" className="rounded-lg bg-[linear-gradient(135deg,#14805C,#0B6B45)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(11,107,69,0.35)] hover:brightness-110">
            + New Article
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(['published', 'draft', 'review', 'scheduled', 'archived'] as const).map((s) => (
          <Badge key={s} tone={statusTone(s)}>
            {s} · {countMap[s] ?? 0}
          </Badge>
        ))}
      </div>

      <Card>
        {articles.length === 0 ? (
          <EmptyState title="No content yet" sub="Create your first article to start the newsroom." />
        ) : (
          <Table
            head={
              <>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Author</Th>
                <Th>Updated</Th>
                <Th className="text-right">Actions</Th>
              </>
            }
          >
            {articles.map((a) => (
              <tr key={a.id} className="group hover:bg-white/[0.02]">
                <Td>
                  <Link href={a.deletedAt ? '#restored' : `/admin/content/news/${a.id}`} className="font-semibold text-white hover:text-[#C9A24B]">
                    {a.title}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-[#5E6A63]">/{a.slug}</p>
                </Td>
                <Td>
                  <Badge tone="blue">{a.category}</Badge>
                </Td>
                <Td>
                  <span className="flex items-center gap-2">
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                    {a.isDemo && <DemoTag />}
                    {a.deletedAt && <Badge tone="crimson">deleted</Badge>}
                  </span>
                </Td>
                <Td className="text-xs">{a.authorName}</Td>
                <Td className="text-xs tabular-nums">{a.updatedAt.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</Td>
                <Td className="text-right">
                  <NewsRowActions article={{ id: a.id, status: a.status, deletedAt: !!a.deletedAt, canPublish: user.role === 'super_admin' || ['content_admin', 'reviewer'].includes(user.role) }} />
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
