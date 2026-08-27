/* ============================================================
   MOBILE-FIRST DESIGN SYSTEM OPTIMIZATION
   Ensuring exceptional experience on smartphones
   Most Kano users will access it through smartphones.
   ============================================================ */
import { cn } from '@/lib/utils';

// Mobile breakpoint utilities
export const isMobile = () => {
  return typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
};

// Mobile-first z-index system
export const zIndex = {
  mobileNav: 1000,
  glassCard: 1,
  dropdown: 100,
  modal: 1100,
  toast: 1200,
};

// Mobile-first breakpoints
export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Phones
  md: '768px',   // Phables/tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
};

// Mobile navigation heights
export const mobileNavHeights = {
  bottomNav: '64px',
  expanded: 'calc(100vh - 64px)',
  collapsed: '64px',
};

// Glass card mobile adjustments
export const mobileGlassStyles = {
  padding: '12px 16px',
  borderRadius: '20px',
  blur: '18px',
  fontSize: '0.875rem',
};

// Hero section mobile adjustments
export const heroMobileStyles = {
  minH: '90vh',
  portraitH: '400px',
  textSize: {
    heroName: '3xl',
    tagline: 'xl',
    supporting: 'sm',
  },
};

// Mobile navigation items
export const mobileNavItems = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'record', label: 'RECORD' },
  { id: 'kano', label: 'KANO' },
  { id: 'vision', label: 'VISION' },
  { id: 'media', label: 'MEDIA' },
  { id: 'facts', label: 'FACTS' },
  { id: 'engage', label: 'ENGAGE' },
];

// Touch-friendly minimum tap target
export const tapTargetMin = 44; // pixels

// Swipe thresholds for mobile navigation
export const swipeThresholds = {
  minSwipeDistance: 50, // pixels
  maxSwipeTime: 500, // milliseconds
};

// Off-canvas menu states
export const offCanvasStates = {
  closed: 'closed',
  opening: 'opening',
  open: 'open',
  closing: 'closing',
};

// Reduced motion for mobile
export const reducedMotionPrefs = {
  prefersReducedMotion: null,
  disableAnimations: false,
};

// Mobile menu transitions
export const mobileTransitions = {
  navFade: 'opacity 0.3s ease',
  slideUp: 'transform 0.3s ease-out',
  overlayFade: 'background 0.3s ease',
};

// Accessible mobile form elements
export const mobileFormStyles = {
  inputPadding: '12px 16px',
  inputFontSize: '1rem',
  buttonMinHeight: 44,
  checkboxSize: 20,
};

// Kano map mobile adjustments
export const mobileMapStyles = {
  mapHeight: '300px',
  lgaCardPadding: '12px',
  legendHidden: true,
};

// Language selector mobile
export const languageSelectorMobile = {
  buttonWidth: '48px',
  buttonHeight: '48px',
  dropdownMaxHeight: '200px',
};

// Scroll behavior mobile
export const mobileScroll = {
  barColor: 'var(--glass-border)',
  barBackground: 'var(--obsidian)',
  trackHeight: 'scrollHeight',
  thumbHeight: '25%',
};

// Priority order for mobile content display
export const mobilePriority = [
  'hero',          // Always show hero first
  'key_messages',  // Core messages
  'cta',           // Call to action
  'timeline',      // Simplified timeline
  'filter_options', // Filter by category
  'data_tables',   // Simplified tables
];

// Mobile content condensation rules
export const contentCondensation = {
  showLessTextOnMobile: true,
  maxLinesHeadingMobile: 1,
  maxLinesSubheadingMobile: 2,
  hideSidebarMobile: true,
  collapseNavigationMobile: true,
  showFabButtonMobile: true, // Floating action button
];