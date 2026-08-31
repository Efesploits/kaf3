import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { company, crops } from '../data/company'
import {
  CATEGORY_ORDER,
  countByCategory,
  currentRange,
  heroShot,
  pick,
  products,
  type CategoryId,
} from '../data/products'
import HeroLogo3D from '../components/HeroLogo3D'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h13M12.5 6l6 6-6 6" />
    </svg>
  )
}

/* ── hero ───────────────────────────────────────────────────────────────── */

function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="field-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          maskImage: 'radial-gradient(120% 80% at 50% 18%, #000 20%, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[6%] -z-10 h-[46rem] w-[74rem] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, var(--color-lime-brand) 16%, transparent), transparent 78%)',
          filter: 'blur(12px)',
        }}
      />

      <div className="shell flex min-h-[94svh] flex-col justify-center pb-16 pt-[68px] md:pt-[76px]">
        <HeroLogo3D className="h-[30svh] min-h-[168px] w-full sm:h-[36svh] md:h-[44svh]" />

        <div className="mt-4 grid gap-10 md:mt-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p
              className="eyebrow"
              style={{ animation: 'kaf-fade-up .8s var(--ease-out-quint) 1.45s both' }}
            >
              {t.hero.eyebrow}
            </p>
            <h1
              className="mt-4 font-display text-[clamp(2.15rem,5.6vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.03em]"
              style={{ animation: 'kaf-fade-up .9s var(--ease-out-quint) 1.6s both' }}
            >
              {t.hero.title}
            </h1>
          </div>

          <div className="lg:col-span-5">
            <p
              className="max-w-xl text-[0.98rem] leading-relaxed md:text-[1.02rem]"
              style={{
                color: 'var(--fg-muted)',
                animation: 'kaf-fade-up .9s var(--ease-out-quint) 1.8s both',
              }}
            >
              {t.hero.lead}
            </p>
            <div
              className="mt-7 flex flex-wrap gap-3"
              style={{ animation: 'kaf-fade-up .9s var(--ease-out-quint) 2s both' }}
            >
              <Link to="/urunler" className="btn">
                {t.hero.ctaProducts} <Arrow />
              </Link>
              <Link to="/iletisim" className="btn btn-ghost">
                {t.hero.ctaContact}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── stats ──────────────────────────────────────────────────────────────── */

