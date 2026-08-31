import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { company, milestones } from '../data/company'
import { currentRange, products } from '../data/products'
import Logo from '../components/Logo'
import Reveal from '../components/Reveal'

/** dd.mm.yyyy from the registry, rendered the way each locale writes dates */
function fmtDate(ddmmyyyy: string, lang: 'tr' | 'en') {
  const [d, m, y] = ddmmyyyy.split('.').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="text-[0.8rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-faint)' }}>
        {k}
      </dt>
      <dd className="text-[0.95rem] leading-relaxed">{v}</dd>
    </div>
  )
}

export default function About() {
  const { t, lang } = useI18n()

  return (
    <>
      {/* masthead */}
      <section className="shell pb-14 pt-[calc(68px+4rem)] md:pt-[calc(76px+6rem)]">
        <Reveal as="p" className="eyebrow">
          {t.about.eyebrow}
        </Reveal>
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal as="h1" delay={60} className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
              {t.about.title}
            </Reveal>
            <Reveal as="p" delay={110} className="mt-5 max-w-lg text-[1.05rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {t.about.lead}
            </Reveal>
          </div>
          <Reveal delay={160} className="lg:col-span-5">
            <div className="rounded-2xl border p-7" style={{ background: 'var(--bg-soft)' }}>
              <Logo variant="full" height={54} className="max-w-full" />
              <p className="mt-5 text-[0.9rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                {company.legalNameFull}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* story */}
      <section className="border-y py-24 md:py-32" style={{ background: 'var(--bg-soft)' }}>
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal as="h2" className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-tight tracking-[-0.025em]">
              {t.about.storyTitle}
            </Reveal>
            <Reveal delay={90} className="mt-6 border-l-2 pl-5" style={{ borderColor: 'var(--accent)' }}>
              <p className="font-display text-[1.1rem] font-semibold italic leading-snug tracking-tight">
                “{company.motto[lang]}”
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            {t.about.story.map((p, i) => (
              <Reveal
                key={i}
                as="p"
                delay={i * 70}
                className="mb-5 text-[1.02rem] leading-relaxed"
                style={{ color: 'var(--fg-muted)' }}
              >
                {p}
              </Reveal>
            ))}
            <Reveal delay={320} as="p" className="mt-2 text-[0.78rem]" style={{ color: 'var(--fg-faint)' }}>
              — {t.about.storySource}
            </Reveal>
          </div>
        </div>
      </section>

      {/* timeline */}
      <section className="shell py-24 md:py-32">
        <Reveal as="h2" className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-tight tracking-[-0.025em]">
          {t.about.timelineTitle}
        </Reveal>
        <ol className="mt-12">
          {milestones.map((m, i) => (
            <Reveal
              key={m.year}
              as="li"
              delay={i * 70}
              className="grid grid-cols-[4.5rem_1fr] gap-x-6 border-t py-8 md:grid-cols-[9rem_1fr] md:gap-x-12"
            >
              <span
                className="tabular font-display text-[1.35rem] font-extrabold leading-none tracking-tight md:text-[2rem]"
                style={{ color: 'var(--accent)' }}
              >
                {m.year}
              </span>
              <div>
                <h3 className="font-display text-[1.15rem] font-bold tracking-tight md:text-[1.35rem]">
                  {m.title[lang]}
                </h3>
                <p className="mt-2 max-w-2xl leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  {m.body[lang]}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* promark */}
      <section className="border-y py-24 md:py-32" style={{ background: 'var(--bg-soft)' }}>
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal as="p" className="eyebrow">
              {company.promark.foundedYear} · {company.city}
            </Reveal>
            <Reveal as="h2" delay={70} className="mt-5 font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-tight tracking-[-0.025em]">
              {t.about.promarkTitle}
            </Reveal>
            <Reveal delay={130} className="mt-7 space-y-1.5 text-[0.9rem]" style={{ color: 'var(--fg-muted)' }}>
              <p>{company.promark.address}</p>
              <p className="tabular">
                <a href={`tel:${company.promark.phoneHref}`} className="link-slide">
                  {company.promark.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.promark.email}`} className="link-slide">
                  {company.promark.email}
                </a>
              </p>
            </Reveal>
            <Reveal delay={180} className="mt-7">
              <Link to="/urunler?seri=promark" className="btn btn-ghost">
                {currentRange.length} {t.families.countSuffix}
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            {t.about.promark.map((p, i) => (
              <Reveal
                key={i}
                as="p"
                delay={i * 80}
                className="mb-5 text-[1.02rem] leading-relaxed"
                style={{ color: 'var(--fg-muted)' }}
              >
                {p}
              </Reveal>
            ))}
            <Reveal delay={200} as="p" className="mt-2 text-[0.78rem]" style={{ color: 'var(--fg-faint)' }}>
              — {t.about.promarkSource}
            </Reveal>
          </div>
        </div>
      </section>

      {/* catalogue + legal */}
      <section className="shell grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal as="h2" className="font-display text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight tracking-[-0.025em]">
            {t.about.catalogTitle}
          </Reveal>
          <Reveal as="p" delay={70} className="mt-4 leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {t.about.catalogBody}
          </Reveal>
          <Reveal delay={120} className="mt-7">
            <a
              className="btn"
              href={`${import.meta.env.BASE_URL}kaf-tarim-urun-katalogu-2019.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              {t.about.catalogCta}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v12M7 11.5l5 5 5-5M5 20h14" />
              </svg>
            </a>
          </Reveal>
          <Reveal delay={160} className="mt-8 flex gap-8">
            <div>
              <div className="tabular font-display text-[2rem] font-extrabold leading-none">{products.length}</div>
              <div className="mt-1.5 text-[0.76rem] uppercase tracking-[0.12em]" style={{ color: 'var(--fg-faint)' }}>
                {t.stats.products}
              </div>
            </div>
            <div>
              <div className="tabular font-display text-[2rem] font-extrabold leading-none">24</div>
              <div className="mt-1.5 text-[0.76rem] uppercase tracking-[0.12em]" style={{ color: 'var(--fg-faint)' }}>
                {lang === 'tr' ? 'Katalog sayfası' : 'Catalogue pages'}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal as="h2" className="font-display text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight tracking-[-0.025em]">
            {t.about.legalTitle}
          </Reveal>
          <Reveal delay={80}>
            <dl className="mt-7">
              <Row k={t.about.legal.name} v={company.legalNameFull} />
              <Row k={t.about.legal.founded} v={`${company.foundedOn[lang]} · ${company.city}`} />
              <Row
                k={t.about.legal.address}
                v={`${company.address.street}, ${company.address.district} / ${company.address.city}`}
              />
              <Row
                k={t.about.legal.nace}
                v={
                  <span>
                    <span className="tabular">{company.nace}</span> — {company.naceText[lang]}
                  </span>
                }
              />
              <Row
                k={t.about.legal.licence}
                v={
                  <>
                    <span className="tabular font-semibold">{company.seedLicence.no}</span>
                    <span className="tabular"> · {fmtDate(company.seedLicence.issued, lang)} – {fmtDate(company.seedLicence.validUntil, lang)}</span>
                    <br />
                    <span className="text-[0.85rem]" style={{ color: 'var(--fg-muted)' }}>
                      {company.seedLicence.authority[lang]}
                    </span>
                  </>
                }
              />
              <Row
                k={t.about.legal.trademark}
                v={
                  <span>
                    {company.trademark.name} · <span className="tabular">{company.trademark.no}</span> · TÜRKPATENT
                  </span>
                }
              />
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  )
}
