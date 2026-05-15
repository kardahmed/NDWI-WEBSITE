'use client';

import dynamic from 'next/dynamic';

const ShowroomsMap = dynamic(
  () => import('./showrooms-map').then((m) => m.ShowroomsMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] w-full bg-bone-200 border border-ink/10 animate-pulse flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/40">Chargement de la carte…</p>
      </div>
    ),
  }
);

export function ShowroomsMapWrapper({ height }: { height?: string }) {
  return <ShowroomsMap height={height} />;
}