function Stats() {
  const { t } = useI18n()
  const items = [
    { k: t.stats.founded, v: String(company.foundedYear), s: company.city },
    { k: t.stats.products, v: String(products.length), s: `${currentRange.length} ${t.stats.currentRange}` },
    { k: t.stats.export, v: '2018', s: t.stats.exportSince },
    { k: t.stats.make, v: String(company.promark.foundedYear), s: t.stats.makeNote },
  ]
  return (
    <section className="border-y" style={{ background: 'var(--bg-soft)' }}>
      <div className="shell grid grid-cols-2 gap-px lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.k} delay={i * 70} className="px-1 py-8 md:py-10">
            <div
              className="tabular font-display text-[clamp(1.5rem,3.4vw,2.35rem)] font-extrabold leading-none tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              {it.v}
            </div>
            <div className="mt-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-muted)' }}>
              {it.k}
            </div>
            <div className="mt-1 text-[0.78rem]" style={{ color: 'var(--fg-faint)' }}>
              {it.s}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── crop strip ─────────────────────────────────────────────────────────── */

function CropStrip() {
  const { lang } = useI18n()
  const list = crops[lang]
  return (
    <section className="overflow-hidden border-b py-5" aria-hidden="true">
      <div className="mask-fade-x">
        <div className="flex w-max gap-10 whitespace-nowrap" style={{ animation: 'kaf-marquee 62s linear infinite' }}>
          {[0, 1].map((rep) => (
            <div key={rep} className="flex gap-10">
              {list.map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-10 text-[0.82rem] font-medium uppercase tracking-[0.18em]"
                  style={{ color: 'var(--fg-faint)' }}
                >
                  {c}
                  <span className="size-1 rounded-full" style={{ background: 'var(--accent)' }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── what we do ─────────────────────────────────────────────────────────── */

function WhatWeDo() {
  const { t } = useI18n()
  return (
    <section className="shell py-24 md:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow">
            {t.what.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={80} className="mt-5 font-display text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.025em]">
            {t.what.title}
          </Reveal>
          <Reveal as="p" delay={140} className="mt-5 max-w-md leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {t.what.lead}
          </Reveal>
        </div>

        <ol className="lg:col-span-7">
          {t.what.items.map((it, i) => (
            <Reveal key={it.k} delay={i * 90} as="li" className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t py-7 first:border-t-0 first:pt-0 md:gap-x-10">
              <span className="tabular pt-1 text-[0.78rem] font-semibold" style={{ color: 'var(--accent)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-[1.2rem] font-bold tracking-tight md:text-[1.35rem]">{it.k}</h3>
                <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  {it.v}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── symptom → product ──────────────────────────────────────────────────── */

function SymptomFinder() {
  const { t, lang } = useI18n()
  const withTag = useMemo(() => currentRange.filter((p) => p.tagline), [])
  const [active, setActive] = useState(0)
  const sel = withTag[active]
  const img = heroShot(sel)

  return (
    <section className="border-y py-24 md:py-32" style={{ background: 'var(--bg-soft)' }}>
      <div className="shell">
        <Reveal as="p" className="eyebrow">
          {t.problem.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={70} className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.025em]">
          {t.problem.title}
        </Reveal>
        <Reveal as="p" delay={130} className="mt-4 max-w-xl leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          {t.problem.lead}
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ul className="flex flex-wrap gap-2" aria-label={t.problem.pick}>
              {withTag.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    aria-pressed={i === active}
                    onClick={() => setActive(i)}
                    className="rounded-full border px-4 py-2.5 text-left text-[0.86rem] leading-snug transition-all duration-400"
                    style={{
                      background: i === active ? 'var(--fg)' : 'var(--panel)',
                      color: i === active ? 'var(--bg)' : 'var(--fg-muted)',
                      borderColor: i === active ? 'var(--fg)' : 'var(--line)',
                    }}
                  >
                    {pick(p.tagline, lang)}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <article
              aria-live="polite"
              key={sel.slug}
              className="card overflow-hidden"
              style={{ boxShadow: 'var(--shadow-card)', animation: 'kaf-fade-up .55s var(--ease-out-quint) both' }}
            >
              <div className="flex items-center gap-5 p-6">
                {img && (
                  <img src={img} alt="" className="h-28 w-auto shrink-0 object-contain" loading="lazy" />
                )}
                <div>
                  <h3 className="font-display text-[1.35rem] font-bold leading-tight tracking-tight">{sel.name}</h3>
                  <p className="mt-1 text-[0.82rem]" style={{ color: 'var(--fg-muted)' }}>
                    {pick(sel.type, lang)}
                  </p>
                </div>
              </div>
              <p className="px-6 pb-6 text-[0.92rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                {pick(sel.description, lang)}
              </p>
              <Link
                to={`/urunler/${sel.slug}`}
                className="flex items-center justify-between border-t px-6 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.1em] transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                {t.problem.seeProduct}
                <Arrow />
              </Link>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── families ───────────────────────────────────────────────────────────── */

function Families() {
  const { t } = useI18n()
  const counts = countByCategory()
  return (
    <section className="shell py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="eyebrow">
            {t.families.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={70} className="mt-5 font-display text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.025em]">
            {t.families.title}
          </Reveal>
        </div>
        <Reveal delay={120}>
          <Link to="/urunler" className="btn btn-ghost">
            {t.featured.all} <Arrow />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-5" style={{ background: 'var(--line)' }}>
        {CATEGORY_ORDER.map((c: CategoryId, i) => (
          <Reveal key={c} delay={i * 70}>
            <Link
              to={`/urunler?grup=${c}`}
              className="group flex h-full flex-col p-7 transition-colors duration-500"
              style={{ background: 'var(--bg)' }}
            >
              <span className="tabular font-display text-[2.6rem] font-extrabold leading-none tracking-tight transition-colors duration-500 group-hover:text-[var(--accent)]" style={{ color: 'var(--line)' }}>
                {String(counts[c]).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-display text-[1.1rem] font-bold leading-snug tracking-tight">
                {t.categories[c]}
              </h3>
              <p className="mt-2.5 text-[0.85rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                {t.categoryDesc[c]}
              </p>
              <span className="mt-auto pt-6 text-[0.72rem] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--fg-faint)' }}>
                {counts[c]} {t.families.countSuffix}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── featured rail ──────────────────────────────────────────────────────── */

function Featured() {
  const { t } = useI18n()
  return (
    <section className="border-t py-24 md:py-32" style={{ background: 'var(--bg-soft)' }}>
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="p" className="eyebrow">
            {t.featured.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={70} className="mt-5 font-display text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.025em]">
            {t.featured.title}
          </Reveal>
          <Reveal as="p" delay={120} className="mt-4 max-w-lg leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {t.featured.lead}
          </Reveal>
        </div>
      </div>

      <Reveal delay={80} className="mt-12">
        <div className="mask-fade-r overflow-x-auto pb-4">
          <ul className="shell flex w-max gap-5">
            {currentRange.map((p, i) => (
              <li key={p.slug} className="w-[17rem] shrink-0">
                <ProductCard product={p} index={i} />
              </li>
            ))}
            <li className="grid w-[15rem] shrink-0 place-items-center">
              <Link to="/urunler" className="btn btn-ghost">
                {t.featured.all} <Arrow />
              </Link>
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  )
}

/* ── teasers ────────────────────────────────────────────────────────────── */

function AboutTeaser() {
  const { t, lang } = useI18n()
  return (
    <section className="shell py-24 md:py-32">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal as="p" className="eyebrow">
            {t.aboutTeaser.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={70} className="mt-5 font-display text-[clamp(1.8rem,3.8vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.025em]">
            {t.aboutTeaser.title}
          </Reveal>
          <Reveal delay={130} className="mt-8">
            <Link to="/kurumsal" className="btn">
              {t.aboutTeaser.cta} <Arrow />
            </Link>
          </Reveal>
        </div>
        <div className="lg:col-span-6">
          {t.about.story.slice(0, 2).map((p, i) => (
            <Reveal key={i} delay={i * 90} as="p" className="mb-4 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {p}
            </Reveal>
          ))}
          <Reveal delay={200} className="mt-8 border-l-2 pl-5" style={{ borderColor: 'var(--accent)' }}>
            <p className="font-display text-[1.15rem] font-semibold italic tracking-tight">
              “{company.motto[lang]}”
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactTeaser() {
  const { t } = useI18n()
  return (
    <section className="shell pb-8">
      <Reveal className="relative overflow-hidden rounded-3xl px-7 py-14 md:px-16 md:py-20" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full opacity-[0.16]"
          style={{ background: 'radial-gradient(closest-side, var(--color-lime-brand), transparent)' }}
        />
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] opacity-60">
          {t.contactTeaser.eyebrow}
        </p>
        <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.06] tracking-[-0.03em]">
          {t.contactTeaser.title}
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed opacity-70">{t.contactTeaser.lead}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/iletisim"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.88rem] font-semibold transition-transform duration-400 hover:-translate-y-0.5"
            style={{ background: 'var(--bg)', color: 'var(--fg)' }}
          >
            {t.contactTeaser.cta} <Arrow />
          </Link>
          <a
            href={`tel:${company.phoneHref}`}
            className="tabular inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.88rem] font-semibold ring-1 ring-inset transition-opacity hover:opacity-70"
            style={{ color: 'var(--bg)' }}
          >
            {company.phone}
          </a>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <CropStrip />
      <WhatWeDo />
      <SymptomFinder />
      <Families />
      <Featured />
      <AboutTeaser />
      <ContactTeaser />
    </>
  )
}
