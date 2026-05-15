export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';

export const useCdn = process.env.NODE_ENV === 'production';

export const readToken = process.env.SANITY_API_READ_TOKEN || '';

export const studioUrl = '/admin';

export function assertSanityConfigured() {
  if (!projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Renseignez-le dans .env.local après création du projet sur sanity.io/manage."
    );
  }
}
