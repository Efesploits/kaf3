import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { I18nProvider, useI18n } from './i18n'
import { company } from './data/company'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import Logo3D from './components/Logo3D'

/**
 * Route changes should land at the top (but not when only the query changed),
 * name the new page in the document title, and hand focus to the main region
 * so a screen reader announces where it has arrived.
 */
function RouteChange() {
  const { pathname } = useLocation()
  const { t, lang } = useI18n()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    const seg = pathname.split('/').filter(Boolean)[0] ?? ''
    const name =
      seg === 'kurumsal' ? t.nav.about
      : seg === 'urunler' ? t.nav.products
      : seg === 'iletisim' ? t.nav.contact
      : ''
    document.title = name ? `${name} — ${company.brand}` : t.meta.title
    const main = document.getElementById('main')
    if (main) {
      main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
      main.removeAttribute('tabindex')
    }
  }, [pathname, t, lang])

  return null
}

function NotFound() {
  const { t } = useI18n()
  return (
    <section className="shell grid min-h-[70svh] place-items-center py-32 text-center">
      <div>
        <Logo3D mode="emblem" spin fallbackHeight={120} className="mx-auto h-[150px] w-[150px]" />
        <p className="mt-6 font-display text-[clamp(4rem,16vw,10rem)] font-extrabold leading-none tracking-tighter" style={{ color: 'var(--line)' }}>
          404
        </p>
        <h1 className="mt-4 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-bold tracking-tight">
          {t.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          {t.notFound.lead}
        </p>
        <Link to="/" className="btn mt-8">
          {t.notFound.cta}
        </Link>
      </div>
    </section>
  )
}

function Shell() {
  return (
    <>
      <RouteChange />
      <Header />
      <main id="main" className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kurumsal" element={<About />} />
          <Route path="/urunler" element={<Products />} />
          <Route path="/urunler/:slug" element={<ProductDetail />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Shell />
      </BrowserRouter>
    </I18nProvider>
  )
}
