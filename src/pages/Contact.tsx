import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import { company } from '../data/company'
import Reveal from '../components/Reveal'

const field =
  'w-full rounded-xl border bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-[var(--fg-faint)] focus:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-2xl border p-7" style={{ background: 'var(--bg-soft)' }}>
      <h2 className="text-[0.74rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--fg-faint)' }}>
        {title}
      </h2>
      <div className="mt-5 space-y-2.5 text-[0.95rem] leading-relaxed">{children}</div>
    </div>
  )
}

export default function Contact() {
  const { t, lang } = useI18n()
  const [subject, setSubject] = useState<keyof typeof t.contact.subjects>('quote')
  const [sent, setSent] = useState(false)

  const maps = `https://www.google.com/maps/search/?api=1&query=${company.address.lat},${company.address.lng}`

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const label = lang === 'tr'
      ? ['Ad Soyad', 'Firma', 'E-posta', 'Telefon']
      : ['Name', 'Company', 'Email', 'Phone']
    const lines = [
      `${label[0]}: ${f.get('name')}`,
      `${label[1]}: ${f.get('company') || '-'}`,
      `${label[2]}: ${f.get('email')}`,
      `${label[3]}: ${f.get('phone') || '-'}`,
      '',
      String(f.get('message') ?? ''),
    ]
    setSent(true)
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      `${t.contact.subjects[subject]} — kaftarim.com`,
    )}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  return (
    <>
      <section className="shell pb-14 pt-[calc(68px+4rem)] md:pt-[calc(76px+6rem)]">
        <Reveal as="p" className="eyebrow">
          {t.contact.eyebrow}
        </Reveal>
        <Reveal as="h1" delay={60} className="mt-5 font-display text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
          {t.contact.title}
        </Reveal>
        <Reveal as="p" delay={110} className="mt-5 max-w-xl leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          {t.contact.lead}
        </Reveal>

        <Reveal delay={160} className="mt-9 flex flex-wrap gap-3">
          <a href={`tel:${company.phoneHref}`} className="btn tabular">
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`} className="btn btn-ghost">
            {t.contact.mail}
          </a>
        </Reveal>
      </section>

      <section className="shell grid gap-6 pb-6 md:grid-cols-2">
        <Reveal>
          <Card title={t.contact.officeTitle}>
            <p style={{ color: 'var(--fg-muted)' }}>
              {company.address.street}
              <br />
              {company.address.district} / {company.address.city}
              <br />
              {company.address.country[lang]}
            </p>
            <p>
              <a href={`tel:${company.phoneHref}`} className="link-underline tabular">
                {company.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${company.email}`} className="link-underline">
                {company.email}
              </a>
            </p>
            <p className="pt-2">
              <a href={maps} target="_blank" rel="noreferrer" className="link-underline font-semibold" style={{ color: 'var(--accent)' }}>
                {t.contact.directions} →
              </a>
            </p>
          </Card>
        </Reveal>

        <Reveal delay={90}>
          <Card title={t.contact.factoryTitle}>
            <p style={{ color: 'var(--fg-muted)' }}>{company.promark.address}</p>
            <p>
              <a href={`tel:${company.promark.phoneHref}`} className="link-underline tabular">
                {company.promark.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${company.promark.email}`} className="link-underline">
                {company.promark.email}
              </a>
            </p>
            <p className="pt-2 text-[0.85rem]" style={{ color: 'var(--fg-faint)' }}>
              {company.promark.site}
            </p>
          </Card>
        </Reveal>
      </section>

      <section className="shell py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal as="h2" className="font-display text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight tracking-[-0.025em]">
              {t.contact.formTitle}
            </Reveal>
            <Reveal as="p" delay={70} className="mt-4 text-[0.92rem] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {t.contact.formNote}
            </Reveal>
            <Reveal as="p" delay={100} className="mt-3 text-[0.82rem]" style={{ color: 'var(--fg-faint)' }}>
              {t.contact.requiredNote}
            </Reveal>
          </div>

          <Reveal delay={110} className="lg:col-span-8">
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-faint)' }}>
                  {t.contact.name} <span aria-hidden="true">*</span>
                </span>
                <input name="name" required className={field} autoComplete="name" />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-faint)' }}>
                  {t.contact.company}
                </span>
                <input name="company" className={field} autoComplete="organization" />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-faint)' }}>
                  {t.contact.email} <span aria-hidden="true">*</span>
                </span>
                <input name="email" type="email" required className={field} autoComplete="email" />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-faint)' }}>
                  {t.contact.phone}
                </span>
                <input name="phone" type="tel" className={field} autoComplete="tel" />
              </label>

              <fieldset className="sm:col-span-2" role="radiogroup" aria-label={t.contact.subject}>
                <legend className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-faint)' }}>
                  {t.contact.subject}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(t.contact.subjects) as (keyof typeof t.contact.subjects)[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={subject === k}
                      onClick={() => setSubject(k)}
                      className="rounded-full border px-4 py-2 text-[0.85rem] transition-all duration-300"
                      style={{
                        background: subject === k ? 'var(--fg)' : 'transparent',
                        color: subject === k ? 'var(--bg)' : 'var(--fg-muted)',
                        borderColor: subject === k ? 'var(--fg)' : 'var(--line)',
                      }}
                    >
                      {t.contact.subjects[k]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--fg-faint)' }}>
                  {t.contact.message} <span aria-hidden="true">*</span>
                </span>
                <textarea name="message" required rows={6} className={`${field} resize-y`} />
              </label>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn">
                  {t.contact.send}
                </button>
                <p role="status" aria-live="polite" className="text-[0.85rem]" style={{ color: 'var(--fg-muted)' }}>
                  {sent ? t.contact.opening : ''}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  )
}
