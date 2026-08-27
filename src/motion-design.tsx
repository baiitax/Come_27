/* ============================================================
   MOTION DESIGN SYSTEM - Subtle cinematic motion
   ============================================================ */
import { cn } from '@/lib/utils';

// Reduced motion media query
export const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)') 
  : { matches: false };

// Motion classes for different elements
export const motionClasses = {
  // Hero section
  heroAtmospheric: 'hero-atmospheric',
  heroFadeIn: 'hero-fade-in',
  
  // Glass cards
  glassCardEnter: 'glass-card-enter',
  glassCardHover: 'glass-card-hover',
  
  // Timeline
  timelineChip: 'timeline-chip',
  timelineProgressive: 'timeline-progressive',
  
  // Statistics
  counterAnimate: 'counter-animate',
  
  // Map
  mapHover: 'map-hover',
  
  // Policy cards
  policyCardLift: 'policy-card-lift',
  
  // Navigation
  navbarBlur: 'navbar-blur',
};

// Keyframe definitions
export const keyframes = {
  // Hero atmospheric movement
  atmospheric: `
    @keyframes atmospheric {
      0% { transform: translateY(0); opacity: 0.8; }
      50% { transform: translateY(-10px); opacity: 1; }
      100% { transform: translateY(0); opacity: 0.8; }
    }
  `,
  
  // Glass card fade + translate
  fadeSlideUp: `
    @keyframes fadeSlideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  // Timeline progressive reveal
  timelineReveal: `
    @keyframes timelineReveal {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  
  // Counter animation
  counter: `
    @keyframes counter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  
  // Policy card soft lift
  policyLift: `
    @keyframes policyLift {
      from { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4); }
      to { box-shadow: 0 8px 32px rgba(11, 107, 69, 0.4); }
    }
  `,
  
  // Navigation blur transition
  navbarBlur: `
    @keyframes navbarBlur {
      from { backdrop-filter: blur(18px); }
      to { backdrop-filter: blur(24px); }
    }
  `,
};

// Motion utilities
export const motionUtils = {
  // Duration scale
  duration: {
    fast: '150ms',
    medium: '400ms',
    slow: '800ms',
    varDefault: 'var(--transition-medium)',
  },
  
  // Easing functions
  easing: {
    default: 'ease',
    glass: 'cubic-bezier(0.4, 0, 0.2, 1)',
    hero: 'ease',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // Delay generator
  generateDelay: (index: number, baseDelay: string = '0ms') => 
    `${index * 100}ms`,
  
  // Stagger children config
  staggerConfig: {
    interval: '100ms',
    reverse: false,
    children: '> *',
  },
  
  // Check if reduced motion is preferred
  isReducedMotion: (): boolean => prefersReducedMotion.matches,
  
  // Get motion class name
  getClass: (element: string): string => motionClasses[element] || '',
  
  // Apply motion styles to element
  applyStyles: (element: string, options: { 
    duration?: string; 
    delay?: string; 
    easing?: string; 
    repeat?: number | 'infinite' 
  } = {}): string => {
    const {
      duration = motionUtils.duration.medium,
      delay = '0ms',
      easing = motionUtils.easing.default,
      repeat,
    } = options;
    
    const animationProps = [
      `animation:${element} ${duration} ${easing} ${delay}`,
      ...(repeat !== undefined ? [`animation-iteration-count:${repeat}`] : []),
    ].join('; ');
    
    return animationProps;
  },
};

// Section-specific motion configurations
export const sectionMotion = {
  // Hero section motion
  hero: {
    atmosphericMovement: true,
    glassCardEnter: true,
    counterAnimation: true,
  },
  
  // Why Gwarzo section
  whyGwarzo: {
    cardFadeIn: true,
    evidenceBadgePulse: false,
  },
  
  // Timeline section
  timeline: {
    progressiveReveal: true,
    chipAnimation: true,
  },
  
  // Kano Development Observatory
  observatory: {
    counterAnimation: true,
    trendAnimation: true,
  },
  
  // Policy cards
  policy: {
    softLiftOnHover: true,
  },
  
  // Navigation
  navigation: {
    blurTransition: true,
    shrinkOnScroll: true,
  },
  
  // Facts & transparency
  facts: {
    evidenceBadgePulse: false,
    counterAnimation: true,
  },
};

// Apply reduced motion if preferred
export function applyReducedMotion() {
  if (motionUtils.isReducedMotion()) {
    // Disable all keyframe animations, keep only necessary transitions
    const style = document.createElement('style');
    style.textContent = `
      * {
        transition: none !important;
        animation: none !important;
      }
      @keyframes atmospheric { display: none; }
      @keyframes fadeSlideUp { display: none; }
      @keyframes counter { display: none; }
    `;
    document.head.appendChild(style);
  }
}

// Initialize reduced motion check
applyReducedMotion();