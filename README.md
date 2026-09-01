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

### Ürün görselleri

22 paket görselinin tamamı üreticinin 2560 px'lik orijinal render'larından
hazırlandı ve saydam zeminli WebP olarak `public/products/` altında duruyor.
Üç kova görseli (FLORENTIA, POTATRO, STATERA) kaynakta düz beyaz fon ve hafif
bir zemin gölgesiyle geliyordu. Fon şöyle kaldırıldı: `d = 255 - min(R,G,B)`
alanında gölge en fazla 11'e çıkıyor, kovanın kendi siluetinin en açık pikseli
ise 27; bu yüzden kenardan başlayan ve yalnızca `d <= 14` piksellerde ilerleyen
bir taşma doldurması hem fonu hem gölgeyi yutuyor, ürüne girmeden duruyor.
Beyaz plastiği koruyan şey bağlantısallık: gövdenin ortasındaki parlama da
beyaz, ama kenardan erişilebilir değil. Sapın içinde kalan iki kapalı boşluk
ayrıca tespit edilip saydamlaştırıldı. Silüetteki yumuşak geçiş
`a = d / d_iç` ile geri kazanıldı, yani render'ın kendi kenar yumuşatması
korundu — hiçbir piksel sertçe kesilmedi.

### Katalog filmi

Ürünler sayfasının açılışındaki film (`public/media/`) firmanın sağladığı, EPSILON
şişesi etrafında üretilmiş 8 saniyelik bir 4K render'dır. Sitede ses yok, film
sessiz döngü olarak oynar. Hazırlık:

- **Dikişsiz döngü.** Son 0,75 saniye ilk 0,75 saniyenin üzerine çözülerek
  bindirildi (`xfade`), döngü 7,25 saniyeye indi. Ölçüm: döngünün ilk ve son
  karesi arasındaki ortalama fark 2/255 (codec gürültüsü seviyesi), aynı
  karenin 5. saniyedeki kareyle farkı 27/255.
- **Sürümler.** H.264 1080p (2,1 MB), VP9 Profile 0 1080p (1,2 MB; Profile 1 /
  4:4:4 çoğu donanım çözücüde oynamıyor, bilerek 4:2:0), telefonlar için H.264
  720p (0,9 MB), poster WebP (36 KB). Poster döngünün ilk karesi, böylece
  posterden filme geçiş görünmez.
- **Erişilebilirlik.** Film beş saniyeden uzun hareket olduğu için her zaman bir
  durdur/oynat düğmesi var (WCAG 2.2.2). `prefers-reduced-motion` veya veri
  tasarrufu isteyen tarayıcılar filmi indirmez, posteri ve oynat düğmesini
  görür. Film ekrandan çıkınca duraklar.
- **Okunabilirlik.** Metin filmin üstünde durduğu için kontrast kareye göre
  değişir. Bu yüzden karartma (scrim) ve buzlu paneller, döngünün 174 karesinin
  tamamı üzerinde her metin bölgesinin *en parlak* pikseline karşı ölçüldü
  (`scratchpad/video/contrast.py`): masaüstünde başlık 5,0:1, panel 6,3:1,
  gezinme 5,8:1; telefonda başlık 6,6:1, panel 14:1 — en kötü karede. Başlık
  masaüstünde şişeye değmeyecek şekilde boyutlandırıldı (yazı sağ kenarı
  şişenin sol kenarından 62 px önce biter), açıklama ve düğmeler buzlu bir
  panelde, üst etiket bir kapsülde durur; böylece filmin ortası — şişe, kapak,
  buğu — karartılmadan kalır.
- **Renk.** Filmin yeşil siklorama paleti `--studio-*` token'larına örneklendi;
  ürün kartlarındaki ve ürün sayfasındaki görsel kuyuları aynı stüdyoda durur:
  aynı fon, aynı ışık huzmesi, zeminde yansıma. Tema değişse de bu paletler
  değişmez — bir filmin kendi renk şeması vardır.

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
