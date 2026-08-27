/* ============================================================
   ADMIN DASHBOARD - Core dashboard component
   ============================================================ */
import { cn } from '@/lib/utils';

export interface DashboardCard {
  id: string;
  title: string;
  description: string;
  statistic?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  href?: string;
  className?: string;
}

export const dashboardCards: DashboardCard[] = [
  {
    id: 'visitors',
    title: 'WEBSITE VISITORS',
    description: 'Total unique visitors this month',
    statistic: '4,532',
    trend: 'up',
    icon: 'Users',
    href: '/admin/visitors',
  },
  {
    id: 'top-pages',
    title: 'TOP PAGES',
    description: 'Most visited pages on the website',
    statistic: '12,847',
    trend: 'up',
    icon: 'Layout',
    href: '/admin/pages',
  },
  {
    id: 'policy-interest',
    title: 'POLICY INTEREST',
    description: 'Most researched policy areas',
    statistic: '3,214',
    trend: 'neutral',
    icon: 'Briefcase',
    href: '/admin/policies',
  },
  {
    id: 'citizen-questions',
    title: 'CITIZEN QUESTIONS',
    description: 'Submitted questions from engagement forms',
    statistic: '427',
    trend: 'up',
    icon: 'MessageCircle',
    href: '/admin/questions',
  },
  {
    id: 'events',
    title: 'EVENTS',
    description: 'Upcoming and past events',
    statistic: '23',
    trend: 'up',
    icon: 'Calendar',
    href: '/admin/events',
  },
  {
    id: 'media-views',
    title: 'MEDIA VIEWS',
    description: 'Press coverage and media interactions',
    statistic: '1,845',
    trend: 'up',
    icon: 'Tv',
    href: '/admin/media',
  },
  {
    id: 'document-downloads',
    title: 'DOCUMENT DOWNLOADS',
    description: 'Document downloads from Record Room',
    statistic: '892',
    trend: 'up',
    icon: 'Download',
    href: '/admin/documents',
  },
];

export function AdminDashboard() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="glass-card premium p-6 text-left hover:translate-y-2 transition-transform cursor-pointer"
              onClick={() => window.location.href = card.href || ''}
              style={{
                border: '1px solid var(--glass-border)',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{
                      background: 'rgba(11, 107, 69, 0.1)',
                      color: 'var(--primary-green)',
                      fontSize: '1.5rem',
                    }}
                >
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-[var(--white)] mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-text)]">
                    {card.description}
                  </p>
                </div>
              </div>
              {/* Statistic or arrow */}
              {card.statistic && (
                <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                  <p className="text-xl font-bold text-[var(--primary-green)]">
                    {card.statistic}
                  </p>
                  {card.trend === 'up' && (
                    <svg className="w-4 h-4 mt-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14M12 5v14" />
                    </p>
                  )}
                  {card.trend === 'down' && (
                    <svg className="w-4 h-4 mt-2 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14M12 5v14" />
                    </p>
                  )}
                  {card.trend === 'neutral' && (
                    <svg className="w-4 h-4 mt-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3-3l-3-3v-4" />
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}