'use client';

/**
 * Génération de la fiche technique PDF (A4) à partir de la configuration courante.
 * Embed un screenshot du canvas 3D + récapitulatif texte + QR code de partage.
 */

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import type { DoorConfig3D } from './types';
import type { Finition3D } from '@/sanity/queries/configurator3D';
import { handleVariants } from './types';
import { siteConfig } from '@/lib/site';

interface QuoteData {
  config: DoorConfig3D;
  finition?: Finition3D;
  screenshotDataUrl: string;
  qrDataUrl: string;
  shareUrl: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#f5f2ee',
    fontFamily: 'Helvetica',
    color: '#0a0a0a',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#0a0a0a', paddingBottom: 14 },
  logo: { fontSize: 22, fontWeight: 700 },
  copper: { color: '#b08d57' },
  meta: { fontSize: 9, textAlign: 'right', lineHeight: 1.5 },
  eyebrow: { fontSize: 8, letterSpacing: 1.5, color: '#b08d57', marginBottom: 6 },
  title: { fontSize: 22, marginBottom: 16 },
  body: { flexDirection: 'row', gap: 24 },
  leftCol: { width: '52%' },
  rightCol: { width: '48%' },
  preview: { width: '100%', height: 280, backgroundColor: '#ece6dc', objectFit: 'contain' },
  previewCaption: { fontSize: 7, marginTop: 4, color: '#666' },
  sectionTitle: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 14, marginBottom: 8, color: '#666' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: '#0a0a0a22' },
  label: { fontSize: 9, color: '#444' },
  value: { fontSize: 9, fontWeight: 700 },
  priceBox: { marginTop: 18, backgroundColor: '#0a0a0a', color: '#f5f2ee', padding: 14 },
  priceLabel: { fontSize: 8, letterSpacing: 1.5, color: '#b08d57' },
  priceVal: { fontSize: 24, marginTop: 4, color: '#f5f2ee' },
  qrBlock: { marginTop: 18, alignItems: 'center' },
  qr: { width: 100, height: 100 },
  qrLabel: { fontSize: 7, marginTop: 6, textAlign: 'center', color: '#666' },
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#0a0a0a22', paddingTop: 10, fontSize: 8, color: '#666', flexDirection: 'row', justifyContent: 'space-between' },
});

function QuoteDocument({ config, finition, screenshotDataUrl, qrDataUrl, shareUrl }: QuoteData) {
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const handleName = handleVariants.find((h) => h.slug === config.handle)?.name ?? '—';
  const finitionName = finition?.name ?? config.colorHex;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>NDWI<Text style={styles.copper}>.</Text></Text>
            <Text style={{ fontSize: 8, marginTop: 4, color: '#666' }}>Habitat & Workspace — Oran, Algérie</Text>
          </View>
          <View style={styles.meta}>
            <Text>Fiche technique configuration</Text>
            <Text>Date : {date}</Text>
            <Text>Réf. devis : {shareUrl.split('=').pop()?.slice(0, 10).toUpperCase() ?? '—'}</Text>
          </View>
        </View>

        <Text style={styles.eyebrow}>CONFIGURATEUR — PORTE SUR-MESURE</Text>
        <Text style={styles.title}>Votre porte composée.</Text>

        <View style={styles.body}>
          {/* Visuel */}
          <View style={styles.leftCol}>
            <Image src={screenshotDataUrl} style={styles.preview} />
            <Text style={styles.previewCaption}>Visualisation 3D temps réel — capture configurateur</Text>

            <View style={styles.qrBlock}>
              <Image src={qrDataUrl} style={styles.qr} />
              <Text style={styles.qrLabel}>Scannez pour retrouver cette configuration en ligne</Text>
            </View>
          </View>

          {/* Récap */}
          <View style={styles.rightCol}>
            <Text style={styles.sectionTitle}>Esthétique</Text>
            <View style={styles.row}><Text style={styles.label}>Finition</Text><Text style={styles.value}>{finitionName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Couleur (hex)</Text><Text style={styles.value}>{config.colorHex.toUpperCase()}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Matériau</Text><Text style={styles.value}>{config.material}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Aspect</Text><Text style={styles.value}>{config.finish}</Text></View>

            <Text style={styles.sectionTitle}>Quincaillerie</Text>
            <View style={styles.row}><Text style={styles.label}>Poignée</Text><Text style={styles.value}>{handleName}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Côté charnière</Text><Text style={styles.value}>{config.hingeSide}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Sens d'ouverture</Text><Text style={styles.value}>{config.openingDirection}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Serrure</Text><Text style={styles.value}>{config.hasLock ? 'Oui' : 'Non'}</Text></View>
            <View style={styles.row}><Text style={styles.label}>Vitrage</Text><Text style={styles.value}>{config.hasGlass ? 'Oui' : 'Non'}</Text></View>

            <Text style={styles.sectionTitle}>Dimensions</Text>
            <View style={styles.row}><Text style={styles.label}>Largeur</Text><Text style={styles.value}>{config.widthCm} cm</Text></View>
            <View style={styles.row}><Text style={styles.label}>Hauteur</Text><Text style={styles.value}>{config.heightCm} cm</Text></View>

            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>DEVIS PERSONNALISÉ</Text>
              <Text style={{ fontSize: 11, marginTop: 6, color: '#f5f2ee', lineHeight: 1.5 }}>
                Notre équipe étudie cette configuration et revient vers vous avec un tarif précis sous 24 h.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>{siteConfig.name ?? 'Groupe NDWI'} · {siteConfig.address?.line1 ?? "Oran, Algérie"}</Text>
          <Text>WhatsApp +{siteConfig.whatsapp}</Text>
        </View>
      </Page>
    </Document>
  );
}

/** Génère le PDF côté client et déclenche le download. */
export async function generateQuotePDF(data: QuoteData) {
  const blob = await pdf(<QuoteDocument {...data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ndwi-devis-${Date.now()}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
