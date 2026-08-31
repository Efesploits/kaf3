import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import Logo from './Logo'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.1M12 19.3v2.1M21.4 12h-2.1M4.7 12H2.6M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5M18.6 18.6l-1.5-1.5M6.9 6.9L5.4 5.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8Z" />
    </svg>
  )
}

export default function Header() {
  const { t, lang, toggleLang, theme, toggleTheme } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const sheet = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [loc.pathname])

  // While the sheet is open: lock the page, take the rest of the document out of
  // the tab order, move focus in, and let Escape close it.
  useEffect(() => {
    if (!open) return
    const main = document.getElementById('main')
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    main?.setAttribute('inert', 'true')
    sheet.current?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      main?.removeAttribute('inert')
    }
  }, [open])

  const links = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/kurumsal', label: t.nav.about },
    { to: '/urunler', label: t.nav.products },
    { to: '/iletisim', label: t.nav.contact },
  ]

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:px-4 focus:py-2"
        style={{ background: 'var(--fg)', color: 'var(--bg)' }}
      >
        {t.nav.skip}
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500"
        style={{
          background: scrolled || open ? 'color-mix(in oklab, var(--bg) 86%, transparent)' : 'transparent',
          backdropFilter: scrolled || open ? 'saturate(180%) blur(14px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
        }}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
          <Link to="/" className="shrink-0 py-2">
            <Logo variant="compact" height={30} className="md:h-[34px]" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.menu}>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-300 ${
                    isActive ? '' : 'hover:opacity-70'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
                  background: isActive ? 'var(--bg-soft)' : 'transparent',
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLang}
              className="rounded-full px-3 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-70"
              style={{ color: 'var(--fg-muted)' }}
              aria-label={t.common.langSwitch}
            >
              <span style={{ color: 'var(--fg)' }}>{lang.toUpperCase()}</span>
              <span aria-hidden="true" className="opacity-40"> / {lang === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="grid size-9 place-items-center rounded-full transition-colors hover:opacity-70"
              style={{ color: 'var(--fg-muted)' }}
              aria-label={theme === 'dark' ? t.common.theme.toLight : t.common.theme.toDark}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <Link to="/iletisim" className="btn ml-1 hidden !px-5 !py-2.5 !text-[0.82rem] sm:inline-flex">
              {t.nav.quote}
            </Link>

            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full lg:hidden"
              style={{ color: 'var(--fg)' }}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* mobile sheet — hidden from the tab order entirely when closed */}
      <div
        id="mobile-menu"
        ref={sheet}
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background: 'var(--bg)',
          transition: 'opacity .4s var(--ease-out-quint), visibility .4s',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
        }}
        inert={!open}
      >
        <nav className="shell flex h-full flex-col justify-center gap-1 pt-16" aria-label={t.nav.menu}>
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="font-display text-[clamp(2rem,9vw,3.2rem)] font-bold leading-[1.15] tracking-tight"
              style={{
                color: 'var(--fg)',
                transform: open ? 'none' : 'translateY(18px)',
                opacity: open ? 1 : 0,
                transition: `transform .6s var(--ease-out-quint) ${80 + i * 55}ms, opacity .6s ease ${80 + i * 55}ms`,
              }}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/iletisim" className="btn mt-8 self-start">
            {t.nav.quote}
          </Link>
        </nav>
      </div>
    </>
  )
}
