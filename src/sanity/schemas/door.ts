import { defineType, defineField } from 'sanity';

export const doorSchema = defineType({
  name: 'door',
  title: 'Porte',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal' },
    { name: 'desc', title: 'Descriptions' },
    { name: 'tech', title: 'Spécifications' },
    { name: 'config', title: 'Configurateur' },
    { name: 'price', title: 'Prix' },
    { name: 'media', title: 'Visuels' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      group: 'main',
      description: 'Ex. Tolga, Phoenix, Stopper Forza 4',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'serie',
      title: 'Série',
      type: 'string',
      group: 'main',
      description: 'Famille du produit (ex. Tolga, Antea Hotel, Tecnica)',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Marque',
      type: 'string',
      group: 'main',
      description:
        'NDWi = production locale Algérie · NDO = importation. Détermine le badge affiché sur la carte et permet aux clients de filtrer.',
      options: {
        list: [
          { title: 'NDWi — Production Algérie', value: 'ndwi' },
          { title: 'NDO — Importation', value: 'ndo' },
        ],
        layout: 'radio',
      },
      initialValue: 'ndwi',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Porte intérieure', value: 'interieur' },
          { title: 'Porte d’entrée', value: 'entree' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Description courte',
      type: 'localeString',
      group: 'desc',
      description: 'Une phrase qui résume le produit (utilisée sur les cartes catalogue)',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description complète',
      type: 'localeText',
      group: 'desc',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'finishes',
      title: 'Finitions disponibles (legacy, liste libre)',
      type: 'array',
      group: 'tech',
      of: [{ type: 'string' }],
      description:
        'Liste textuelle des finitions — utilisée pour rétro-compat avec le filtrage catalogue. Pour le configurateur 3D, préférer le champ "Finitions configurateur" ci-dessous qui réfère des documents Finition complets (PBR + textures).',
      options: {
        list: [
          { title: 'Laqué mat', value: 'laque-mat' },
          { title: 'Laqué brillant', value: 'laque-brillant' },
          { title: 'Placage bois', value: 'placage-bois' },
          { title: 'Placage noyer', value: 'placage-noyer' },
          { title: 'Placage chêne', value: 'placage-chene' },
          { title: 'Stratifié', value: 'stratifie' },
          { title: 'Vernis naturel', value: 'vernis-naturel' },
        ],
      },
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'thicknesses',
      title: 'Épaisseurs (mm)',
      type: 'array',
      group: 'tech',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '44 mm', value: '44mm' },
          { title: '50 mm', value: '50mm' },
          { title: '55 mm', value: '55mm' },
          { title: '60 mm', value: '60mm' },
          { title: '70 mm', value: '70mm' },
        ],
      },
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'features',
      title: 'Caractéristiques',
      type: 'array',
      group: 'tech',
      of: [{ type: 'localeString' }],
      description: 'Liste de points forts (ex. Technologie 4D, Charnières invisibles)',
    }),
    defineField({
      name: 'fireRating',
      title: 'Résistance feu',
      type: 'string',
      group: 'tech',
      options: {
        list: [
          { title: '—', value: '' },
          { title: 'EI30', value: 'EI30' },
          { title: 'EI60', value: 'EI60' },
        ],
      },
    }),
    defineField({
      name: 'acousticDb',
      title: 'Acoustique (dB)',
      type: 'number',
      group: 'tech',
    }),
    defineField({
      name: 'securityClass',
      title: 'Classe de sécurité',
      type: 'string',
      group: 'tech',
      options: {
        list: [
          { title: '—', value: '' },
          { title: 'RC2', value: 'RC2' },
          { title: 'RC3', value: 'RC3' },
          { title: 'RC4', value: 'RC4' },
        ],
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Image principale (catalogue)',
      type: 'image',
      group: 'media',
      description: "Photo lifestyle pour la fiche produit et le catalogue.",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'configuratorImage',
      title: 'Photo configurateur (vue de face)',
      type: 'image',
      group: 'media',
      description:
        "📸 IMPORTANT : photo qui apparaîtra dans le configurateur 3D. " +
        "Capture LA PORTE FERMÉE EN VUE DE FACE STRICTE, finition neutre claire " +
        "(chêne clair ou blanc cassé idéalement). La couleur du revêtement choisi " +
        "par le client sera appliquée automatiquement par-dessus en overlay (CSS " +
        "mix-blend mode). Pour un rendu pro : fond uni clair ou transparent, " +
        "1200×1600 px mini, JPG/PNG, éclairage doux sans ombres dures. " +
        "Conseils : prendre la porte montée sur place dans un dormant neutre, " +
        "ou la photographier dans un showroom sur fond blanc.",
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      group: 'main',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Nouveau', value: 'nouveau' },
          { title: 'Best-seller', value: 'best-seller' },
          { title: 'Sur-mesure', value: 'sur-mesure' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      group: 'main',
      description: 'Plus petit = en premier dans le catalogue',
      initialValue: 100,
    }),

    // ─── PRIX PUBLIC ─────────────────────────────────────────────────
    defineField({
      name: 'priceFromDZD',
      title: 'Prix public "à partir de" (DZD)',
      type: 'number',
      group: 'price',
      description:
        'Prix indicatif en Dinars Algériens pour la configuration de base. Affiché sur la carte catalogue, la fiche détail et le configurateur. Laisser vide pour "Prix sur demande" (NDO en général).',
      validation: (R) => R.positive(),
    }),

    // ─── COMPOSITION & CERTIFICATIONS ────────────────────────────────
    defineField({
      name: 'composition',
      title: 'Composition technique',
      type: 'localeText',
      group: 'tech',
      description:
        "Description riche de la construction (cadre, structure, encollage, revêtement, chant…). Affichée dans un encart dédié sur la fiche produit.",
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      group: 'tech',
      of: [{ type: 'localeString' }],
      description:
        "Liste courte (ex. 'Anti-effraction Classe 3 RC3', 'Isolation acoustique 35 dB'). Affichée dans un bandeau sombre sur la fiche produit. Laisser vide si pas de certifications.",
    }),
    defineField({
      name: 'thicknessExact',
      title: 'Épaisseur exacte (libellé affiché)',
      type: 'string',
      group: 'tech',
      description: "Ex. '36 mm', '43 mm', '70 mm'. Si renseigné, écrase l'affichage des thicknesses[] sur la fiche.",
    }),

    // ─── DIMENSIONS SUR-MESURE ───────────────────────────────────────
    defineField({
      name: 'dimensionsRange',
      title: 'Plage dimensions sur-mesure (cm)',
      type: 'object',
      group: 'tech',
      description: "Bornes acceptées par l'usine pour cette porte. Le configurateur affichera deux sliders entre ces valeurs.",
      fields: [
        defineField({ name: 'largeurMin', title: 'Largeur min', type: 'number' }),
        defineField({ name: 'largeurMax', title: 'Largeur max', type: 'number' }),
        defineField({ name: 'hauteurMin', title: 'Hauteur min', type: 'number' }),
        defineField({ name: 'hauteurMax', title: 'Hauteur max', type: 'number' }),
      ],
    }),

    // ─── COMPATIBILITÉS CONFIGURATEUR CATALOG-DRIVEN ─────────────────
    defineField({
      name: 'compatibleRevetements',
      title: 'Revêtements compatibles',
      type: 'array',
      group: 'config',
      of: [{ type: 'reference', to: [{ type: 'revetement' }] }],
      description: 'Finitions CPL proposées dans le configurateur pour cette porte (avec code catalogue + pastille hex).',
    }),
    defineField({
      name: 'compatiblePoignees',
      title: 'Poignées compatibles',
      type: 'array',
      group: 'config',
      of: [{ type: 'reference', to: [{ type: 'poignee' }] }],
      description: 'Poignées proposées dans le configurateur pour cette porte.',
    }),
    defineField({
      name: 'compatibleSerrures',
      title: 'Serrures compatibles',
      type: 'array',
      group: 'config',
      of: [{ type: 'reference', to: [{ type: 'serrure' }] }],
      description: 'Serrures proposées (normale, magnétique, multipoint, blindée…).',
    }),
    defineField({
      name: 'compatibleVitrages',
      title: 'Vitrages / variantes panneau compatibles',
      type: 'array',
      group: 'config',
      of: [{ type: 'reference', to: [{ type: 'vitrage' }] }],
      description: 'Porte pleine, vitrée, inserts métal, variantes sur commande.',
    }),
    defineField({
      name: 'compatibleRemplissages',
      title: 'Remplissages compatibles',
      type: 'array',
      group: 'config',
      of: [{ type: 'reference', to: [{ type: 'remplissage' }] }],
      description: 'Nid d\'abeille, tubulaire, acier galvanisé blindé…',
    }),
    defineField({
      name: 'compatibleSens',
      title: 'Sens d’ouverture compatibles',
      type: 'array',
      group: 'config',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Gauche', value: 'gauche' },
          { title: 'Droite', value: 'droite' },
        ],
      },
      initialValue: ['gauche', 'droite'],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'serie', media: 'heroImage', category: 'category' },
    prepare: ({ title, subtitle, media, category }) => ({
      title,
      subtitle: `${subtitle ?? ''}${category ? ' · ' + category : ''}`,
      media,
    }),
  },
  orderings: [
    { title: 'Ordre manuel', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Nom A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
});
