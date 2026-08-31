import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { company } from '../data/company'
import Logo from './Logo'

export default function Footer() {
  const { t, lang } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-28 border-t md:mt-40" style={{ background: 'var(--bg-soft)' }}>
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo variant="full" height={52} className="max-w-[300px]" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {t.footer.tagline}
          </p>
          <p className="mt-4 text-sm font-medium italic" style={{ color: 'var(--accent)' }}>
            “{company.motto[lang]}”
          </p>
        </div>

        <nav className="md:col-span-3" aria-label={t.footer.nav}>
          <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--fg-faint)' }}>
            {t.footer.nav}
          </h3>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]">
            {[
              { to: '/', label: t.nav.home },
              { to: '/kurumsal', label: t.nav.about },
              { to: '/urunler', label: t.nav.products },
              { to: '/iletisim', label: t.nav.contact },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-slide" style={{ color: 'var(--fg-muted)' }}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                className="link-slide"
                style={{ color: 'var(--fg-muted)' }}
                href={`${import.meta.env.BASE_URL}kaf-tarim-urun-katalogu-2019.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                {t.footer.catalog} (PDF)
              </a>
            </li>
          </ul>
        </nav>

        <address className="not-italic md:col-span-4">
          <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--fg-faint)' }}>
            {t.footer.contact}
          </h3>
          <ul className="mt-5 space-y-2.5 text-[0.95rem]" style={{ color: 'var(--fg-muted)' }}>
            <li className="leading-relaxed">
              {company.address.street}
              <br />
              {company.address.district} / {company.address.city}
            </li>
            <li>
              <a href={`tel:${company.phoneHref}`} className="link-underline tabular">
                {company.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="link-underline">
                {company.email}
              </a>
            </li>
            <li>
              <a href={company.facebook} target="_blank" rel="noreferrer" className="link-underline">
                Facebook
              </a>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t">
        <div className="shell flex flex-col gap-3 py-6 text-[0.78rem] md:flex-row md:items-center md:justify-between" style={{ color: 'var(--fg-faint)' }}>
          <p>
            © {year} {company.legalName}. {t.footer.rights}
          </p>
          <p className="max-w-xl md:text-right">{t.footer.note}</p>
        </div>
      </div>
    </footer>
  )
}
