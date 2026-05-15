import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { apiVersion, dataset, projectId, readToken, useCdn } from './env';

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0];

export const sanityClient = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn,
  token: readToken || undefined,
  perspective: 'published',
  stega: { studioUrl: '/admin' },
  // Fail fast if Sanity is unreachable (avoids 50s page hangs in dev)
  requestTagPrefix: 'ndwi',
  timeout: 3000,
  maxRetries: 1,
});

const builder = imageUrlBuilder({ projectId: projectId || 'placeholder', dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function isSanityConfigured() {
  return projectId.length > 0;
}
