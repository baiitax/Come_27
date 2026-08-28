/* ============================================================
   SEO - Search Engine Optimization architecture
   Primary keywords and structured data
   ============================================================ */
import { cn } from '@/lib/utils';

// Primary keywords per the design brief
export const primaryKeywords = [
  'Aminu Abdussalam Gwarzo',
  'Aminu Gwarzo',
  'Gwarzo Kano',
  'Aminu Gwarzo 2027',
  'Kano governorship 2027',
  'NDC Kano',
  'Kano Governor 2027',
  'Aminu Gwarzo biography',
  'Aminu Gwarzo Deputy Governor',
  'Kano State governance',
  'Kano development',
];

// Secondary keywords
export const secondaryKeywords = [
  'Kano State governorship',
  'Comarade Gwarzo',
  'Kwankwasiyya candidate',
  'Kano 2027 election',
  'Nigeria Democratic Congress',
  'Kano politics',
  'Gwarzo governorship',
  'Deputy Governor Kano',
  'Kano education',
  'Kano healthcare',
];

// Structured data types supported
export const supportedSchemaTypes = [
  'Person',
  'PoliticalCandidate',
  'Organization',
  'Event',
  'NewsArticle',
  'VideoObject',
  'BreadcrumbList',
];

// Primary schema.org types with required properties
export const schemaTypes = {
  person: {
    ' @type': 'Person',
    name: 'Comarade Aminu Abdussalam Gwarzo',
    description: 'NDC Candidate for Governor of Kano State',
    image: '/images/portraits/primary-portrait.jpg',
    url: '/',
    sameAs: [], // Social media profiles
    memberOf: [
      { ' @type': 'PoliticalOrganization', name: 'Nigeria Democratic Congress' }
    ],
  },
  
  politicalCandidate: {
    ' @type': 'PoliticalCandidate',
    name: 'Aminu Abdussalam Gwarzo',
    areaServed: 'Kano State',
    url: '/',
    party: 'Nigeria Democratic Congress (NDC)',
    candidateFor: {
      ' @type': 'GovernmentOffice',
      name: 'Governor of Kano State',
      electionDate: '2027',
    },
    runningMate: {
      ' @type': 'Person',
      name: 'Mustapha Rabiu Musa Kwankwaso',
      sameAs: [],
    },
    memberOf: {
      ' @type': 'PoliticalParty',
      name: 'Nigeria Democratic Congress',
    },
  },
  
  organization: {
    ' @type': 'Organization',
    name: 'Aminu Abdussalam Gwarzo Campaign',
    url: '/',
    sameAs: [], // Social profiles
    logo: '/images/logo.svg',
  },
  
  breadcrumb: {
    ' @type': 'BreadcrumbList',
    itemListElement: [
      { ' @type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { ' @type': 'ListItem', position: 2, name: 'About', item: '/about' },
      { ' @type': 'ListItem', position: 3, name: 'Record', item: '/record' },
    ],
  },
};

// Page-specific SEO metadata generator
export function generateSEOMetadata(pageData: {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}): {
  titleTag: string;
  metaDescription: string;
  metaKeywords: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    images: Array<{ url: string; width?: number; height?: number }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: Array<string>;
  };
  structuredData: string;
} {
  const {
    title,
    description,
    keywords = primaryKeywords,
    canonical = '/',
    ogImage = '/images/og-image.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image',
  } = pageData;

  const titleTag = `${title} | Aminu Abdussalam Gwarzo`;
  const metaDescription = description;
  const metaKeywords = keywords.join(', ');
  const canonicalURL = canonical;

  const openGraph = {
    title,
    description,
    type: ogType,
    url: canonical,
    images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
  };

  const twitter = {
    card: twitterCard,
    title,
    description,
    images: ogImage ? [ogImage] : [],
  };

  // Generate JSON-LD structured data
  const personSchema = {
    ' @context': 'https://schema.org',
    ' @type': 'Person',
    name: 'Aminu Abdussalam Gwarzo',
    description: description || 'NDC Candidate for Governor of Kano State 2027',
    image: ogImage || '/images/portraits/primary-portrait.jpg',
    url: canonical,
    memberOf: [
      { ' @type': 'PoliticalOrganization', name: 'Nigeria Democratic Congress' },
    ],
  };

  const politicalCandidateSchema = {
    ' @context': 'https://schema.org',
    ' @type': 'PoliticalCandidate',
    name: 'Aminu Abdussalam Gwarzo',
    areaServed: 'Kano State',
    url: canonical,
    party: 'Nigeria Democratic Congress (NDC)',
    candidateFor: {
      ' @type': 'GovernmentOffice',
      name: 'Governor of Kano State',
      electionDate: '2027',
    },
  };

  const organizationSchema = {
    ' @context': 'https://schema.org',
    ' @type': 'Organization',
    name: 'Aminu Abdussalam Gwarzo Campaign',
    url: canonical,
    logo: '/images/logo.svg',
  };

  const combinedSchema = [
    personSchema,
    politicalCandidateSchema,
    organizationSchema,
  ];

  return {
    titleTag,
    metaDescription,
    metaKeywords,
    canonical: canonicalURL,
    openGraph,
    twitter,
    structuredData: JSON.stringify(combinedSchema),
  };
}

// Robots.txt guidelines
export const robotsGuidelines = {
  allow: [
    '/',           // Home page
    '/about',      // About section
    '/record',     // Public service record
    '/kano',       // Kano section
    '/vision',     // Vision section
    '/facts',      // Facts & transparency
    '/engage',     // Citizen engagement
    '/media',      // Media center
    '/events',     // Events
    '/press',      // Press center
    '/search',     // Search functionality,
  ],
  
  disallow: [
    '/admin',      // Admin panel (never expose publicly)
    '/cms',        // CMS area
    '/dashboard',  // Dashboard
    '/private',    // Any private routes,
  ],
  
  sitemap: '/sitemap.xml',
  host: 'https://gwarzo2027.ng',
};

// Canonical URL management
export const canonicalManager = {
  setCanonical: (url: string) => {
    const link = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.href = url;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'canonical';
      newLink.href = url;
      document.head.appendChild(newLink);
    }
  },
  
  reset: () => {
    const link = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.remove();
    }
  },
};

// Hreflang for multilingual (Hausa + English)
export const hreflangTags = {
  english: {
    language: 'en',
    url: '/',
  },
  hausa: {
    language: 'ha',
    url: '/hausa', // Would be Hausa version of home
  },
  
  // Generate hreflink tags
  generateTags: (): string => {
    return `
      <link rel="alternate" hreflang="en" href="/" />
      <link rel="alternate" hreflang="ha" href="/hausa" />
      <link rel="alternate" hreflang="x-default" href="/" />
    `;
  },
};