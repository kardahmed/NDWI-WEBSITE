import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ndwi-dz.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Groupe NDWI — Habitat & Workspace haut de gamme',
    template: '%s — Groupe NDWI',
  },
  description:
    "Fabricant algérien de portes, cuisines, dressing, mobilier hôtelier et workspace en partenariat avec les meilleures signatures italiennes. La Grande Mosquée d'Alger, plusieurs ministères, Marriott, Rodina et Maraval nous font confiance.",
  keywords: [
    'portes premium Algérie',
    'cuisine équipée Oran',
    'mobilier hôtelier',
    'mobilier de bureau Algérie',
    'NDWI',
    'NDO',
    'ARAN',
    'PAIL',
    'ICA',
    'showroom Oran',
    'fabricant menuiserie Algérie',
  ],
  authors: [{ name: 'Groupe NDWI', url: siteUrl }],
  creator: 'Groupe NDWI',
  publisher: 'Groupe NDWI',
  openGraph: {
    type: 'website',
    siteName: 'Groupe NDWI',
    url: siteUrl,
    locale: 'fr_DZ',
    alternateLocale: ['ar_DZ'],
    title: 'Groupe NDWI — Habitat & Workspace haut de gamme',
    description:
      "Fabricant algérien de portes, cuisines, dressing, mobilier hôtelier et workspace en partenariat avec les meilleures signatures italiennes.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Groupe NDWI — Habitat & Workspace haut de gamme',
    description:
      "Fabricant algérien de portes, cuisines, dressing, mobilier hôtelier et workspace en partenariat avec les meilleures signatures italiennes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      fr: `${siteUrl}/fr`,
      ar: `${siteUrl}/ar`,
      'x-default': `${siteUrl}/fr`,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F2EE' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
