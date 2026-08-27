import { notFound, redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field, Badge, DemoTag } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';
import { AdminForm, In, Ta, Sel } from '@/components/admin/form';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');

  const [article, assets, versions] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.mediaAsset.findMany({ where: { kind: 'image' }, orderBy: { createdAt: 'desc' }, take: 40 }),
    prisma.contentVersion.findMany({ where: { entity: 'article', entityId: id }, orderBy: { version: 'desc' }, take: 8 }),
  ]);
  if (!article) notFound();

  return (
    <div>
      <PageHeader
        crumb={`Content / News / ${article.slug}`}
        title={article.title}
        sub={`Last updated ${article.updatedAt.toLocaleString('en-GB')}`}
        right={
          <span className="flex items-center gap-2">
            <Badge tone={statusTone(article.status)}>{article.status}</Badge>
            {article.isDemo && <DemoTag />}
          </span>
        }
      />
      <AdminForm
        action={saveArticle}
        saveLabel="Save Article"
      >
        <input type="hidden" name="id" value={article.id} />
        <Card>
          <CardHead title="Article" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Title" required className="md:col-span-2">
              <In name="title" value={article.title} />
            </Field>
            <Field label="Slug">
              <In name="slug" value={article.slug} />
            </Field>
            <Field label="Category">
              <Sel name="category" value={article.category}>
                {['news', 'speech', 'press-release', 'event', 'statement', 'community', 'policy', 'media', 'announcement'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Sel>
            </Field>
            <Field label="Subtitle" className="md:col-span-2">
              <In name="subtitle" value={article.subtitle} />
            </Field>
            <Field label="Body" className="md:col-span-2">
              <Ta name="body" className="min-h-[260px]" value={article.body} />
            </Field>
            <Field label="Tags">
              <In name="tags" value={JSON.parse(article.tagsJson || '[]').join(', ')} />
            </Field>
            <Field label="Location">
              <In name="location" value={article.location} />
            </Field>
            <Field label="Author">
              <In name="authorName" value={article.authorName} />
            </Field>
            <Field label="Featured image">
              <Sel name="featuredImageId" value={article.featuredImageId ?? ''}>
                <option value="">— none —</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>{a.filename}</option>
                ))}
              </Sel>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHead title="SEO" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="SEO title">
              <In name="seoTitle" value={article.seoTitle ?? ''} />
            </Field>
            <Field label="SEO description">
              <In name="seoDescription" value={article.seoDescription ?? ''} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHead title="Publishing" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
            <Field label="Status">
              <Sel name="status" value={article.status}>
                {['draft', 'review', 'scheduled', 'published', 'archived'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Sel>
            </Field>
            <Field label="Publish at">
              <In name="publishAt" type="datetime-local" value={article.publishAt ? article.publishAt.toISOString().slice(0, 16) : ''} />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHead title="Version History" sub="Snapshot recorded on every save" />
          {versions.length === 0 ? (
            <p className="px-5 py-4 text-sm text-[#667085]">No versions recorded yet.</p>
          ) : (
            <ul className="divide-y divide-[rgba(16,24,40,0.06)]">
              {versions.map((v) => (
                <li key={v.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-[#364152]">
                    <strong className="font-display text-white">v{v.version}</strong> — {v.summary}
                    {v.user && <span className="text-[#667085]"> · {v.user.name}</span>}
                  </span>
                  <span className="text-xs tabular-nums text-[#98A2B3]">{v.createdAt.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </AdminForm>
    </div>
  );
}
