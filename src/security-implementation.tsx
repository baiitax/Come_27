/* ============================================================
   SECURITY - Implementation requirements
   ============================================================ */
import { cn } from '@/lib/utils';

// Security headers for Next.js/Express
export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.google.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https:'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    objectSrc: ["'none'"],
    frameAncestors: ["'self'"],
    baseUri: ["'self'"],
  },
  
  // HTTP Strict Transport Security
  'Strict-Transport-Security': {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  
  // X-Frame-Options
  'X-Frame-Options': 'SAMEORIGIN',
  
  // X-Frame-Options for specific routes
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer-Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Role-based access control for admin panel
export const adminAccessControl = {
  // Routes that require authentication
  protectedRoutes: [
    '/admin',
    '/dashboard',
    '/cms',
    '/api/admin',
  ],
  
  // Routes that are public
  publicRoutes: [
    '/',
    '/about',
    '/record',
    '/kano',
    '/vision',
    '/facts',
    '/engage',
    '/media',
    '/events',
    '/press',
    '/faq',
  ],
  
  // API endpoints with rate limiting
  apiEndpoints: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // max 100 requests per windowMs
    },
  },
};

// Data sanitization rules
export const dataSanitization = {
  // HTML sanitization - allowed tags
  allowedHtmlTags: [
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'a',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'blockquote',
    'code',
    'pre',
  ],
  
  // Allowed attributes per tag
  allowedHtmlAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    div: ['class', 'style'],
    span: ['class', 'style'],
  ],
  
  // XSS prevention - never allow inline event handlers
  forbiddenAttributes: ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown'],
  
  // Political claim data validation
  claimValidation: {
    requiresSource: true,
    requiresYear: true,
    requiresLastUpdated: true,
    prohibitedSources: ['unknown', 'unverified', 'rumor'],
  },
};

// Audit logging for admin actions
export const auditLog = {
  enabled: true,
  fields: [
    'action',
    'userId',
    'timestamp',
    'ipAddress',
    'userAgent',
    'details',
  ],
  retentionPeriod: '2 years', // Keep logs for 2 years
  
  // Log action types
  actionTypes: {
    contentCreate: 'content_created',
    contentEdit: 'content_edited',
    contentPublish: 'content_published',
    userLogin: 'user_login',
    dataExport: 'data_export',
    settingChange: 'setting_changed',
  },
};

// Bot protection settings
export const botProtection = {
  // Rate limiting for forms
  formRateLimit: {
    maxSubmissions: 5, // Max 5 form submissions per hour per IP
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // CAPTCHA optional (for sensitive forms)
  captcha: {
    enabled: false, // Would integrate reCAPTCHA or hCaptcha when needed
    requiredFor: ['contact', 'download'], // Forms that need CAPTCHA
  },
  
  // Honeypot fields (invisible to humans, catches bots)
  honeypot: {
    enabled: true,
    fieldName: 'website', // Invisible field that bots fill in
  },
};

// Secure session management
export const sessionManagement = {
  cookieHttpOnly: true,
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieSameSite: 'strict',
  maxAge: 24 * 60 * 60, // 24 hours
  renewalAge: 12 * 60 * 60, // Renew after 12 hours
};