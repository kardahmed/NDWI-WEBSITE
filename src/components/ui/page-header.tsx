import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, align = 'left', className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'container-page pt-24 pb-12 lg:pt-32 lg:pb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className={cn('heading-display mt-5 text-display-lg', align === 'center' && 'mx-auto')}>
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            'mt-6 max-w-prose text-lg leading-relaxed text-ink/70',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
