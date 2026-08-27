import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requestPasswordReset } from '@/lib/auth-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const parsed = z.object({ email: z.string().email().max(160) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  await requestPasswordReset(parsed.data.email, ip);
  // Generic response — never reveals whether the account exists.
  return NextResponse.json({ sent: true });
}
