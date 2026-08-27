import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';
import { PageHeader, Card, CardHead, Badge } from '@/components/admin/ui';
import { statusTone } from '@/lib/status-tone';

export const dynamic = 'force-dynamic';

export default async function FactsIndexPage() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  const [claims, evidence, sources, byStatus] = await Promise.all([
    prisma.claim.count(),
    prisma.evidence.count(),
    prisma.source.count(),
    prisma.claim.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const statusMap = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all]));

  return (
    <div>
      <PageHeader crumb="Verification" title="Fact-Checking & Evidence" sub="Claims, verdicts, evidence trails and the central source registry. Verdicts can only be set by Fact Checkers and Reviewers." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Claims', claims, '/admin/facts/claims'],
          ['Evidence items', evidence, '/admin/facts/evidence'],
          ['Sources', sources, '/admin/facts/sources'],
          ['Awaiting verification', statusMap['under-review'] ?? 0, '/admin/facts/claims'],
        ].map(([label, value, href]) => (
          <Link key={String(label)} href={String(href)} className="rounded-xl border border-white/[0.07] bg-[#12161A] p-4 transition-colors hover:border-[#C9A24B]/40">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#8A968E]">{label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-white">{value}</p>
          </Link>
        ))}
      </div>
      <Card className="mt-6">
        <CardHead title="Verdict Pipeline" sub="Every claim moves through: under review → verdict (verified / mostly verified / unverified / misleading / false / insufficient evidence)." />
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {['under-review', 'verified', 'mostly-verified', 'unverified', 'misleading', 'false', 'insufficient'].map((s) => (
            <Badge key={s} tone={statusTone(s)}>{s} · {statusMap[s] ?? 0}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
