import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/profile/',
      },
    ],
    sitemap: `https://newroom.io/sitemap.xml`,
  };
}