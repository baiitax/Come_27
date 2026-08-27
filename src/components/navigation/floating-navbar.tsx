/* ============================================================
   FLOATING GLASS NAVIGATION COMPONENT
   ============================================================ */
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const FloatingNavbar = ({
  items,
  onScroll shrinkOnScroll = false,
  variant = 'desktop', // 'desktop' or 'mobile'
}: {
  items: NavItem[];
  onScroll?: (progress: number) => void;
  variant?: 'desktop' | 'mobile';
}) => {
  const [scrolled, setScrolled] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(false);

  React.useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / docHeight;
      setScrolled(scrollY);
      onScroll?.(progress);
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [onScroll]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        variant === 'desktop'
          ? 'glass-card premium'
          : 'glass-card premium bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md',
        shrinkOnScroll && scrolled > 100 ? 'transform transition-transform duration-300' : ''
      )}
      style={{
        background: 'rgba(255,255,255,0.11)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: variant === 'desktop' ? '28px' : '20px',
        padding: variant === 'desktop' ? '16px 32px' : '12px 24px',
        margin: variant === 'desktop' ? '0 auto' : '20px 0',
      }}
    >
      <div className="flex items-center justify-center gap-8">
        {items.map((item, index) => (
          <button
            key={index}
            href={item.href}
            className={cn(
              'text-[var(--muted-text)] text-sm font-medium uppercase tracking-wider',
              variant === 'desktop' ? 'hover:text-[var(--white)] transition-colors' : 'hover:text-[var(--gold)] transition-colors',
              'relative'
            )}
            style={{
              ...(variant === 'desktop' && {
                fontSize: '0.875rem',
                padding: '8px 16px',
              }),
              ...(variant === 'mobile' && {
                fontSize: '0.75rem',
                padding: '6px 12px',
              }),
            }}
          >
            {item.label}
            {item.external && (
              <svg
                className="inline-block w-4 h-4 ml-2"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M5 12h14M12 5v14" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};