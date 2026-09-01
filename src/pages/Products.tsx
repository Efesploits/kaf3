import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fill, useI18n } from '../i18n'
import {
  CATEGORY_ORDER,
  bySlug,
  pick,
  products,
  type CategoryId,
  type Series,
} from '../data/products'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import VideoHero from '../components/VideoHero'

type SeriesFilter = Series | 'all'
type CatFilter = CategoryId | 'all'

/** The product the film was shot around. */
const FILM_PRODUCT = 'epsilon'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h13M12.5 6l6 6-6 6" />
    </svg>
  )
}

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.85rem] font-medium transition-all duration-400"
      style={{
        background: active ? 'var(--fg)' : 'transparent',
        color: active ? 'var(--bg)' : 'var(--fg-muted)',
        borderColor: active ? 'var(--fg)' : 'var(--line)',
      }}
    >
      {children}
      {count !== undefined && (
        <span className="tabular text-[0.72rem] opacity-60">{count}</span>
      )}
    </button>
  )
}

const rise = (delay: number) => ({
  animation: `kaf-fade-up .9s var(--ease-out-quint) ${delay}s both`,
})

export default function Products() {
  const { t, lang } = useI18n()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')

  // Anything unexpected in the URL falls back to "all" rather than showing an
  // empty grid under the wrong provenance note.
  const rawSeries = params.get('seri')
  const rawCat = params.get('grup')
  const series: SeriesFilter =
    rawSeries === 'promark' || rawSeries === 'kaf' ? rawSeries : 'all'
  const cat: CatFilter = CATEGORY_ORDER.includes(rawCat as CategoryId)
    ? (rawCat as CategoryId)
    : 'all'

  const setFilter = (key: 'seri' | 'grup', value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase(lang)
    return products.filter((p) => {
      if (series !== 'all' && p.series !== series) return false
      if (cat !== 'all' && p.category !== cat) return false
      if (!needle) return true
      const hay = [p.name, pick(p.type, lang), pick(p.description, lang)]
        .join(' ')
        .toLocaleLowerCase(lang)
      return hay.includes(needle)
    })
  }, [series, cat, q, lang])

  const catCounts = useMemo(() => {
    const base = products.filter((p) => (series === 'all' ? true : p.series === series))
    const out: Record<string, number> = {}
    for (const c of CATEGORY_ORDER) out[c] = base.filter((p) => p.category === c).length
    return out
  }, [series])

  const dirty = series !== 'all' || cat !== 'all' || q !== ''
  const filmProduct = bySlug.get(FILM_PRODUCT)
  const seriesCount = new Set(products.map((p) => p.series)).size

  const stats: [number, string][] = [
    [products.length, t.products.statProducts],
    [CATEGORY_ORDER.length, t.products.statGroups],
    [seriesCount, t.products.statSeries],
  ]

  return (
    <>
      <VideoHero
        src="hero"
        poster={`${import.meta.env.BASE_URL}media/hero-poster.webp`}
        aside={
          filmProduct && (
            <Link
              to={`/urunler/${filmProduct.slug}`}
              className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3.5 text-[0.78rem] font-medium transition-opacity hover:opacity-85"
              style={{ color: 'var(--fg)' }}
            >
              <span
                aria-hidden="true"
                className="grid size-7 place-items-center rounded-full text-[0.6rem] font-bold uppercase tracking-[0.08em]"
                style={{ background: 'var(--badge-bg)', color: 'var(--badge-fg)' }}
              >
                {filmProduct.series === 'promark' ? 'P' : 'K'}
              </span>
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--fg-faint)' }}>
                {t.products.videoProduct}
              </span>
              <span className="font-display font-bold tracking-tight">{filmProduct.name}</span>
              <Arrow />
            </Link>
          )
        }
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow glass rounded-full px-3.5 py-1.5" style={rise(0.15)}>
              {t.products.eyebrow}
            </p>
            {/* Sized to stop short of the bottle on every width from lg up;
                the film's subject stays clear of the headline. */}
            <h1
              className="mt-5 max-w-[12ch] font-display text-[clamp(2.4rem,5vw,4.1rem)] font-extrabold leading-[0.98] tracking-[-0.035em]"
              style={rise(0.3)}
            >
              {fill(t.products.title, { n: products.length })}
            </h1>
          </div>

          <div className="glass rounded-2xl p-5 md:p-6 lg:col-span-5" style={rise(0.5)}>
            <p className="max-w-xl text-[0.98rem] leading-relaxed md:text-[1.02rem]">
              {t.products.lead}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#katalog" className="btn">
                {t.products.heroCta} <Arrow />
              </a>
              <Link to="/iletisim" className="btn btn-ghost">
                {t.products.heroQuote}
              </Link>
            </div>
          </div>
        </div>

        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6 md:mt-12" style={rise(0.85)}>
          {stats.map(([n, label]) => (
            <div key={label} className="flex flex-row-reverse items-baseline gap-2">
              <dt className="text-[0.74rem] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--fg-faint)' }}>
                {label}
              </dt>
              <dd className="tabular font-display text-[1.7rem] font-extrabold leading-none tracking-tight">
                {n}
              </dd>
            </div>
          ))}
        </dl>
      </VideoHero>

      <section id="katalog" className="filter-rail border-y py-4">
        <div className="shell flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--fg-faint)' }}>
              {t.products.filterSeries}
            </span>
            <Chip active={series === 'all'} onClick={() => setFilter('seri', 'all')} count={products.length}>
              {t.common.all}
            </Chip>
            <Chip
              active={series === 'promark'}
              onClick={() => setFilter('seri', 'promark')}
              count={products.filter((p) => p.series === 'promark').length}
            >
              {t.products.seriesPromark}
            </Chip>
            <Chip
              active={series === 'kaf'}
              onClick={() => setFilter('seri', 'kaf')}
              count={products.filter((p) => p.series === 'kaf').length}
            >
              {t.products.seriesKaf}
            </Chip>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--fg-faint)' }}>
              {t.products.filterCategory}
            </span>
            <Chip active={cat === 'all'} onClick={() => setFilter('grup', 'all')}>
              {t.common.all}
            </Chip>
            {CATEGORY_ORDER.map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setFilter('grup', c)} count={catCounts[c]}>
                {t.categories[c]}
              </Chip>
            ))}

            <label className="ml-auto flex items-center gap-2 rounded-full border px-4 py-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent)]">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--fg-faint)' }}>
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.products.search}
                className="w-36 bg-transparent text-[0.85rem] outline-none placeholder:text-[var(--fg-faint)] sm:w-48"
                aria-label={t.products.search}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="shell py-12 md:py-16">
        <h2 className="sr-only">{t.products.listLabel}</h2>
        <div className="mb-8 flex items-center justify-between gap-4">
          <p role="status" aria-live="polite" className="tabular text-[0.85rem]" style={{ color: 'var(--fg-muted)' }}>
            {list.length} {list.length === 1 ? t.products.resultsOne : t.products.resultsMany}
          </p>
          {dirty && (
            <button
              type="button"
              onClick={() => {
                setParams(new URLSearchParams(), { replace: true })
                setQ('')
              }}
              className="link-slide text-[0.82rem] font-medium"
              style={{ color: 'var(--fg-muted)' }}
            >
              {t.products.clear}
            </button>
          )}
        </div>

        {series !== 'all' && (
          <p className="mb-8 max-w-2xl border-l-2 pl-4 text-[0.88rem] leading-relaxed" style={{ borderColor: 'var(--accent)', color: 'var(--fg-muted)' }}>
            {series === 'promark' ? t.products.seriesPromarkNote : t.products.seriesKafNote}
          </p>
        )}

        {list.length === 0 ? (
          <p className="py-24 text-center" style={{ color: 'var(--fg-muted)' }}>
            {t.products.empty}
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <Reveal key={p.slug} as="li" delay={Math.min(i, 10) * 45}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
