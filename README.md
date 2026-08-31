# Kaf Tarım — kurumsal web sitesi

Kaf Tohum Gübre Tarım İnş. San. Tic. Ltd. Şti. (KAF Tarım, Antalya) için kurumsal
tanıtım ve ürün kataloğu sitesi. Ürünler siteden satılmaz; iletişim üzerinden
sipariş alınır.

**Öne çıkanlar**

- Landing’de markanın **gerçek logosu 3 boyutlu** olarak canlanıyor: amblem açılıyor,
  ardından “KAF tarım” yazısı amblemin içinden sağa doğru harf harf çıkıyor.
- Aynı 3B marka sitenin beş yerinde daha, farklı hareketlerle görünüyor:
  “Ne yapıyoruz” bölümünde **sağdan girip kaydırdıkça alçalan ve dönen** arka
  plan amblemi, kurumsal bloğunda **kaydırmaya bağlı dönen** amblem, Kurumsal
  başlığında ve İletişim sayfasında **yavaşça salınan** amblem, 404 sayfasında da
  aynısı. Her biri ekrana yaklaşınca kuruluyor, uzaktayken WebGL bağlamı açmıyor.
- Türkçe / İngilizce tam çeviri. İlk açılışta sistem diline göre seçilir.
- Aydınlık / karanlık tema. İlk açılışta işletim sistemi tercihine göre seçilir.
- 42 ürün: 13’ü hâlihazırda satışta olan Promark serisi (ürün fotoğraflarıyla),
  29’u KAF Tarım 2019 basılı kataloğundan.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:5173/kaf3/
npm run build
npm run preview
```

`BASE_PATH` ortam değişkeni dağıtım kökünü belirler. GitHub Pages için `/kaf3/`
(varsayılan); kendi alan adında yayınlarken `BASE_PATH=/ npm run build`.

## Yayınlama

`main` dalına push edildiğinde `.github/workflows/deploy.yml` siteyi derleyip
GitHub Pages’e yükler. Depo ayarlarında **Settings → Pages → Source: GitHub Actions**
seçili olmalıdır.

## Mimari

```
src/
  lib/logo3d.ts        3B logo sahnesi (three.js) — geometri, malzeme, koreografi
  components/Logo3D    sahneyi tembel kuran React sarmalayıcısı (mod/spin/scroll)
  assets/kaf-logo.svg  logonun vektör kaynağı (aşağıya bakınız)
  data/
    company.ts         doğrulanmış kurumsal bilgiler
    products.tr.json   42 ürünün Türkçe verisi
    products.en.json   İngilizce çeviriler + terim sözlüğü
    products.ts        iki kaynağı birleştiren tipli erişim katmanı
  i18n/                dil bağlamı ve site metinleri
  components/          Header, Footer, ProductCard, Reveal, HeroLogo3D…
  pages/               Home, About, Products, ProductDetail, Contact
```

### Logo neden “birebir”

Sitedeki logo bir yeniden çizim değil. Şirketin kendi basılı ürün kataloğunun
(2019) PDF’i sayfa içerik akışı düzeyinde çözülüp vektör konturları çıkarıldı;
amblem, “KAF”, “tarım”, ® ve alt satırın eğrileri markanın kullandığı eğrilerin
ta kendisi. Renkler ve gradyanlar referans logo görselinden şekil şekil
örneklendi, hizalama maske örtüşmesi (IoU ≈ 0.94) ile optimize edildi.

3B tarafta bu vektör `SVGLoader` ile şekillere, oradan `ExtrudeGeometry` ile
hacme dönüşüyor. Sahne iki modda çalışıyor: `lockup` tam kilitlenmiş marka
(hero), `emblem` yalnızca yuvarlak amblem (diğer yerler) — ikincisi 18 yerine
6 parça kuruyor, dolayısıyla çok daha hafif. Gradyanlar köşe renklerine (vertex colors) pişiriliyor, böylece
doku (texture) olmadan da marka renkleri birebir çıkıyor. Kelime markası her
harfi ayrı bir mesh olacak şekilde bölünüyor; iki kırpma düzlemi (biri amblemin
sağ kenarında sabit, biri sağa doğru süpüren) harflerin amblemin içinden
çıkıyormuş gibi görünmesini sağlıyor.

WebGL yoksa veya `prefers-reduced-motion` açıksa düz vektör logo gösterilir.

### İçerik kaynakları

Sitedeki her kurumsal bilgi birincil bir kaynağa dayanır: şirketin arşivlenmiş
kendi web sitesi (2011–2016), 2019 basılı ürün kataloğu, Promark Kimya kataloğu,
kaftarim.com’un WordPress REST API’si, Facebook sayfası ve resmî kayıtlar
(Tarım ve Orman Bakanlığı yetkilendirilmiş tohumcu kuruluş listesi, TÜRKPATENT,
ticaret sicili). Doğrulanamayan bilgiler — sertifikalar, ihracat yapılan ülkeler,
çalışan sayısı, fuar katılımı — bilinçli olarak siteye konmadı.

### Ürün metinlerinde yapılan düzenlemeler

Ürün açıklamaları firmanın kendi kataloğundan ve etiketlerinden alındı. İki tür
düzenleme yapıldı ve ikisi de bilinçli:

1. **Dizgi düzeltmeleri.** Basılı katalogdaki yazım hataları düzeltildi
   (`fotozentez` → `fotosentez`, `sebest` → `serbest`, eksik boşluklar vb.).
   Anlam değiştirilmedi.
2. **Çıkarımlar.** Bir gübre ürünü, bitki koruma ürünü beyanı taşıyamaz. Bu
   nedenle isimlendirilmiş hastalık etmenlerine karşı koruma iddiaları
   (PHYLON COPER, FORALEX, ALEXOL) ve ispatlanamayan karşılaştırmalı iddialar
   (“4 kat hızlıdır”, “kalıntı bırakmaz”, “iki kat daha etkilidir”) metinlerden
   çıkarıldı. Bu ürünlerin güncel Bakanlık onaylı etiket metinleri firmadan
   temin edilip yerine konabilir.

Ambalaj bilgisinde katalog yalnızca bir sayı veriyor (birim yazmıyor); bu sayı
olduğu gibi gösteriliyor ve yanına birimin katalogda belirtilmediği notu
düşülüyor.

## Lisans

Marka, logo, ürün adları, ürün görselleri ve katalog metinleri
Kaf Tohum Gübre Tarım İnş. San. Tic. Ltd. Şti.’ye aittir.
