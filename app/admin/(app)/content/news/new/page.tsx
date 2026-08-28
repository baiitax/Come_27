import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In, Ta, Sel, Chk } from '@/components/admin/form';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'content.edit');

  const [assets, albums] = await Promise.all([
    prisma.mediaAsset.findMany({ where: { kind: 'image' }, orderBy: { createdAt: 'desc' }, take: 40 }),
    prisma.mediaAlbum.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div>
      <PageHeader crumb="Content / News" title="New Article" sub="Draft, schedule or publish. Editors submit for review; publishing requires approval rights." />
      <AdminForm action={saveArticle} saveLabel="Save Article">
        <Card>
          <CardHead title="Article" sub="Headline and body" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="Title" required className="md:col-span-2">
              <In name="title" placeholder="e.g. Comarade Gwarzo presents education reform position" />
            </Field>
            <Field label="Slug" hint="URL (optional — auto from title)">
              <In name="slug" placeholder="education-reform-position" />
            </Field>
            <Field label="Category">
              <Sel name="category">
                {['news', 'speech', 'press-release', 'event', 'statement', 'community', 'policy', 'media', 'announcement'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Sel>
            </Field>
            <Field label="Subtitle" className="md:col-span-2">
              <In name="subtitle" placeholder="One-line summary shown in lists" />
            </Field>
            <Field label="Body" className="md:col-span-2" hint="Plain text, one paragraph per line">
              <Ta name="body" className="min-h-[260px]" placeholder="Full article body…" />
            </Field>
            <Field label="Tags" hint="comma separated">
              <In name="tags" placeholder="education, kano, policy" />
            </Field>
            <Field label="Location">
              <In name="location" placeholder="Kano City" />
            </Field>
            <Field label="Author">
              <In name="authorName" defaultValue="Gwarzo 2027 Desk" />
            </Field>
            <Field label="Featured image">
              <Sel name="featuredImageId">
                <option value="">— none —</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>{a.filename}</option>
                ))}
              </Sel>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHead title="SEO" sub="Search & social metadata" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <Field label="SEO title" hint="≤ 60 characters recommended">
              <In name="seoTitle" />
            </Field>
            <Field label="SEO description" hint="≤ 160 characters recommended">
              <In name="seoDescription" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHead title="Publishing" />
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
            <Field label="Status">
              <Sel name="status">
                <option value="draft">draft</option>
                <option value="review">review</option>
                <option value="scheduled">scheduled</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </Sel>
            </Field>
            <Field label="Publish at" hint="for scheduled items">
              <In name="publishAt" type="datetime-local" />
            </Field>
          </div>
        </Card>
      </AdminForm>
    </div>
  );
}
