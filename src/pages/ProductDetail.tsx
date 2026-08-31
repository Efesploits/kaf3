import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { company } from '../data/company'
import { bySlug, fmtValue, pick, products, shot } from '../data/products'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const { t, lang } = useI18n()
  const product = bySlug.get(slug)
  const [active, setActive] = useState(0)

  // Route changes reuse this component, so the gallery index has to come back
  // to zero or a shorter gallery renders a missing image.
  useEffect(() => setActive(0), [slug])

  const related = useMemo(
    () =>
      product
        ? products
            .filter((p) => p.slug !== product.slug && p.category === product.category)
            .slice(0, 4)
        : [],
    [product],
  )

  if (!product) return <Navigate to="/urunler" replace />

  const gallery = product.gallery ?? []
  const mail = `mailto:${company.email}?subject=${encodeURIComponent(
    `${product.name} — ${lang === 'tr' ? 'Fiyat/teklif talebi' : 'Quotation request'}`,
  )}&body=${encodeURIComponent(
    lang === 'tr'
      ? `Merhaba,\n\n${product.name} ürünü hakkında fiyat ve stok bilgisi almak istiyorum.\n\nİhtiyaç duyulan miktar:\nBitki / alan:\nİl / ilçe:\n\nAd Soyad:\nTelefon:\n`
      : `Hello,\n\nI would like pricing and availability for ${product.name}.\n\nQuantity required:\nCrop / area:\nLocation:\n\nName:\nPhone:\n`,
  )}`

  return (
    <>
      <article className="shell pt-[calc(68px+3rem)] md:pt-[calc(76px+4.5rem)]">
        <Link
          to="/urunler"
          className="link-slide inline-flex items-center gap-2 text-[0.82rem] font-medium"
          style={{ color: 'var(--fg-muted)' }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H6M11.5 6l-6 6 6 6" />
          </svg>
          {t.common.backToProducts}
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* visual */}
          <div className="lg:col-span-5">
            <Reveal
              className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl border p-10"
              style={{ background: 'var(--bg-soft)' }}
            >
              {gallery.length ? (
                <img
                  key={gallery[active]}
                  src={shot(gallery[active])}
                  alt={product.name}
                  className="h-full w-auto max-w-full object-contain"
                  style={{ animation: 'kaf-fade-up .5s var(--ease-out-quint) both' }}
                />
              ) : (
                <div className="relative grid h-full w-full place-items-center text-center">
                  <img
                    src={`${import.meta.env.BASE_URL}brand/kaf-emblem.svg`}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 m-auto w-[68%] opacity-[0.07]"
                  />
                  <div className="relative">
                    <span
                      className="font-display text-[clamp(1.8rem,6vw,3rem)] font-extrabold leading-none tracking-tight"
                      style={{ color: 'var(--fg)' }}
                    >
                      {product.name}
                    </span>
                    {product.catalogPage && (
                      <p className="mt-6 text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: 'var(--fg-faint)' }}>
                        {t.product.catalogPage} {product.catalogPage}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Reveal>

            {gallery.length > 1 && (
              <ul className="mt-4 flex gap-3">
                {gallery.map((g, i) => (
                  <li key={g}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`${product.name} — ${i + 1}/${gallery.length}`}
                      aria-current={i === active}
                      className="grid size-20 place-items-center overflow-hidden rounded-xl p-2 transition-[box-shadow,opacity]"
                      style={{
                        background: 'var(--bg-soft)',
                        opacity: i === active ? 1 : 0.55,
                        boxShadow:
                          i === active
                            ? 'inset 0 0 0 2px var(--accent)'
                            : 'inset 0 0 0 1px var(--line)',
                      }}
                    >
                      <img src={shot(g)} alt="" className="h-full w-auto object-contain" loading="lazy" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="rounded-full px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em]"
                  style={{
                    background: product.series === 'promark' ? 'var(--badge-bg)' : 'var(--bg-sunk)',
                    color: product.series === 'promark' ? 'var(--badge-fg)' : 'var(--fg-muted)',
                  }}
                >
                  {product.series === 'promark' ? t.products.seriesPromark : t.products.seriesKaf}
                </span>
                <Link
                  to={`/urunler?grup=${product.category}`}
                  className="rounded-full border px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {t.categories[product.category]}
                </Link>
              </div>

              <h1 className="mt-5 font-display text-[clamp(2.1rem,6vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                {product.name}
              </h1>

              {product.type && (
                <p className="mt-3 text-[1.02rem]" style={{ color: 'var(--fg-muted)' }}>
                  {pick(product.type, lang)}
                </p>
              )}
            </Reveal>

            {product.tagline && (
              <Reveal delay={70} className="mt-7 border-l-2 pl-5" style={{ borderColor: 'var(--accent)' }}>
                <p className="font-display text-[1.2rem] font-semibold leading-snug tracking-tight md:text-[1.4rem]">
                  {pick(product.tagline, lang)}
                </p>
              </Reveal>
            )}

            {product.series === 'kaf' && (
              <Reveal delay={90} className="mt-7 rounded-xl border p-4 text-[0.86rem] leading-relaxed" style={{ background: 'var(--bg-soft)', color: 'var(--fg-muted)' }}>
                {t.product.catalogNotice}
              </Reveal>
            )}

            <Reveal delay={110} className="mt-7 space-y-4 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {pick(product.description, lang)
                .split(/\n+/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </Reveal>

            {/* analysis */}
            <Reveal delay={150} className="mt-10">
              <h2 className="text-[0.74rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--fg-faint)' }}>
                {t.product.analysis}
              </h2>
              {product.analysis.length ? (
                <>
                  <dl className="mt-4 overflow-hidden rounded-xl border">
                    {product.analysis.map((a, i) => (
                      <div
                        key={a.tr + i}
                        className="flex items-baseline justify-between gap-6 px-5 py-3 text-[0.92rem]"
                        style={{
                          background: i % 2 ? 'transparent' : 'var(--bg-soft)',
                          borderTop: i ? '1px solid var(--line)' : 'none',
                        }}
                      >
                        <dt style={{ color: 'var(--fg-muted)' }}>{pick(a, lang)}</dt>
                        <dd className="tabular shrink-0 font-semibold">{fmtValue(a.value, lang)}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-[0.78rem]" style={{ color: 'var(--fg-faint)' }}>
                    {t.product.analysisNote}
                  </p>
                </>
              ) : (
                <p className="mt-4 rounded-xl border px-5 py-4 text-[0.9rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  {t.product.analysisMissing}
                </p>
              )}
            </Reveal>

            {/* packs + dose */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {product.packs && product.packs.length > 0 && (
                <Reveal delay={180}>
                  <h2 className="text-[0.74rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--fg-faint)' }}>
                    {t.product.packs}
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {product.packs.map((p) => (
                      <li
                        key={p}
                        className="tabular rounded-lg px-3 py-1.5 text-[0.85rem] font-medium"
                        style={{ background: 'var(--bg-sunk)', color: 'var(--fg-muted)' }}
                      >
                        {lang === 'tr' ? p : p.replace(',', '.')}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[0.78rem]" style={{ color: 'var(--fg-faint)' }}>
                    {t.product.packsNote}
                  </p>
                </Reveal>
              )}

              <Reveal delay={210}>
                <h2 className="text-[0.74rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--fg-faint)' }}>
                  {t.product.dose}
                </h2>
                <p className="mt-3 text-[0.88rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  {t.product.doseNote}
                </p>
              </Reveal>
            </div>

            {/* cta */}
            <Reveal delay={240} className="mt-10 rounded-2xl border p-6" style={{ background: 'var(--bg-soft)' }}>
              <div className="flex flex-wrap items-center gap-3">
                <a href={mail} className="btn">
                  {t.product.cta}
                </a>
                <a
                  href={`tel:${company.phoneHref}`}
                  className="btn btn-ghost tabular"
                >
                  {company.phone}
                </a>
              </div>
              <p className="mt-4 text-[0.8rem]" style={{ color: 'var(--fg-faint)' }}>
                {t.product.ctaNote}
              </p>
            </Reveal>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="shell mt-24 md:mt-32">
          <h2 className="font-display text-[1.5rem] font-bold tracking-tight">{t.product.related}</h2>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} as="li" delay={i * 60}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
