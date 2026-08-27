import 'server-only';
import { headers } from 'next/headers';
import { prisma } from './db';
import type { SessionUser } from './auth';

export interface AuditInput {
  user: SessionUser;
  action: string; // create|update|publish|unpublish|delete|restore|approve|reject|verify|export|assign|...
  entity: string; // article|claim|event|speech|media|submission|user|setting|...
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

/** Fire-and-forget audit trail. Every admin mutation calls this. */
export async function audit(input: AuditInput): Promise<void> {
  try {
    const h = await headers();
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip') ?? undefined;
    await prisma.auditLog.create({
      data: {
        userId: input.user.id,
        userName: input.user.email,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        oldValues: input.oldValues ? JSON.stringify(input.oldValues) : undefined,
        newValues: input.newValues ? JSON.stringify(input.newValues) : undefined,
        ip,
      },
    });
  } catch {
    // audit must never break the operation
  }
}

/** Version snapshot for important content records. */
export async function snapshotVersion(
  user: SessionUser,
  entity: string,
  entityId: string,
  changes: Record<string, unknown>,
  summary: string
): Promise<void> {
  try {
    const last = await prisma.contentVersion.findFirst({
      where: { entity, entityId },
      orderBy: { version: 'desc' },
    });
    await prisma.contentVersion.create({
      data: {
        entity,
        entityId,
        version: (last?.version ?? 0) + 1,
        changes: JSON.stringify(changes),
        summary,
        userId: user.id,
      },
    });
  } catch {
    // non-fatal
  }
}
