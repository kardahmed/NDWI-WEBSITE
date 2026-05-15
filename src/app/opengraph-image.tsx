import { ImageResponse } from 'next/og';

export const alt = 'Groupe NDWI — Habitat & Workspace haut de gamme';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)',
          color: '#F5F2EE',
          fontFamily: 'serif',
        }}
      >
        {/* Top: eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 18,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: '#B8651A',
          }}
        >
          <span>Groupe NDWI</span>
          <span style={{ color: '#4A4A4A' }}>·</span>
          <span style={{ color: '#E8E0D5' }}>Oran, Algérie</span>
        </div>

        {/* Center: headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <h1
            style={{
              fontSize: 92,
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
              color: '#F5F2EE',
              maxWidth: 900,
            }}
          >
            L&apos;excellence italienne,
            <br />
            fabriquée en Algérie.
          </h1>

          <p
            style={{
              fontSize: 28,
              fontFamily: 'sans-serif',
              fontWeight: 400,
              color: '#E8E0D5',
              opacity: 0.8,
              lineHeight: 1.4,
              maxWidth: 800,
              margin: 0,
            }}
          >
            Portes · Cuisines · Mobilier hôtelier · Workspace
          </p>
        </div>

        {/* Bottom: footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#E8E0D5',
            opacity: 0.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span
              style={{
                fontSize: 56,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: '#F5F2EE',
              }}
            >
              NDWI
            </span>
            <span style={{ fontSize: 56, color: '#B8651A' }}>.</span>
          </div>
          <span style={{ fontFamily: 'sans-serif', fontSize: 18 }}>
            ndwi-dz.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
