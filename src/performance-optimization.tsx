/* ============================================================
   PERFORMANCE - Lighthouse targets and optimizations
   ============================================================ */
import { cn } from '@/lib/utils';

// Lighthouse performance targets per the design brief
export const lighthouseTargets = {
  performance: 90,     // Performance score
  accessibility: 95,   // Accessibility score
  'best-practices': 90, // Best practices score
  seo: 95,            // SEO score
};

// Image optimization specifications
export const imageOptimization = {
  // Supported formats: WebP, AVIF
  supportedFormats: ['webp', 'avif', 'jpg', 'png'],
  
  // Quality levels by context
  quality: {
    hero: 85,           // Hero images - high quality
    card: 75,           // Glass cards - medium quality
    thumbnail: 60,      // Thumbnails - lower quality
    logo: 95,           // Logos - very high quality
    avatar: 70,         // Avatars - medium quality,
  },
  
  // Responsive breakpoints
  breakpoints: {
    hero: ['320px', '768px', '1440px'],
    card: ['375px', '768px', '1024px'],
    thumbnail: ['200px', '400px', '800px'],
  },
  
  // Lazy loading settings
  lazyLoading: {
    loading: 'lazy',           // Native lazy loading
    fetchPriority: 'low',      // Low priority for below-the-fold
    intersectionObserver: true, // Use IntersectionObserver
  },
};

// Code splitting and loading
export const codeSplitting = {
  // Route-based code splitting
  routes: [
    '/',              // Home page
    '/hero',          // Hero section
    '/record',        // Public service record
    '/kano',          // Kano section
    '/policies',      // Policy pages
    '/media',         // Media center
    '/events',        // Events
  ],
  
  // Dynamic imports
  dynamic: {
    glassCard: () => import('../components/glass/glass-card'),
    evidenceBadge: () => import('../components/evidence/evidence-badge'),
    search: () => import('../sections/search-section'),
  },
};

// Third-party script management
export const thirdPartyScripts = {
  // Only load what's absolutely necessary
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || false,
    plausible: process.env.NEXT_PUBLIC_PLausible_ID || false,
    enabled: false, // Set to true when GA/plausible IDs are configured
  },
  
  // Font loading
  fonts: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    display: 'swap', // Avoid FOIT/FOUT
  },
  
  // Critical CSS
  criticalCSS: {
    enabled: true,
    headElement: 'head',
    maxSize: 10 * 1024, // 10KB max
  },
};

// Caching strategies
export const caching = {
  // Asset caching (long term)
  assets: 'max-age=31536000, immutable',
  
  // HTML caching (short term)
  html: 'max-age=60, stale-while-revalidate=300',
  
  // API responses (short term)
  api: 'max-age=30, stale-while-revalidate=60',
  
  // No cache for dynamic content
  dynamic: 'no-cache, must-revalidate',
};

// Performance monitoring
export const performanceMetrics = {
  // Core Web Vitals
  webVitals: {
    lcp: 'Largest Contentful Paint',     // Should be < 2.5s
    fid: 'First Input Delay',            // Should be < 100ms
    cls: 'Cumulative Layout Shift',      // Should be < 0.1
    fpp: 'First Contentful Paint',       // Should be < 1.5s
  },
  
  // Custom metrics
  custom: {
    timeToInteractive: 'Time to Interactive',    // Should be < 3s
    timeToFirstByte: 'Time to First Byte',     // Should be < 600ms
    sumOfSquares: 'Sum of Squared Logarithms', // Server timing
  },
  
  // Monitor and report
  monitor: {
    enabled: process.env.NODE_ENV === 'production',
    reportInterval: 60000, // Report every minute
    sendToAnalytics: true,
  },
};

// Optimization checklist per the design brief
export const performanceChecklist = [
  'WebP/AVIF images',
  'Lazy loading',
  'Responsive images',
  'Code splitting',
  'Server-side rendering where appropriate',
  'Caching',
  'CDN',
  'Compressed video',
  'Minimal third-party scripts',
  'Lighthouse Performance: 90+',
  'Accessibility: 95+',
  'SEO: 95+',
];

// Mobile-specific performance considerations
export const mobilePerformance = {
  // Touch-friendly but performance-optimized
  touch: {
    // Use CSS transforms instead of JS for animations
    useCSSTransforms: true,
    // Minimum tap target met
    tapTarget: tapTargetMin,
    // Reduced motion respected
    respectReducedMotion: true,
  },
  
  // Image optimization for mobile
  images: {
    // Always serve responsive images
    useSrcSet: true,
    // Max image size on mobile
    maxImageWidth: '100%',
    // Avoid hero images on mobile if not needed
    heroImageScale: 'scale-down',
  },
  
  // Navigation performance
  navigation: {
    // Floating nav blur is CPU-intensive, optimize
    blurOptimization: 'use-static-blur-image',
    // Hide nav on scroll to save repaints
    hideShowAnimation: true,
  },
};