'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { blogCategories, formatDate, type BlogPost, type BlogCategorySlug } from '@/sanity/queries/blog';
import { urlFor } from '@/sanity/client';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('blog');

  const [category, setCategory] = useState<BlogCategorySlug | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return posts;
    return posts.filter((p) => p.category === category);
  }, [posts, category]);

  // Empty state — pas encore d'articles publiés
  if (posts.length === 0) {
    return (
      <section className="container-page pb-32">
        <div className="bg-bone-50 border border-dashed border-ink/15 px-10 py-12 lg:py-16 text-center">
          <BookOpen size={36} className="mx-auto text-ink/30" strokeWidth={1.5} />
          <p className="mt-6 eyebrow !text-ink/40">{t('empty.eyebrow')}</p>
          <h3 className="heading-display mt-4 text-display-md">{t('empty.title')}</h3>
          <p className="mt-4 max-w-md mx-auto text-sm text-ink/60 leading-relaxed">
            {t('empty.body')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page pb-32">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-12 pb-6 border-b border-ink/10">
        <button
          onClick={() => setCategory('all')}
          className={cn(
            'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
            category === 'all'
              ? 'border-ink bg-ink text-bone-50'
              : 'border-ink/15 text-ink/70 hover:border-ink/40'
          )}
        >
          {t('filters.all')} ({posts.length})
        </button>
        {blogCategories.map((c) => {
          const count = posts.filter((p) => p.category === c.slug).length;
          if (count === 0) return null;
          return (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={cn(
                'px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors',
                category === c.slug
                  ? 'border-ink bg-ink text-bone-50'
                  : 'border-ink/15 text-ink/70 hover:border-ink/40'
              )}
            >
              {c.label[locale]} ({count})
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <BlogCard post={p} locale={locale} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function BlogCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const cat = blogCategories.find((c) => c.slug === post.category);
  const imageUrl = post.cover ? urlFor(post.cover).width(800).height(600).url() : null;

  return (
    <Link
      href={`/inspiration/${post.slug}`}
      className="group flex flex-col bg-bone-50 border border-ink/10 transition-all duration-500 ease-out-soft hover:border-ink/30 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-bone-200 to-bone-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={post.title[locale]}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p className="font-display text-2xl text-ink/20 text-center leading-tight">
              {post.title[locale]}
            </p>
          </div>
        )}
        {cat && (
          <div className="absolute top-4 start-4">
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] bg-ink/85 text-bone-50 backdrop-blur-sm">
              {cat.label[locale]}
            </span>
          </div>
        )}
        <div className="absolute top-4 end-4 h-9 w-9 bg-bone-50/0 group-hover:bg-bone-50 flex items-center justify-center transition-colors">
          <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-90" />
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-[0.16em] text-ink/40">
          {formatDate(post.publishedAt, locale)}
        </p>
        <h3 className="mt-3 font-display text-xl text-ink line-clamp-2">{post.title[locale]}</h3>
        {post.excerpt && (
          <p className="mt-3 text-sm text-ink/60 line-clamp-3">{post.excerpt[locale]}</p>
        )}
        {post.author && (
          <p className="mt-4 pt-4 border-t border-ink/10 text-xs text-ink/40">
            {post.author}
          </p>
        )}
      </div>
    </Link>
  );
}
