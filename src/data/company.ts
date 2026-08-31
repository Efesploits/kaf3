/**
 * Verified company facts.
 *
 * Everything in this file was traced back to a primary source: the company's
 * own archived website, its printed catalogues, its Facebook page, or a public
 * registry (Ministry of Agriculture and Forestry, TÜRKPATENT, trade registry).
 * Claims that could not be traced — certifications, export markets, headcount,
 * fair attendance, mission statements — are deliberately absent.
 */

export const company = {
  brand: 'KAF Tarım',
  legalName: 'Kaf Tohum Gübre Tarım İnş. San. Tic. Ltd. Şti.',
  legalNameFull: 'KAF TOHUM GÜBRE TARIM İNŞAAT SANAYİ TİCARET LİMİTED ŞİRKETİ',
  /** the company's own strapline, from its Facebook page */
  motto: { tr: 'Doğru Tarım için Doğru Ürünler', en: 'The Right Products for the Right Farming' },
  foundedYear: 2010,
  /** trade registry, via Find/Ticaret Sicil Gazetesi */
  foundedOn: { tr: '3 Haziran 2010', en: '3 June 2010' },
  city: 'Antalya',
  district: 'Muratpaşa',

  address: {
    street: 'Doğuyaka Mah. 1216 Sok. No: 7/10',
    district: 'Muratpaşa',
    city: 'Antalya',
    country: { tr: 'Türkiye', en: 'Türkiye' },
    /** Yandex Maps business record */
    lat: 36.896994,
    lng: 30.734005,
  },

  phone: '+90 242 323 62 14',
  phoneHref: '+902423236214',
  email: 'info@kaftarim.com',
  site: 'kaftarim.com',
  facebook: 'https://www.facebook.com/kaftarimkaftarim/',

  nace: '46.75.02',
  naceText: {
    tr: 'Suni gübrelerin toptan ticareti',
    en: 'Wholesale of artificial fertilisers',
  },

  /** Ministry of Agriculture and Forestry, authorised seed enterprise register */
  seedLicence: {
    no: '07.T.0137',
    issued: '02.12.2021',
    validUntil: '02.12.2026',
    label: {
      tr: 'Tohum Üretici Belgesi',
      en: 'Seed Producer Certificate',
    },
    authority: {
      tr: 'T.C. Tarım ve Orman Bakanlığı — Yetkilendirilmiş Tohumcu Kuruluş',
      en: 'Republic of Türkiye, Ministry of Agriculture and Forestry — Authorised Seed Enterprise',
    },
  },

  /** TÜRKPATENT — the ® on the mark. 2024 088583 is the file number. */
  trademark: { no: '2024 088583', name: 'KAFtarım' },

  importSince: 2010,
  exportSince: 2018,

  /** Group manufacturer, from the Promark catalogue hosted on kaftarim.com */
  promark: {
    name: 'Promark Kimya',
    foundedYear: 2022,
    address: 'Cumhuriyet Mah. 20021 Sok. No: 10/A, Aksu / Antalya',
    phone: '+90 850 242 20 02',
    phoneHref: '+908502422002',
    email: 'info@promarkkimya.com',
    site: 'promarkkimya.com',
  },
} as const

/** Exactly the crops printed on the product labels' application tables. */
export const crops = {
  tr: [
    'Çilek', 'Bağ', 'Kivi', 'Muz', 'Narenciye', 'Meyve ağaçları', 'Zeytin',
    'Mısır', 'Ayçiçeği', 'Patates', 'Şeker pancarı', 'Havuç', 'Buğday', 'Arpa',
    'Çeltik', 'Kanola', 'Pamuk', 'Fasulye', 'Nohut', 'Mercimek', 'Soğan', 'Sarımsak',
  ],
  en: [
    'Strawberry', 'Vineyard', 'Kiwi', 'Banana', 'Citrus', 'Fruit trees', 'Olive',
    'Maize', 'Sunflower', 'Potato', 'Sugar beet', 'Carrot', 'Wheat', 'Barley',
    'Rice', 'Canola', 'Cotton', 'Bean', 'Chickpea', 'Lentil', 'Onion', 'Garlic',
  ],
} as const

export interface Milestone {
  year: string
  title: { tr: string; en: string }
  body: { tr: string; en: string }
}

export const milestones: Milestone[] = [
  {
    year: '2005',
    title: { tr: 'Sektörde ilk yıllar', en: 'First years in the sector' },
    body: {
      tr: 'Kurucular Türk tarımının farklı dallarında, özellikle gübre sektöründe çalışmaya başlar.',
      en: 'The founders begin working across Turkish agriculture, and above all in fertilisers.',
    },
  },
  {
    year: '2010',
    title: { tr: 'KAF Tarım kuruluyor', en: 'KAF Tarım is founded' },
    body: {
      tr: 'Şirket 3 Haziran 2010’da Antalya’da kurulur; aynı yıl ithalata başlanır.',
      en: 'The company is registered in Antalya on 3 June 2010 and starts importing the same year.',
    },
  },
  {
    year: '2018',
    title: { tr: 'İhracat', en: 'Export' },
    body: {
      tr: 'KAF Şirketler Grubu bitki besleme ürünlerinde ihracata başlar.',
      en: 'The KAF group of companies begins exporting plant nutrition products.',
    },
  },
  {
    year: '2021',
    title: { tr: 'Tohum Üretici Belgesi', en: 'Seed Producer Certificate' },
    body: {
      tr: 'Tarım ve Orman Bakanlığı nezdinde Yetkilendirilmiş Tohumcu Kuruluş olarak kayıt (07.T.0137).',
      en: 'Registered with the Ministry of Agriculture and Forestry as an authorised seed enterprise (07.T.0137).',
    },
  },
  {
    year: '2022',
    title: { tr: 'Promark Kimya', en: 'Promark Kimya' },
    body: {
      tr: 'Grup, özel bitki besleme ürünlerini kendi üretmek için Antalya’da Promark Kimya’yı kurar.',
      en: 'The group establishes Promark Kimya in Antalya to manufacture its own speciality plant nutrition products.',
    },
  },
  {
    year: '2024',
    title: { tr: 'Marka tescili', en: 'Trademark registration' },
    body: {
      tr: '“KAFtarım” markası TÜRKPATENT nezdinde tescillidir; dosya numarası 2024 088583.',
      en: 'The “KAFtarım” mark is registered with TÜRKPATENT under file number 2024 088583.',
    },
  },
]
