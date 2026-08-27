/* ============================================================
   ROLE-BASED PERMISSIONS - Admin access control
   ============================================================ */
export type AdminRole = 
  | 'super-admin'
  | 'editor'
  | 'media-manager'
  | 'policy-team'
  | 'research-team'
  | 'press-team'
  | 'events-team'
  | 'moderator'
  | 'analyst';

export interface RolePermissions {
  canEditContent: boolean;
  canPublishContent: boolean;
  canFactCheck: boolean;
  canEditPolicies: boolean;
  canManageMedia: boolean;
  canManageEvents: boolean;
  canModerateSubmissions: boolean;
  canViewAnalytics: boolean;
  canApproveContent: boolean;
  canViewSensitiveData: boolean;
}

/* Role permission matrix */
const rolePermissions: Record<AdminRole, RolePermissions> = {
  'super-admin': {
    canEditContent: true,
    canPublishContent: true,
    canFactCheck: true,
    canEditPolicies: true,
    canManageMedia: true,
    canManageEvents: true,
    canModerateSubmissions: true,
    canViewAnalytics: true,
    canApproveContent: true,
    canViewSensitiveData: true,
  },
  editor: {
    canEditContent: true,
    canPublishContent: false,
    canFactCheck: false,
    canEditPolicies: true,
    canManageMedia: false,
    canManageEvents: false,
    canModerateSubmissions: true,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: false,
  },
  'media-manager': {
    canEditContent: false,
    canPublishContent: false,
    canFactCheck: false,
    canEditPolicies: false,
    canManageMedia: true,
    canManageEvents: false,
    canModerateSubmissions: true,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: false,
  },
  'policy-team': {
    canEditContent: false,
    canPublishContent: false,
    canFactCheck: false,
    canEditPolicies: true,
    canManageMedia: false,
    canManageEvents: false,
    canModerateSubmissions: false,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: false,
  },
  'research-team': {
    canEditContent: false,
    canPublishContent: false,
    canFactCheck: true,
    canEditPolicies: false,
    canManageMedia: false,
    canManageEvents: false,
    canModerateSubmissions: false,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: true,
  },
  'press-team': {
    canEditContent: false,
    canPublishContent: false,
    canFactCheck: false,
    canEditPolicies: false,
    canManageMedia: true,
    canManageEvents: true,
    canModerateSubmissions: false,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: false,
  },
  'events-team': {
    canEditContent: false,
    canPublishContent: false,
    canFactCheck: false,
    canEditPolicies: false,
    canManageMedia: false,
    canManageEvents: true,
    canModerateSubmissions: false,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: false,
  },
  moderator: {
    canEditContent: false,
    canPublishContent: false,
    canFactCheck: false,
    canEditPolicies: false,
    canManageMedia: false,
    canManageEvents: false,
    canModerateSubmissions: true,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: false,
  },
  analyst: {
    canEditContent: false,
    canPublishContent: false,
    canFactCheck: false,
    canEditPolicies: false,
    canManageMedia: false,
    canManageEvents: false,
    canModerateSubmissions: false,
    canViewAnalytics: true,
    canApproveContent: false,
    canViewSensitiveData: true,
  },
};

export function getRolePermissions(role: AdminRole): RolePermissions {
  return rolePermissions[role] || rolePermissions['analyst'];
}

export function checkPermission(role: AdminRole, permission: keyof RolePermissions): boolean {
  return getRolePermissions(role)[permission];
}

export const roleLabels: Record<AdminRole, string> = {
  'super-admin': 'Super Admin',
  editor: 'Editor',
  'media-manager': 'Media Manager',
  'policy-team': 'Policy Team',
  'research-team': 'Research Team',
  'press-team': 'Press Team',
  'events-team': 'Events Team',
  moderator: 'Moderator',
  analyst: 'Analyst',
};

export const roleDescriptions: Record<AdminRole, string> = {
  'super-admin': 'Full access to all administration functions.',
  editor: 'Content management and publishing (cannot publish without approval).',
  'media-manager': 'Photos, videos, and media asset management.',
  'policy-team': 'Policy documents and manifesto management.',
  'research-team': 'Fact-checking and source verification.',
  'press-team': 'Press releases and media communications.',
  'events-team': 'Event planning and coordination.',
  moderator: 'Citizen submissions and community management.',
  analyst: 'Analytics and reporting access.',
};