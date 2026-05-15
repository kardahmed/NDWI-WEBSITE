import { siteConfig } from '@/lib/site';
import { showrooms } from '@/lib/data/showrooms';

/** Composant générique pour injecter un JSON-LD safe SSR */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization — à mettre dans le layout racine */
export function OrganizationLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    alternateName: 'NDWI',
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    foundingLocation: { '@type': 'Place', name: 'Oran, Algérie' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.line1,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: 'DZ',
    },
    sameAs: [
      // À compléter avec les vrais profils sociaux
    ],
  };
  return <JsonLd data={data} />;
}

/** LocalBusiness — un par showroom ouvert */
export function ShowroomsLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': showrooms
      .filter((s) => s.status === 'open')
      .map((s) => ({
        '@type': 'FurnitureStore',
        '@id': `${siteConfig.url}/showrooms/${s.slug}`,
        name: `Showroom NDWI ${s.city.fr}`,
        url: `${siteConfig.url}/showrooms/${s.slug}`,
        telephone: s.phone,
        email: s.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.address.fr,
          addressLocality: s.city.fr,
          addressCountry: 'DZ',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: s.lat,
          longitude: s.lng,
        },
        openingHoursSpecification: s.hours?.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.label.fr,
          opens: h.value.fr,
        })),
      })),
  };
  return <JsonLd data={data} />;
}

/** Product LD pour fiche porte */
export function ProductLd({
  name,
  description,
  url,
  category,
  serie,
}: {
  name: string;
  description: string;
  url: string;
  category: string;
  serie: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    category,
    brand: {
      '@type': 'Brand',
      name: 'NDWI',
    },
    manufacturer: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Série', value: serie },
    ],
  };
  return <JsonLd data={data} />;
}

/** BlogPosting LD pour articles */
export function ArticleLd({
  title,
  description,
  url,
  datePublished,
  author,
  imageUrl,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author?: string;
  imageUrl?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished,
    author: {
      '@type': author === siteConfig.name ? 'Organization' : 'Person',
      name: author ?? siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/icon` },
    },
    image: imageUrl,
  };
  return <JsonLd data={data} />;
}

/** Breadcrumb LD générique */
export function BreadcrumbLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return <JsonLd data={data} />;
}
