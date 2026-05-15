import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/sanity/client';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base lg:text-lg leading-relaxed text-ink/80 mb-5 max-w-prose">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="heading-display text-3xl lg:text-4xl text-ink mt-12 mb-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="heading-display text-2xl text-ink mt-10 mb-4">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-xl text-ink mt-8 mb-3">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 ps-6 border-s-2 border-copper-500 font-display text-2xl italic text-ink/80 max-w-prose">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 space-y-2 list-none max-w-prose">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 space-y-2 list-decimal list-inside max-w-prose">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-base text-ink/80">
        <span className="mt-2.5 h-px w-3 bg-copper-500 flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-copper-500 underline underline-offset-2 hover:text-copper-600"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1400).url();
      return (
        <figure className="my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={value.alt || ''} className="w-full" />
          {value.caption && (
            <figcaption className="mt-3 text-xs text-ink/50">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableTextRenderer({ value }: { value: unknown[] }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value as never} components={components} />;
}
