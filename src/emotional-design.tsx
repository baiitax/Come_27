/* ============================================================
   EMOTIONAL DESIGN - Visitor feeling pillars
   ============================================================ */
export const emotionalDesign = {
  // Visitor emotional pillars per the design brief
  pillars: {
    trust: {
      name: 'TRUST',
      description: "His record is documented.",
      icon: 'ShieldCheck',
      color: 'var(--primary-green)',
    },
    experience: {
      name: 'EXPERIENCE',
      description: 'He understands government.',
      icon: 'Briefcase',
      color: 'var(--gold)',
    },
    roots: {
      name: 'ROOTS',
      description: 'He understands Kano.',
      icon: 'MapPin',
      color: 'var(--primary-green)',
    },
    hope: {
      name: 'HOPE',
      description: 'There is a vision.',
      icon: 'Sunrise',
      color: 'var(--gold)',
    },
    accountability: {
      name: 'ACCOUNTABILITY',
      description: "I can examine the evidence.",
      icon: 'FileText',
      color: 'var(--primary-green)',
    },
    participation: {
      name: 'PARTICIPATION',
      description: 'I can contribute.',
      icon: 'UserPlus',
      color: 'var(--gold)',
    },
  },

  // Color mapping for UI elements
  colors: {
    primary: 'var(--primary-green)',
    secondary: 'var(--gold)',
    background: 'var(--obsidian)',
    surface: 'var(--glass-surface)',
  },

  // How each pillar is communicated visually
  communication: {
    trust: 'Evidence badges, document View buttons, provenance labeling',
    experience: 'Governance model, timeline, public service record',
    roots: 'Kano cultural patterns, LGA map, geographic data',
    hope: 'Vision pillars, Kano 2031, policy proposals',
    accountability: 'Scorecard, evidence badges, document viewer',
    participation: 'Engagement forms, priority map, volunteer system',
  },
};

// Initialize emotional design on page load
export function initEmotionalDesign() {
  // Add subtle micro-interactions that reinforce emotional design
  const style = document.createElement('style');
  style.textContent = `
    /* Trust visual reinforcement */
    .evidence-badge:hover { border-color: var(--primary-green); }
    .view-document:hover { color: var(--primary-green); }
    
    /* Experience visual reinforcement */
    .timeline-chip { transition: all 0.3s ease; }
    .timeline-chip:hover { background: var(--primary-green); color: var(--white); }
    
    /* Roots visual reinforcement */
    .lga-card:hover { border-color: var(--primary-green); }
    
    /* Hope visual reinforcement */
    .pillar-number { color: var(--gold); }
    .pillar-number:hover { color: #b8860b; }
    
    /* Accountability visual reinforcement */
    .evidence-badge.verified { border-color: var(--primary-green); }
    .scorecard-status.pending { color: var(--gold); }
    
    /* Participation visual reinforcement */
    .question-form-input:focus { border-color: var(--primary-green); }
    .submit-button:hover { background: var(--primary-green); }
  `;
  document.head.appendChild(style);
}

// Run on mount
initEmotionalDesign();