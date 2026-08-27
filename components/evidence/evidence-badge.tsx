/* ============================================================
   EVIDENCE BADGE COMPONENT
   ============================================================ */
import { cn } from '@/lib/utils';

export type EvidenceStatus = 
  | 'verified'
  | 'official-record'
  | 'campaign-document'
  | 'media-report'
  | 'under-review';

export interface EvidenceBadgeProps {
  status: EvidenceStatus;
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfigs: Record<EvidenceStatus, {
  bg: string;
  color: string;
  border: string;
}> = {
  verified: {
    bg: 'rgba(11, 107, 69, 0.2)',
    color: '#0B6B45',
    border: 'rgba(11, 107, 69, 0.4)',
  },
  'official-record': {
    bg: 'rgba(11, 107, 69, 0.2)',
    color: '#0B6B45',
    border: 'rgba(11, 107, 69, 0.4)',
  },
  campaign_document: {
    bg: 'rgba(218, 165, 32, 0.2)',
    color: '#D6B25E',
    border: 'rgba(218, 165, 32, 0.4)',
  },
  'campaign-document': {
    bg: 'rgba(218, 165, 32, 0.2)',
    color: '#D6B25E',
    border: 'rgba(218, 165, 32, 0.4)',
  },
  media_report: {
    bg: 'rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
    border: 'rgba(239, 68, 68, 0.4)',
  },
  'media-report': {
    bg: 'rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
    border: 'rgba(239, 68, 68, 0.4)',
  },
  under_review: {
    bg: 'rgba(168, 181, 175, 0.2)',
    color: '#A8B5AF',
    border: 'rgba(168, 181, 175, 0.4)',
  },
  'under-review': {
    bg: 'rgba(168, 181, 175, 0.2)',
    color: '#A8B5AF',
    border: 'rgba(168, 181, 175, 0.4)',
  },
};

export const EvidenceBadge = ({
  status,
  text = status,
  size = 'sm',
  className,
}: EvidenceBadgeProps) => {
  const config = statusConfigs[status as EvidenceStatus] || statusConfigs.verified;
  
  const sizeStyles = {
    sm: { padding: '2px 6px', fontSize: '0.625rem', borderRadius: '6px' },
    md: { padding: '4px 10px', fontSize: '0.75rem', borderRadius: '8px' },
  };

  return (
    <span
      style={{
        ...sizeStyles[size as 'sm' | 'md'],
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: sizeStyles.borderRadius,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 500,
        fontFamily: 'var(--font-primary)',
      }}
      title={status}
    >
      {text}
    </span>
  );
};

/* ============================================================
   EVIDENCE BADGE GROUP COMPONENT
   ============================================================ */
export const EvidenceBadgeGroup = ({
  statuses,
  className,
}: {
  statuses: EvidenceStatus[];
  className?: string;
}) => {
  return (
    <div className={cn('flex gap-2', className)}>
      {statuses.map((status, index) => (
        <EvidenceBadge
          key={index}
          status={status}
          size="sm"
        />
      ))}
    </div>
  );
};