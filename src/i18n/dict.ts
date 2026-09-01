/**
 * Site copy, Turkish and English.
 *
 * The Turkish dictionary is the source of truth; `en` is typed against it so a
 * missing key is a compile error rather than a blank on the page.
 */

export const tr = {
  meta: {
    title: 'Kaf Tarım — Bitki Besleme ve Özel Gübre Çözümleri',
    description:
      'Antalya merkezli bitki besleme uzmanı. Yaprak gübreleri, damla sulama gübreleri, organik ürünler ve biyostimülantlar.',
  },

  nav: {
    home: 'Ana Sayfa',
    about: 'Kurumsal',
    products: 'Ürünler',
    contact: 'İletişim',
    quote: 'Teklif Al',
    menu: 'Menü',
    close: 'Kapat',
    skip: 'İçeriğe geç',
  },

  common: {
    all: 'Tümü',
    more: 'Devamı',
    back: 'Geri',
    backToProducts: 'Tüm ürünler',
    loading: 'Yükleniyor',
    theme: { toDark: 'Karanlık moda geç', toLight: 'Aydınlık moda geç' },
    lang: 'Dil',
    langSwitch: 'İngilizceye geç',
    scroll: 'Kaydır',
  },

  hero: {
    eyebrow: 'Antalya · 2010’dan bu yana',
    title: 'Doğru tarım için doğru ürünler.',
    lead:
      'KAF Tarım, 2010’dan bu yana Antalya’dan üreticiye ve bayiye bitki besleme ürünleri ulaştırıyor. Yaprak gübreleri, damla sulama gübreleri, organik ürünler ve biyostimülantlar; bir kısmı seçilmiş ithalat, bir kısmı grup şirketimiz Promark Kimya’da üretim.',
    ctaProducts: 'Ürünleri incele',
    ctaContact: 'Bize ulaşın',
    replay: 'Animasyonu tekrar oynat',
  },

  stats: {
    founded: 'Kuruluş',
    products: 'Katalogdaki ürün',
    export: 'İhracat',
    exportSince: '2018’den bu yana',
    make: 'Üretim',
    makeNote: 'Promark Kimya · Antalya',
    currentRange: 'güncel ürün',
  },

  what: {
    eyebrow: 'Ne yapıyoruz',
    title: 'Dört ayak üstünde duran bir bitki besleme işi.',
    lead:
      'Ürünü seçmek, üretmek, doğru dozda tarlaya ulaştırmak ve arkasında durmak — dördü birden olmadan sonuç alınmıyor.',
    items: [
      {
        k: 'Seçilmiş ithalat',
        v: 'Çiftçiye ulaştırılacak ürünler, dünyanın birçok yerinde uzun ve titiz araştırmalar yapıldıktan sonra belirlenir ve ithal edilir.',
      },
      {
        k: 'Kendi üretimimiz',
        v: 'Grup bünyesindeki Promark Kimya 2022’den bu yana özel bitki besleme ürünlerini hammadde seçiminden ambalaja kadar kendi üretiyor.',
      },
      {
        k: 'Bayi ve üretici desteği',
        v: 'Geniş dağıtım ve destek ağıyla bayilerin ve çiftçilerin yanında olmak, kuruluştan bu yana işin merkezinde.',
      },
      {
        k: 'İhracat',
        v: 'KAF Şirketler Grubu 2010’dan bu yana ithalat, 2018’den bu yana ihracat yapıyor.',
      },
    ],
  },

  problem: {
    eyebrow: 'Sorundan çözüme',
    title: 'Tarlada ne görüyorsunuz?',
    lead:
      'Promark serisindeki her ürün belirli bir sorun için formüle edildi. Gördüğünüz belirtiyi seçin, karşılığındaki ürüne bakın.',
    pick: 'Bir sorun seçin',
    seeProduct: 'Ürüne git',
  },

  families: {
    eyebrow: 'Ürün aileleri',
    title: 'Beş ana grup.',
    countSuffix: 'ürün',
  },

  featured: {
    eyebrow: 'Promark serisi',
    title: 'Güncel ürünler',
    lead: 'Grup şirketimiz Promark Kimya’da üretilen, hâlihazırda satışta olan seri.',
    all: 'Tüm ürünleri gör',
  },

  aboutTeaser: {
    eyebrow: 'Kurumsal',
    title: '2005’ten gelen bir birikim, 2010’da kurulan bir şirket.',
    cta: 'Kurumsal sayfası',
  },

  contactTeaser: {
    eyebrow: 'İletişim',
    title: 'Ürünler siteden satılmıyor.',
    lead:
      'Fiyat, stok ve size en yakın bayi için doğrudan bizimle görüşün. Ürün seçimi ve uygulama planı için de bize danışabilirsiniz.',
    cta: 'İletişime geç',
  },

  about: {
    eyebrow: 'Kurumsal',
    title: 'KAF Tarım',
    lead: 'Antalya merkezli bitki besleme ve tohumculuk şirketi.',
    storyTitle: 'Hikâyemiz',
    /** verbatim from the company's own About page, unchanged 2011–2016 */
    story: [
      '2005 yılından beri aktif olarak Türk Tarımı’nın farklı birçok dalında çalışmış ve uzmanlaşmış olan kurucularımız, özellikle gübre sektöründe Türk çiftçisinin ve bayisinin yanında ve hizmetinde olmuşlardır.',
      'Aynı oluşum sektördeki deneyimiyle en kaliteli ithal ve yerli ürün gruplarını, en iyi teknik destekle, bayilerine ve çiftçilerine ulaştırabilmek için 2010 yılında KAF TARIM’ın kuruluşunu Antalya’da gerçekleştirmişlerdir.',
      'KAF TARIM çiftçisine ulaştıracağı ürünleri, dünyanın birçok yerinde uzun ve titiz araştırmalar yaptıktan sonra belirleyip; en kaliteli ürünlerin ithalatını yapmaktadır. Aynı zamanda yerli ürün gruplarında da köklü firmaların en kaliteli ürünlerini ürün yelpazesine koyarak pazara sunmaktadır.',
      'KAF TARIM bu ideallerle bundan sonra da geniş dağıtım ve destek ağıyla, kalitesi ve güvenirliğiyle, Türk çiftçisinin ve bayisinin yanında olacak ve yoluna devam edecektir.',
    ],
    storySource: 'Şirketin kendi kurumsal tanıtım metni.',
    timelineTitle: 'Kilometre taşları',
    promarkTitle: 'Promark Kimya',
    /** verbatim from the Promark catalogue */
    promark: [
      'KAF Şirketler Grubu bünyesinde bulunan Promark Kimya 2022 yılında Antalya’da özel bitki besleme ürünleri üretmek için kurulmuştur. 2010 yılından beri ithalat ve 2018 yılından beri ihracat yapan KAF Şirketler Grubu bitki besleme ürünleri üzerine olan tecrübesinden Promark Kimya’nın kuruluşundan itibaren hammadde seçimine ve ürün üretimine kadar olan her safhada faydalanmıştır.',
      'Promark Kimya “En İyisi” prensibi ile yola çıkmış, sonuç odaklı, kendine özgü ve pazarda lider ürünler üretmiştir. Hammaddeden ambalaja kadar kalite odaklı çalışarak, üreticilerimize en kaliteli ürünleri ulaştırma gayreti içerisinde çalışılmaktadır. Sektör tecrübeleri neticesinde üretilecek ürünler tespit edilerek ürünler ayrıntılı ve sürekli bir ARGE sürecinden geçirilmekte, başarılı olan ürünler üretim planlamasına alınmaktadır. Promark Kimya benimsediği kalite standartlarından vazgeçmeden, sektörde en iyisini üretmek üzere yoluna devam edecektir.',
    ],
    promarkSource: 'Promark Kimya ürün kataloğu.',
    legalTitle: 'Kurumsal bilgiler',
    legal: {
      name: 'Ticaret unvanı',
      nace: 'Faaliyet kodu',
      licence: 'Tohum Üretici Belgesi',
      trademark: 'Marka tescili',
      founded: 'Kuruluş',
      address: 'Merkez adres',
    },
    catalogTitle: '2019 Ürün Kataloğu',
    catalogBody:
      'KAF Tarım’ın basılı ürün kataloğu. 24 sayfa; her ürünün garanti edilen içeriği ve tanıtım metniyle.',
    catalogCta: 'Kataloğu indir (PDF)',
  },

  products: {
    eyebrow: 'Ürün kataloğu',
    title: 'Yapraktan köke, {n} ürün.',
    lead:
      'Yaprak gübreleri, damla sulama gübreleri, organik girdiler ve biyostimülantlar — Promark serisi ile KAF katalog serisi tek listede. Ürünler bu siteden satılmaz; fiyat ve stok için bizimle iletişime geçin.',
    heroCta: 'Kataloğa göz at',
    heroQuote: 'Teklif iste',
    statProducts: 'ürün',
    statGroups: 'ürün grubu',
    statSeries: 'seri',
    videoProduct: 'Videodaki ürün',
    videoPause: 'Videoyu durdur',
    videoPlay: 'Videoyu oynat',
    filterSeries: 'Seri',
    filterCategory: 'Grup',
    resultsOne: 'ürün',
    resultsMany: 'ürün',
    empty: 'Bu filtrelerle eşleşen ürün yok.',
    clear: 'Filtreleri temizle',
    listLabel: 'Ürün listesi',
    search: 'Ürün ara',
    seriesPromark: 'Promark serisi',
    seriesKaf: 'KAF katalog serisi',
    seriesPromarkNote: 'Grup şirketimiz Promark Kimya üretimi, hâlihazırda satışta.',
    seriesKafNote: 'KAF Tarım 2019 basılı ürün kataloğunda yer alan ürünler.',
  },

  product: {
    analysis: 'Garanti edilen içerik',
    analysisNote: 'Değerler kütlece (w/w) verilmiştir.',
    analysisMissing:
      'Bu ürün için garanti edilen içerik tablosu kaynak katalogda yer almıyor. Güncel etiket bilgisi için bize ulaşın.',
    packs: 'Ambalajlar',
    packsNote: 'Katalogda yalnızca ambalaj sayısı verilmiştir; birim için bize danışın.',
    type: 'Ürün tipi',
    series: 'Seri',
    category: 'Grup',
    dose: 'Uygulama dozu',
    doseNote:
      'Kullanım dozları bitkiye ve döneme göre değişir ve ambalaj etiketinde yer alır. Uygulama planı için bize danışabilirsiniz.',
    cta: 'Bu ürün için teklif iste',
    ctaNote: 'Ürünler siteden satılmaz. Fiyat ve stok için iletişime geçin.',
    related: 'Aynı gruptaki ürünler',
    catalogPage: 'Katalog sayfası',
    catalogNotice:
      'Bu ürün bilgisi KAF Tarım’ın 2019 basılı kataloğundan alınmıştır. Güncel içerik, ambalaj ve tedarik durumu için bize danışın.',
  },

  categories: {
    organik: 'Organik & Biyostimülant',
    npk: 'Makro Besin (NPK)',
    kalsiyum: 'Kalsiyum',
    mikro: 'Mikro Element & Şelat',
    ozel: 'Özel Ürünler',
  },

  categoryDesc: {
    organik: 'Fulvik asit, aminoasit, deniz yosunu ve organik madde kaynaklı ürünler.',
    npk: 'Azot, fosfor ve potasyum içeren sıvı gübre çözeltileri.',
    kalsiyum: 'Hücre çeperini güçlendiren kalsiyum kaynakları.',
    mikro: 'Çinko, demir, bakır, mangan ve bor içeren şelatlı ürünler.',
    ozel: 'Bitki gelişim düzenleyiciler, aktivatörler ve özel formülasyonlar.',
  },

  contact: {
    eyebrow: 'İletişim',
    title: 'Bize ulaşın',
    lead:
      'Ürün seçimi, fiyat, stok ve bayilik için doğrudan bizimle görüşebilirsiniz. Mesai saatlerinde telefonla ulaşmak en hızlısı.',
    officeTitle: 'Merkez ofis',
    factoryTitle: 'Üretim — Promark Kimya',
    directions: 'Yol tarifi al',
    formTitle: 'Mesaj gönderin',
    formNote:
      'Form, mesajınızı varsayılan e-posta uygulamanızda hazırlar. Dilerseniz doğrudan telefonla da ulaşabilirsiniz.',
    name: 'Ad Soyad',
    company: 'Firma / İşletme',
    email: 'E-posta',
    phone: 'Telefon',
    subject: 'Konu',
    message: 'Mesajınız',
    subjects: {
      quote: 'Fiyat / teklif',
      dealer: 'Bayilik',
      technical: 'Teknik destek',
      other: 'Diğer',
    },
    send: 'E-posta ile gönder',
    required: 'Zorunlu alan',
    requiredNote: 'Yıldızlı (*) alanlar zorunludur.',
    opening: 'E-posta uygulamanız açılıyor…',
    whatsapp: 'WhatsApp’tan yaz',
    call: 'Telefonla ara',
    mail: 'E-posta gönder',
  },

  footer: {
    tagline: 'Bitki besleme ve tohumculuk. Antalya.',
    nav: 'Site haritası',
    corporate: 'Kurumsal',
    contact: 'İletişim',
    catalog: 'Katalog',
    rights: 'Tüm hakları saklıdır.',
    note: 'Bu sitedeki ürün bilgileri üretici etiketleri ve şirket kataloglarından derlenmiştir.',
  },

  notFound: {
    title: 'Sayfa bulunamadı',
    lead: 'Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.',
    cta: 'Ana sayfaya dön',
  },
} as const

