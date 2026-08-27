import { MetadataRoute } from 'next';

const BASE = 'https://come-pcipyrd8f-baiita-x-degen-s-projects.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
