export type Tone = 'green' | 'gold' | 'crimson' | 'blue' | 'neutral' | 'red' | 'slate';

export const STATUS_TONE: Record<string, Tone> = {
  // workflow
  draft: 'slate', review: 'gold', scheduled: 'blue', published: 'green', archived: 'neutral',
  'under-review': 'gold', verified: 'green', 'mostly-verified': 'green', unverified: 'gold',
  misleading: 'red', false: 'crimson', insufficient: 'slate',
  // submissions
  new: 'crimson', acknowledged: 'blue', assigned: 'gold', responded: 'green', resolved: 'green',
  // events
  upcoming: 'blue', live: 'green', completed: 'neutral', cancelled: 'crimson',
  // volunteers
  pending: 'gold', active: 'green', 'on-leave': 'slate', declined: 'neutral',
  // audit
  login: 'green', logout: 'slate', login_failed: 'red', create: 'green', update: 'neutral',
  publish: 'gold', unpublish: 'neutral', delete: 'red', restore: 'blue', verify: 'green',
  export: 'blue', assign: 'gold', approve: 'green',
};

export function statusTone(s: string): Tone {
  return STATUS_TONE[s] ?? 'neutral';
}
