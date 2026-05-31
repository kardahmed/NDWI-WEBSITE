import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Groupe NDWI',
    short_name: 'NDWI',
    description: "Habitat & Workspace haut de gamme — Groupe NDWI",
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F2EE',
    theme_color: '#0A0A0A',
    icons: [
      { src: '/icon.png', sizes: '1200x1200', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '1200x1200', type: 'image/png' },
    ],
  };
}
