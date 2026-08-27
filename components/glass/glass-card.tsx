/* ============================================================
   GLASS CARD COMPONENT
   ============================================================ */
import { cn } from '@/lib/utils';

export interface GlassCardProps {
  className?: string;
  premium?: boolean;
  shadow?: 'soft' | 'medium' | 'strong';
  hasHover?: boolean;
  children: React.ReactNode;
}

/**
 * Standard Glass Card - used for most UI components
 * - Translucent white/green backdrop
 * - 20-28px blur
 * - 1px translucent white border
 * - 20-28px radius
 * - Subtle inner highlight
 * - Soft shadow
 */
export const GlassCard = ({
  className,
  premium = false,
  shadow = 'soft',
  hasHover = true,
  children,
}: GlassCardProps) => {
  const glassBg = premium ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.07)';
  const glassBorder = 'rgba(255,255,255,0.14)';
  const radius = '24px';
  const blur = '20px';
  const shadowVal = shadow === 'soft' 
    ? '0 4px 24px rgba(0, 0, 0, 0.4)' 
    : shadow === 'medium' 
      ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
      : '0 12px 48px rgba(0, 0, 0, 0.6)';

  return (
    <div
      className={cn(
        'glass-card',
        premium && 'glass-card premium',
        className,
        hasHover && `
          hover:shadow-[var(--shadow-val)]hover:border-color:rgba(255,255,255,0.2)
        `.replace('--shadow-val', shadowVal)
      )}
      style={{
        background: glassBg,
        backdropFilter: `blur(${blur})`,
        border: `1px solid ${glassBorder}`,
        borderRadius: radius,
        boxShadow: shadowVal,
        ...(premium && {
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }),
      }}
    >
      {children}
    </div>
  );
};