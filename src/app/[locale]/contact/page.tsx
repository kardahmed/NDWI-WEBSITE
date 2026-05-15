import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ContactGeneralForm } from '@/components/forms/contact-general';
import { siteConfig } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

      <section className="container-page pb-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          {/* Coordonnées */}
          <aside className="space-y-10">
            <ContactItem
              icon={<MapPin size={20} />}
              label={t('coords.addressLabel')}
              value={
                <>
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.postalCode} {siteConfig.address.city}, {siteConfig.address.region}
                  <br />
                  {siteConfig.address.country}
                </>
              }
            />
            <ContactItem
              icon={<Phone size={20} />}
              label={t('coords.phoneLabel')}
              value={
                <>
                  <a href={`tel:${(process.env.NEXT_PUBLIC_PHONE_MAIN || '').replace(/\s/g, '')}`} className="hover:text-copper-500">
                    {process.env.NEXT_PUBLIC_PHONE_MAIN}
                  </a>
                  <br />
                  <a href={`tel:${(process.env.NEXT_PUBLIC_PHONE_SECONDARY || '').replace(/\s/g, '')}`} className="hover:text-copper-500">
                    {process.env.NEXT_PUBLIC_PHONE_SECONDARY}
                  </a>
                </>
              }
            />
            <ContactItem
              icon={<Mail size={20} />}
              label={t('coords.emailLabel')}
              value={
                <a href={`mailto:${siteConfig.email}`} className="hover:text-copper-500">
                  {siteConfig.email}
                </a>
              }
            />

            <div className="pt-6 border-t border-ink/10">
              <p className="eyebrow !text-ink/40 mb-3">{t('hours.label')}</p>
              <p className="text-sm text-ink/70">{t('hours.weekdays')}</p>
              <p className="text-sm text-ink/70">{t('hours.saturday')}</p>
            </div>
          </aside>

          {/* Formulaire */}
          <div>
            <ContactGeneralForm sourcePage="/contact" />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 h-10 w-10 border border-ink/10 flex items-center justify-center text-copper-500">
        {icon}
      </div>
      <div>
        <p className="eyebrow !text-ink/40 mb-1.5">{label}</p>
        <div className="text-sm text-ink/80 leading-relaxed">{value}</div>
      </div>
    </div>
  );
}
