import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, setSessionCookie } from '@/lib/auth-admin';

export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(1).max(200),
  remember: z.boolean().default(false),
  next: z.string().max(200).default('/admin/dashboard'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Enter your email and password to sign in.' }, { status: 400 });
  const { email, password, remember, next } = parsed.data;
  if (!next.startsWith('/admin')) return NextResponse.json({ error: 'Invalid destination.' }, { status: 400 });

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const result = await authenticate(email, password, ip);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.code === 'rate' ? 429 : 401 });
    await setSessionCookie(result.user, remember);
    return NextResponse.redirect(new URL(next, req.url), { status: 303 });
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e) throw e;
    return NextResponse.json({ error: 'Authentication service is temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
