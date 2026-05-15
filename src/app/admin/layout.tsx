import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio — Groupe NDWI',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
