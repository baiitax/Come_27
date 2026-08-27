import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getSessionUser, clearSessionCookie } from '@/lib/auth-admin';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (user) {
    const h = await headers();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    await prisma.auditLog.create({
      data: { userId: user.id, userName: user.email, action: 'logout', entity: 'user', entityId: user.id, ip },
    });
  }
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/admin/login', req.url), { status: 303 });
}
