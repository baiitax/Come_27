import { ROLE_LABELS } from './permissions';

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
