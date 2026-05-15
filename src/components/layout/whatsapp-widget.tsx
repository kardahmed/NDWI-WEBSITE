'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { buildWhatsAppUrl } from '@/lib/utils';

export function WhatsAppWidget() {
  const t = useTranslations('whatsapp');
  const href = buildWhatsAppUrl(siteConfig.whatsapp, t('defaultMessage'));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('label')}
      className="fixed bottom-6 end-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <MessageCircle size={26} strokeWidth={1.5} />
    </a>
  );
}
