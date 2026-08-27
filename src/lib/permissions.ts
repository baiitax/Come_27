export type RoleName =
  | 'super_admin'
  | 'content_admin'
  | 'editor'
  | 'fact_checker'
  | 'media_manager'
  | 'engagement_manager'
  | 'analytics_manager'
  | 'reviewer'
  | 'read_only';

export const ROLES: { name: RoleName; label: string; description: string }[] = [
  { name: 'super_admin', label: 'Super Administrator', description: 'Full access to every module, user and setting.' },
  { name: 'content_admin', label: 'Content Administrator', description: 'Manages pages, sections, news, media and publishing.' },
  { name: 'editor', label: 'Editor', description: 'Creates and edits content; cannot publish without approval.' },
  { name: 'fact_checker', label: 'Fact Checker', description: 'Manages claims, evidence trails and sources.' },
  { name: 'media_manager', label: 'Media Manager', description: 'Manages images, videos, audio and documents.' },
  { name: 'engagement_manager', label: 'Engagement Manager', description: 'Manages community submissions, priorities and volunteers.' },
  { name: 'analytics_manager', label: 'Analytics Manager', description: 'Views analytics, intelligence and generates reports.' },
  { name: 'reviewer', label: 'Reviewer', description: 'Approves or rejects content and fact verdicts.' },
  { name: 'read_only', label: 'Read Only', description: 'Dashboard and reporting access without modification.' },
];

const ALL = '*';

export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  super_admin: [ALL],
  content_admin: [
    'content.create', 'content.edit', 'content.publish', 'content.delete', 'content.archive',
    'sections.manage', 'navigation.manage', 'homepage.manage', 'media.upload', 'media.manage',
    'analytics.view', 'engagement.view', 'facts.view', 'seo.manage', 'reports.generate',
  ],
  editor: ['content.create', 'content.edit', 'facts.view', 'media.upload', 'engagement.view'],
  fact_checker: ['facts.view', 'facts.edit', 'facts.verify', 'content.view', 'media.view'],
  media_manager: ['media.upload', 'media.manage', 'media.view', 'content.view'],
  engagement_manager: ['engagement.view', 'engagement.respond', 'engagement.assign', 'volunteers.manage', 'content.view'],
  analytics_manager: ['analytics.view', 'intelligence.view', 'reports.generate'],
  reviewer: ['content.view', 'content.approve', 'content.reject', 'facts.verify'],
  read_only: ['dashboard.view', 'analytics.view', 'content.view'],
};

export function hasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role as RoleName] ?? [];
  return perms.includes(ALL) || perms.includes(permission);
}

export const ROLE_LABELS = Object.fromEntries(ROLES.map((r) => [r.name, r.label])) as Record<string, string>;
