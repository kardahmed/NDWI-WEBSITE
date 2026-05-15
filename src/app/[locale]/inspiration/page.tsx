import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import { BlogList } from '@/components/sections/blog-list';
import { NewsletterSignup } from '@/components/forms/newsletter-signup';
import { fetchAllPosts } from '@/sanity/queries/blog';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function InspirationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = await fetchAllPosts();

  return (
    <>
      <header className="relative overflow-hidden bg-bone-100">
        <img
          src="/images/inspiration/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bone-50/85 via-bone-50/70 to-bone-50/90" aria-hidden />
        <div className="relative container-page pt-24 pb-12 lg:pt-32 lg:pb-16">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="heading-display mt-5 text-display-lg">{t('title')}</h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/70">
            {t('subtitle')}
          </p>
        </div>
      </header>
      <BlogList posts={posts} />
      <NewsletterSignup />
    </>
  );
}
