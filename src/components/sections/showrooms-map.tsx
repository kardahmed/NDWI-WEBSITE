'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocale } from 'next-intl';
import { showrooms } from '@/lib/data/showrooms';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/routing';

// Custom marker icons (palette NDWI)
const openIcon = L.divIcon({
  className: 'ndwi-marker',
  html: `
    <div style="position:relative;width:36px;height:36px;">
      <div style="position:absolute;inset:0;background:#B8651A;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.25);"></div>
      <div style="position:absolute;top:50%;left:50%;width:14px;height:14px;background:#F5F2EE;border-radius:50%;transform:translate(-50%,-50%);"></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const soonIcon = L.divIcon({
  className: 'ndwi-marker-soon',
  html: `
    <div style="position:relative;width:30px;height:30px;">
      <div style="position:absolute;inset:0;background:#0A0A0A;border-radius:50%;opacity:0.7;border:2px solid #B8651A;"></div>
      <div style="position:absolute;top:50%;left:50%;width:6px;height:6px;background:#B8651A;border-radius:50%;transform:translate(-50%,-50%);"></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

interface ShowroomsMapProps {
  height?: string;
}

export function ShowroomsMap({ height = '520px' }: ShowroomsMapProps) {
  const locale = useLocale() as Locale;

  // Centre Algérie pour cadrer les 4 villes
  const center: [number, number] = [35.7, 2.5];

  useEffect(() => {
    // Fix scroll wheel zoom default off on mobile
    return () => {};
  }, []);

  return (
    <div style={{ height }} className="w-full border border-ink/10 overflow-hidden">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showrooms.map((s) => (
          <Marker
            key={s.slug}
            position={[s.lat, s.lng]}
            icon={s.status === 'open' ? openIcon : soonIcon}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
                <p style={{ margin: 0, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#B8651A' }}>
                  {s.status === 'open' ? 'Showroom NDWI' : 'Bientôt'}
                </p>
                <p style={{ margin: '4px 0 0 0', fontFamily: 'Cormorant Garamond, serif', fontSize: 22, color: '#0A0A0A' }}>
                  {s.city[locale]}
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#4A4A4A' }}>
                  {s.address[locale]}
                </p>
                {s.status === 'open' && (
                  <Link
                    href={`/showrooms/${s.slug}`}
                    style={{ display: 'inline-block', marginTop: 10, fontSize: 12, color: '#0A0A0A', textDecoration: 'underline' }}
                  >
                    Voir la fiche →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
