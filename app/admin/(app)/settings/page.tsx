import { redirect } from 'next/navigation';
import { getSessionUser, requirePerm } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Field } from '@/components/admin/ui';
import { AdminForm, In } from '@/components/admin/form';
import { saveSettings } from '@admin/actions/system';

export const dynamic = 'force-dynamic';

const GROUPS: { title: string; keys: [string, string][] }[] = [
  { title: 'Branding', keys: [['brand.campaignName', 'Campaign name'], ['brand.tagline', 'Tagline'], ['brand.primaryColor', 'Primary color'], ['brand.accentColor', 'Accent color']] },
  { title: 'Contact', keys: [['contact.email', 'Email'], ['contact.phone', 'Phone'], ['contact.address', 'Address'], ['contact.x', 'X / Twitter'], ['contact.facebook', 'Facebook'], ['contact.instagram', 'Instagram']] },
  { title: 'Website', keys: [['site.title', 'Site title'], ['site.description', 'Site description'], ['site.analyticsId', 'Analytics ID']] },
  { title: 'Footer', keys: [['footer.copyright', 'Copyright line'], ['footer.disclaimer', 'Disclaimer']] },
];

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  requirePerm(user, 'settings.manage');
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div>
      <PageHeader crumb="System" title="Global Settings" sub="Everything the public site displays — nothing important requires a code change." />
      <AdminForm action={saveSettings} saveLabel="Save Settings">
        {GROUPS.map((g) => (
          <Card key={g.title}>
            <CardHead title={g.title} />
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              {g.keys.map(([key, label]) => (
                <Field key={key} label={label}>
                  <In name={key} value={map[key] ?? ''} />
                </Field>
              ))}
            </div>
          </Card>
        ))}
      </AdminForm>
    </div>
  );
}
