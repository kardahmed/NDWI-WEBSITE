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
