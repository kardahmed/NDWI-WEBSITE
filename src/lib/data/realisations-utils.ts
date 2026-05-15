import type { LocalizedString } from './types';
import type { Locale } from '@/i18n/routing';

export function localized(value: string | LocalizedString | undefined, locale: Locale): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale];
}
