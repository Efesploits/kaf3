import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import {
  CATEGORY_ORDER,
  pick,
  products,
  type CategoryId,
  type Series,
} from '../data/products'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

type SeriesFilter = Series | 'all'
type CatFilter = CategoryId | 'all'

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

  return (
    <>
      <section className="shell pb-10 pt-[calc(68px+4rem)] md:pt-[calc(76px+6rem)]">
        <Reveal as="p" className="eyebrow">
          {t.products.eyebrow}
        </Reveal>
        <Reveal as="h1" delay={60} className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
          {t.products.title}
        </Reveal>
        <Reveal as="p" delay={110} className="mt-5 max-w-2xl leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          {t.products.lead}
        </Reveal>
      </section>

      <section
        className="sticky top-[68px] z-30 border-y py-4 md:top-[76px]"
        style={{
          background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
          backdropFilter: 'saturate(180%) blur(14px)',
        }}
      >
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
