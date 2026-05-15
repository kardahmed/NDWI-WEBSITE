import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import { Link, routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import {
  fetchAllPostSlugs,
  fetchPostBySlug,
  blogCategories,
  formatDate,
} from '@/sanity/queries/blog';
import { urlFor } from '@/sanity/client';
import { PortableTextRenderer } from '@/components/sections/portable-text-renderer';
import { NewsletterSignup } from '@/components/forms/newsletter-signup';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchAllPostSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return {};
  const L = locale as Locale;
  return {
    title: post.title[L],
    description: post.excerpt?.[L],
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations('blog.article');
  const L = locale as Locale;
  const cat = blogCategories.find((c) => c.slug === post.category);
  const heroImageUrl = post.cover ? urlFor(post.cover).width(1800).url() : null;
  const bodyValue = (post.body?.[L] || post.body?.fr) as unknown[] | undefined;

  return (
    <>
      <div className="container-page pt-10">
        <Link
          href="/inspiration"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-copper-500 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t('back')}
        </Link>
      </div>

      <article className="container-page pt-10 pb-20">
        {/* Hero */}
        <header className="max-w-4xl mb-12">
          {cat && (
            <span className="eyebrow">
              {cat.label[L]}
            </span>
          )}
          <h1 className="heading-display mt-4 text-display-xl">{post.title[L]}</h1>
          {post.excerpt && (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/70">
              {post.excerpt[L]}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.14em] text-ink/50">
            {post.author && (
              <span className="inline-flex items-center gap-2">
                <User size={14} /> {post.author}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} /> {formatDate(post.publishedAt, L)}
            </span>
          </div>
        </header>

        {/* Cover */}
        {heroImageUrl && (
          <div className="mb-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageUrl}
              alt={post.title[L]}
              className="w-full aspect-[21/9] object-cover border border-ink/10"
            />
          </div>
        )}

        {/* Body rich text */}
        <div className="grid lg:grid-cols-[3fr_1fr] gap-12">
          <div>{bodyValue && <PortableTextRenderer value={bodyValue} />}</div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="bg-bone-50 border border-ink/10 p-6">
              <p className="eyebrow !text-ink/40 mb-4">{t('sidebar.title')}</p>
              <p className="text-sm text-ink/70 leading-relaxed">
                {t('sidebar.body')}
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-copper-500 link-underline"
              >
                {t('sidebar.cta')}
              </Link>
            </div>
          </aside>
        </div>
      </article>

      <NewsletterSignup />
    </>
  );
}
