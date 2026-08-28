/* ============================================================
   OPEN GRAPH - Custom social preview for every page
   ============================================================ */
import { cn } from '@/lib/utils';

// Default Open Graph data per the design brief
export const defaultOgData = {
  title: 'AMINU ABDUSSALAM GWARZO',
  description: 'A Lifetime of Service. A New Responsibility to Kano.',
  image: '/images/og-primary.jpg',
  type: 'website',
};

// Per-page Open Graph data override
export const pageOgData: Record<string, {
  title: string;
  description: string;
  image: string;
}> = {
  '/': {
    title: 'AMINU ABDUSSALAM GWARZO',
    description: 'A Lifetime of Service. A New Responsibility to Kano.',
    image: '/images/og-primary.jpg',
  },
  '/about': {
    title: 'About Comarade Aminu Abdussalam Gwarzo',
    description: 'Who is Aminu Abdussalam Gwarzo? His biography, background and journey.',
    image: '/images/og-about.jpg',
  },
  '/record': {
    title: 'The Record - Aminu Abdussalam Gwarzo',
    description: 'A public-service journey measured by responsibility, not rhetoric.',
    image: '/images/og-record.jpg',
  },
  '/kano': {
    title: 'Kano Development Portal',
    description: 'Interactive Kano development intelligence portal with 44 LGAs.',
    image: '/images/og-kano.jpg',
  },
  '/policies': {
    title: '2027 Vision for Kano',
    description: 'Ten proposed policy pillars for Kano's future development.',
    image: '/images/og-policies.jpg',
  },
  '/facts': {
    title: 'Facts & Transparency',
    description: 'Leadership deserves scrutiny. Fact-check, public record, and candidate responses.',
    image: '/images/og-facts.jpg',
  },
  '/engage': {
    title: 'Talk to Gwarzo',
    description: 'Submit questions, community priorities, and development ideas.',
    image: '/images/og-engage.jpg',
  },
  '/media': {
    title: 'Media Center - Aminu Abdussalam Gwarzo',
    description: 'Official press portal with speeches, press releases, and media.',
    image: '/images/og-media.jpg',
  },
  '/events': {
    title: 'GWARZO Across Kano',
    description: 'Event calendar and campaign events across Kano State.',
    image: '/images/og-events.jpg',
  },
};

// Social preview dimensions per platform
export const socialPreviewDimensions = {
  facebook: {
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
  },
  twitter: {
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
  },
  linkedin: {
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
  },
  pinterest: {
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
  },
  default: {
    width: 1200,
    height: 630,
  },
};

// Generate Open Graph HTML for a specific page
export function generateOgHTML(pagePath: string = '/'): string {
  const ogData = pageOgData[pagePath] || defaultOgData;
  
  const dimensions = socialPreviewDimensions.default;
  
  return `
    <meta property="og:title" content="${ogData.title}" />
    <meta property="og:description" content="${ogData.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://gwarzo2027.ng${pagePath}" />
    <meta property="og:image" content="https://gwarzo2027.ng${ogData.image}" />
    <meta property="og:width" content="${dimensions.width}" />
    <meta property="og:height" content="${dimensions.height}" />
    <meta property="og:site_name" content="Aminu Abdussalam Gwarzo 2027" />
    
    <!-- Twitter Card -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${ogData.title}" />
    <meta property="twitter:description" content="${ogData.description}" />
    <meta property="twitter:image" content="https://gwarzo2027.${ogData.image}" />
    
    <!-- Article tags (for content pages) -->
    <meta property="article:author" content="/about" />
    <meta property="article:published_time" content="" />
  `;
}

// Per-image optimization for social sharing
export const socialImages = {
  primary: {
    url: '/images/og-primary.jpg',
    alt: 'AMINU ABDUSSALAM GWARZO - A Lifetime of Service. A New Responsibility to Kano.',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
  },
  
  secondary: {
    url: '/images/og-secondary.jpg',
    alt: 'Kano Development Portal - 44 LGAs of Kano State',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
  },
  
  // Fallback if primary fails
  fallback: {
    url: '/images/og-fallback.jpg',
    alt: 'Aminu Gwarzo - Political Candidate',
    width: 1200,
    height: 630,
    type: 'image/png',
  },
};