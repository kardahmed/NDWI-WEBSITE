'use client';

import dynamic from 'next/dynamic';
import type { Finition3D, Door3DModel } from '@/sanity/queries/configurator3D';

const LazyConfigurator = dynamic(
  () => import('./configurator-3d').then((m) => m.Configurator3D),
  {
    ssr: false,
    loading: () => (
      <section className="h-[calc(100vh-80px)] min-h-[700px] w-full bg-bone-50 flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/30">
          Chargement du configurateur 3D…
        </p>
      </section>
    ),
  }
);

export function Configurator3DClient({
  finitions,
  glbUrl,
  model,
}: {
  finitions: Finition3D[];
  glbUrl?: string;
  model?: Door3DModel;
}) {
  return <LazyConfigurator finitions={finitions} glbUrl={glbUrl} model={model} />;
}
