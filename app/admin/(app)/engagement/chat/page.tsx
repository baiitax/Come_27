import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-admin';
import { PageHeader, EmptyState } from '@/components/admin/ui';
import { ChatInboxItem, type InboxMessage } from '@/components/admin/chat-inbox-item';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Chat Inbox — Gwarzo 2027 CMS' };

const TABS = ['all', 'new', 'opened', 'responded', 'resolved'] as const;

export default async function ChatInboxPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  const { tab = 'all' } = await searchParams;
  const active = (TABS as readonly string[]).includes(tab) ? tab : 'all';

  const [messages, counts] = await Promise.all([
    prisma.chatMessage.findMany({
      where: active === 'all' ? {} : { status: active },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.chatMessage.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const countFor = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = counts.reduce((n, c) => n + c._count._all, 0);

  const msgs: InboxMessage[] = messages;

  return (
    <div>
      <PageHeader
        crumb="Engagement"
        title="Chat Inbox"
        sub="Live-chat messages from the public website. Visitors see your response in their chat window the moment it is saved."
      />

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const n = t === 'all' ? total : countFor(t);
          const isActive = active === t;
          return (
            <Link
              key={t}
              href={t === 'all' ? '/admin/engagement/chat' : `/admin/engagement/chat?tab=${t}`}
              className={`rounded-full border px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] transition-all ${
                isActive
                  ? 'border-[#172033] bg-[#172033] text-white shadow-[0_6px_18px_rgba(23,32,51,0.25)]'
                  : 'border-[rgba(16,24,40,0.12)] bg-white/70 text-[#475467] hover:border-[#172033]/40'
              }`}
            >
              {t} <span className={`ml-1 ${isActive ? 'text-white/70' : 'text-[#98A2B3]'}`}>{n}</span>
            </Link>
          );
        })}
      </div>

      {msgs.length === 0 ? (
        <EmptyState
          title={active === 'all' ? 'No messages yet' : `No ${active} messages`}
          sub="Messages sent from the website's chat bubble appear here in real time."
        />
      ) : (
        <ul className="space-y-3">
          {msgs.map((m) => (
            <ChatInboxItem key={m.id} msg={m} />
          ))}
        </ul>
      )}
    </div>
  );
}
