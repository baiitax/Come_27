import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { consumePasswordReset, setPassword } from '@/lib/auth-admin';

export const dynamic = 'force-dynamic';

const schema = z.object({
  token: z.string().min(10).max(200),
  password: z.string().min(10).max(200).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Use lowercase, uppercase and a number.'),
  confirm: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  if (parsed.data.password !== parsed.data.confirm) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
  }
  const consumed = await consumePasswordReset(parsed.data.token);
  if (!consumed.ok) return NextResponse.json({ error: 'This reset link is invalid or has expired. Request a new one.' }, { status: 400 });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  await setPassword(consumed.userId!, parsed.data.password, ip);
  return NextResponse.json({ ok: true });
}
