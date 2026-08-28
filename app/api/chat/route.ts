import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { publicRoute } from '@/lib/safe-db';

export const dynamic = 'force-dynamic';

const MAX_MESSAGE = 2000;

/**
 * Public live-chat endpoint.
 * POST — submit a visitor message (optionally grouped by browser sessionId).
 * GET  — ?sessionId=… → the visitor's own recent thread (their messages +
 *         campaign responses), used by the chat widget to render history.
 */
export const POST = publicRoute(async (req: Request) => {
  const d = z
    .object({
      name: z.string().trim().min(1).max(120).optional().or(z.literal('')),
      phone: z.string().trim().max(40).optional().or(z.literal('')),
      email: z.string().trim().max(160).optional().or(z.literal('')),
      message: z.string().trim().min(2).max(MAX_MESSAGE),
      sessionId: z.string().trim().max(64).optional().or(z.literal('')),
    })
    .safeParse(await req.json().catch(() => ({})));
  if (!d.success) return NextResponse.json({ error: d.error.issues[0].message }, { status: 400 });

  const v = d.data;
  const msg = await prisma.chatMessage.create({
    data: {
      name: v.name || '',
      phone: v.phone || null,
      email: v.email || null,
      message: v.message,
      sessionId: v.sessionId || null,
    },
  });
  return NextResponse.json({ ok: true, id: msg.id });
});

export const GET = publicRoute(async (req: Request) => {
  const sessionId = new URL(req.url).searchParams.get('sessionId');
  if (!sessionId || sessionId.length > 64) return NextResponse.json({ items: [] });
  const items = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: 30,
  });
  return NextResponse.json({
    items: items.map((m) => ({
      id: m.id,
      message: m.message,
      response: m.response,
      respondedBy: m.respondedBy,
      respondedAt: m.respondedAt,
      status: m.status,
      createdAt: m.createdAt,
    })),
  });
});
