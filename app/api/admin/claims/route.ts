import { NextRequest } from 'next/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { adminApi, audit } from '@/lib/api-guard';
import { hasPermission } from '@/lib/permissions';

const schema = z.object({
  id: z.string().optional(),
  statement: z.string().min(5).max(2000),
  context: z.string().default(''),
  category: z.string().max(80).default('general'),
  submittedBy: z.string().max(120).default(''),
  status: z.enum(['under-review', 'verified', 'mostly-verified', 'unverified', 'misleading', 'false', 'insufficient']).default('under-review'),
  sourceId: z.string().nullable().default(null),
  verdictNotes: z.string().default(''),
});

export const POST = adminApi('facts.view', async ({ req, user }) => {
  const d = schema.parse(await req.json());
  const canVerify = hasPermission(user.role, 'facts.verify');
  const status = canVerify ? d.status : 'under-review';
  const data = {
    statement: d.statement, context: d.context, category: d.category, submittedBy: d.submittedBy,
    sourceId: d.sourceId, verdictNotes: d.verdictNotes, status,
    verifiedBy: canVerify && status !== 'under-review' ? user.email : null,
    verifiedAt: canVerify && status !== 'under-review' ? new Date() : null,
  };
  let id: string;
  if (d.id) {
    await prisma.claim.update({ where: { id: d.id }, data });
    id = d.id;
    await audit({ user, action: status !== 'under-review' ? 'verify' : 'update', entity: 'claim', entityId: id, newValues: { status, statement: d.statement } });
  } else {
    const c = await prisma.claim.create({ data });
    id = c.id;
    await audit({ user, action: 'create', entity: 'claim', entityId: id, newValues: { statement: d.statement } });
  }
  revalidatePath('/admin/facts');
  revalidatePath('/facts');
  return { ok: true, id };
});
