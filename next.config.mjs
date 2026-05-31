import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    // Permet d'utiliser <Image> avec des SVG internes (logos sous /public/logo/).
    // Sûr car on ne sert que des assets self-hosted, jamais d'SVG remote.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Cache-Control + sécurité.
  // Objectif cache : empêcher le CDN Hostinger de resservir une vieille HTML
  // (s-maxage 1 an par défaut) qui référence des chunks supprimés au build
  // suivant → ChunkLoadError / page sans CSS. On force donc :
  //   - les documents HTML (navigations) en revalidation immédiate
  //   - les assets hashés /_next/static/* en immuable (le hash garantit la fraîcheur)
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ];
    return [
      {
        // Assets hashés par Next : sûrs à garder en cache 1 an immuable.
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Documents HTML uniquement (Sec-Fetch-Dest: document) : pas de cache
        // CDN, le navigateur revalide à chaque navigation. Les requêtes vers
        // les assets (style/script/image/font) ont un autre Sec-Fetch-Dest et
        // ne matchent pas → leur cache long est préservé.
        source: '/:path*',
        has: [{ type: 'header', key: 'Sec-Fetch-Dest', value: 'document' }],
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=0, must-revalidate' },
          ...securityHeaders,
        ],
      },
    ];
  },
  // Redirections SEO 301 — anciennes URLs vers la nouvelle structure brand-first.
  async redirects() {
    return [
      // /workspace → /habitat/bureaux (page consolidée combinée NDWi + NDO)
      { source: '/workspace', destination: '/habitat/bureaux', permanent: true },
      { source: '/:locale(fr|ar)/workspace', destination: '/:locale/habitat/bureaux', permanent: true },
      // /groupe → / (la home est maintenant la page "Le Groupe" unifiée)
      { source: '/groupe', destination: '/', permanent: true },
      { source: '/:locale(fr|ar)/groupe', destination: '/:locale', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