/**
 * `tr` is declared `as const` so keys are exhaustive, but that also freezes
 * every value into a string literal type. Widening it back gives the English
 * dictionary the same shape without demanding identical wording.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { -readonly [K in keyof T]: Widen<T[K]> }

type Dict = Widen<typeof tr>

export const en: Dict = {
  meta: {
    title: 'Kaf Tarım — Plant Nutrition and Speciality Fertilisers',
    description:
      'Plant nutrition specialist based in Antalya, Türkiye. Foliar fertilisers, fertigation products, organic inputs and biostimulants.',
  },

  nav: {
    home: 'Home',
    about: 'Company',
    products: 'Products',
    contact: 'Contact',
    quote: 'Request a quote',
    menu: 'Menu',
    close: 'Close',
    skip: 'Skip to content',
  },

  common: {
    all: 'All',
    more: 'Read more',
    back: 'Back',
    backToProducts: 'All products',
    loading: 'Loading',
    theme: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
    lang: 'Language',
    langSwitch: 'Türkçeye geç',
    scroll: 'Scroll',
  },

  hero: {
    eyebrow: 'Antalya · since 2010',
    title: 'The right products for the right farming.',
    lead:
      'Since 2010, KAF Tarım has supplied growers and dealers across Türkiye with plant nutrition products from Antalya: foliar fertilisers, fertigation products, organic inputs and biostimulants — some carefully sourced abroad, some made in our group company Promark Kimya.',
    ctaProducts: 'Browse products',
    ctaContact: 'Get in touch',
    replay: 'Replay the animation',
  },

  stats: {
    founded: 'Founded',
    products: 'Products in catalogue',
    export: 'Export',
    exportSince: 'since 2018',
    make: 'Manufacturing',
    makeNote: 'Promark Kimya · Antalya',
    currentRange: 'in the current range',
  },

  what: {
    eyebrow: 'What we do',
    title: 'A plant nutrition business standing on four legs.',
    lead:
      'Choosing the product, making it, getting it to the field at the right rate and standing behind it — results need all four.',
    items: [
      {
        k: 'Selective importing',
        v: 'Products are chosen and imported only after long, careful evaluation in many parts of the world.',
      },
      {
        k: 'Our own manufacturing',
        v: 'Promark Kimya, part of the group, has been producing speciality plant nutrition products in-house since 2022 — from raw material selection through to packaging.',
      },
      {
        k: 'Dealer and grower support',
        v: 'Standing beside dealers and growers with a wide distribution and support network has been at the centre of the business since day one.',
      },
      {
        k: 'Export',
        v: 'The KAF group of companies has been importing since 2010 and exporting since 2018.',
      },
    ],
  },

  problem: {
    eyebrow: 'From symptom to solution',
    title: 'What are you seeing in the field?',
    lead:
      'Every product in the Promark range was formulated for a specific problem. Pick the symptom you see and look at the product behind it.',
    pick: 'Pick a symptom',
    seeProduct: 'Go to product',
  },

  families: {
    eyebrow: 'Product families',
    title: 'Five main groups.',
    countSuffix: 'products',
  },

  featured: {
    eyebrow: 'Promark range',
    title: 'Current products',
    lead: 'The range currently on sale, manufactured by our group company Promark Kimya.',
    all: 'See all products',
  },

  aboutTeaser: {
    eyebrow: 'Company',
    title: 'Experience that starts in 2005, a company founded in 2010.',
    cta: 'About the company',
  },

  contactTeaser: {
    eyebrow: 'Contact',
    title: 'Products are not sold through this site.',
    lead:
      'Talk to us directly for pricing, stock and your nearest dealer. We are also happy to advise on product selection and application planning.',
    cta: 'Contact us',
  },

  about: {
    eyebrow: 'Company',
    title: 'KAF Tarım',
    lead: 'A plant nutrition and seed company based in Antalya.',
    storyTitle: 'Our story',
    story: [
      'Our founders have worked in and specialised across many branches of Turkish agriculture since 2005, serving Turkish growers and dealers above all in the fertiliser sector.',
      'Drawing on that experience, in 2010 they founded KAF TARIM in Antalya, to bring the highest quality imported and domestic product groups to their dealers and growers with the best technical support.',
      'KAF TARIM selects the products it brings to the grower only after long and careful research in many parts of the world, and imports the highest quality among them. It also brings established domestic manufacturers’ best products into its range.',
      'With these principles, KAF TARIM will continue to stand beside Turkish growers and dealers with a wide distribution and support network, and with the quality and reliability of its products.',
    ],
    storySource: 'The company’s own corporate text.',
    timelineTitle: 'Milestones',
    promarkTitle: 'Promark Kimya',
    promark: [
      'Promark Kimya, part of the KAF group of companies, was founded in Antalya in 2022 to manufacture speciality plant nutrition products. The group — importing since 2010 and exporting since 2018 — has applied its experience in plant nutrition at every stage from raw material selection to production since the company was set up.',
      'Promark Kimya set out on the principle of “the best”, producing result-driven, distinctive products that lead their market. Working quality-first from raw material to packaging, the company aims to deliver the highest quality products to growers. Products are identified from sector experience, put through a detailed and continuous R&D process, and those that succeed are taken into production planning. Promark Kimya will continue on its way without compromising the quality standards it has adopted.',
    ],
    promarkSource: 'Promark Kimya product catalogue.',
    legalTitle: 'Corporate details',
    legal: {
      name: 'Registered name',
      nace: 'Activity code',
      licence: 'Seed Producer Certificate',
      trademark: 'Trademark',
      founded: 'Founded',
      address: 'Head office',
    },
    catalogTitle: '2019 Product Catalogue',
    catalogBody:
      'KAF Tarım’s printed product catalogue — 24 pages, with the guaranteed analysis and description of every product.',
    catalogCta: 'Download the catalogue (PDF)',
  },

  products: {
    eyebrow: 'Product catalogue',
    title: 'Leaf to root, {n} products.',
    lead:
      'Foliar fertilisers, fertigation products, organic inputs and biostimulants — the Promark range and the KAF catalogue range in one list. Products are not sold through this site; contact us for pricing and availability.',
    heroCta: 'Browse the catalogue',
    heroQuote: 'Request a quote',
    statProducts: 'products',
    statGroups: 'product groups',
    statSeries: 'ranges',
    videoProduct: 'Product in the video',
    videoPause: 'Pause video',
    videoPlay: 'Play video',
    filterSeries: 'Range',
    filterCategory: 'Group',
    resultsOne: 'product',
    resultsMany: 'products',
    empty: 'No products match these filters.',
    clear: 'Clear filters',
    listLabel: 'Product list',
    search: 'Search products',
    seriesPromark: 'Promark range',
    seriesKaf: 'KAF catalogue range',
    seriesPromarkNote: 'Manufactured by our group company Promark Kimya, currently on sale.',
    seriesKafNote: 'Products listed in KAF Tarım’s 2019 printed catalogue.',
  },

  product: {
    analysis: 'Guaranteed analysis',
    analysisNote: 'Values are given by weight (w/w).',
    analysisMissing:
      'No guaranteed analysis table is given for this product in the source catalogue. Please contact us for the current label information.',
    packs: 'Pack sizes',
    packsNote: 'The catalogue gives the pack figure only; contact us to confirm the unit.',
    type: 'Product type',
    series: 'Range',
    category: 'Group',
    dose: 'Application rate',
    doseNote:
      'Rates vary by crop and growth stage and are printed on the pack. Get in touch and we will help you build an application plan.',
    cta: 'Request a quote for this product',
    ctaNote: 'Products are not sold through this site. Contact us for pricing and stock.',
    related: 'Others in this group',
    catalogPage: 'Catalogue page',
    catalogNotice:
      'This product information comes from KAF Tarım’s 2019 printed catalogue. Please contact us for the current formulation, pack sizes and availability.',
  },

  categories: {
    organik: 'Organic & Biostimulant',
    npk: 'Macronutrient (NPK)',
    kalsiyum: 'Calcium',
    mikro: 'Trace Element & Chelate',
    ozel: 'Speciality Products',
  },

  categoryDesc: {
    organik: 'Products based on fulvic acid, amino acids, seaweed and organic matter.',
    npk: 'Liquid fertiliser solutions supplying nitrogen, phosphorus and potassium.',
    kalsiyum: 'Calcium sources that strengthen the cell wall.',
    mikro: 'Chelated products supplying zinc, iron, copper, manganese and boron.',
    ozel: 'Plant growth regulators, activators and speciality formulations.',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Get in touch',
    lead:
      'Talk to us directly about product selection, pricing, stock and dealership. A phone call during office hours is the quickest route.',
    officeTitle: 'Head office',
    factoryTitle: 'Manufacturing — Promark Kimya',
    directions: 'Get directions',
    formTitle: 'Send a message',
    formNote:
      'The form opens a pre-filled message in your default email application. You are also welcome to call us directly.',
    name: 'Full name',
    company: 'Company / farm',
    email: 'Email',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Your message',
    subjects: {
      quote: 'Pricing / quote',
      dealer: 'Dealership',
      technical: 'Technical support',
      other: 'Other',
    },
    send: 'Send by email',
    required: 'Required',
    requiredNote: 'Fields marked with an asterisk (*) are required.',
    opening: 'Opening your email application…',
    whatsapp: 'Message on WhatsApp',
    call: 'Call us',
    mail: 'Send an email',
  },

  footer: {
    tagline: 'Plant nutrition and seed. Antalya, Türkiye.',
    nav: 'Sitemap',
    corporate: 'Company',
    contact: 'Contact',
    catalog: 'Catalogue',
    rights: 'All rights reserved.',
    note: 'Product information on this site is compiled from manufacturer labels and company catalogues.',
  },

  notFound: {
    title: 'Page not found',
    lead: 'The page you are looking for may have moved, or may never have existed.',
    cta: 'Back to home',
  },
}

export type Lang = 'tr' | 'en'
export const dict: Record<Lang, Dict> = { tr, en }
