import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { fmtValue, heroShot, pick, type Product } from '../data/products'

/**
 * Chip label for the analysis badges: prefer the chemical symbol in brackets,
 * otherwise the last word of the (already translated) term.
 */
function abbr(term: string): string {
  return term.match(/\(([^)]+)\)/)?.[1] ?? term.split(' ').slice(-1)[0]
}

interface Props {
  product: Product
  /** index within its grid, used to stagger the reveal */
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { t, lang } = useI18n()
  const img = heroShot(product)
  const npk = product.analysis
    .filter((a) => /\((N|P₂O₅|K₂O|CaO|Zn|Fe|Cu|Mn|B|MgO)\)/.test(a.tr) || /Organik Madde|Fulvik|Aminoasit/.test(a.tr))
    .slice(0, 3)

  return (
    <Link
      to={`/urunler/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border transition-[transform,box-shadow,border-color] duration-500"
      style={{
        background: 'var(--panel)',
        boxShadow: 'var(--shadow-card)',
        transitionDelay: `${Math.min(index, 8) * 20}ms`,
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
        el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(340px circle at var(--mx,50%) var(--my,0%), color-mix(in oklab, var(--color-lime-brand) 12%, transparent), transparent 70%)',
        }}
      />

      {/* The well is the same studio the catalogue film was shot in. The
          packshot stands on the floor line with its reflection under it; a
          product without a photo gets a title card on the same backdrop. */}
      <div className="studio on-studio h-52">
        {img ? (
          <div className="absolute inset-x-0 top-[1.4rem] flex h-[8.6rem] justify-center">
            <div className="relative h-full transition-transform duration-700 group-hover:-translate-y-1.5 group-hover:scale-[1.04]">
              <img
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-auto object-contain"
              />
              <img
                src={img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="studio-reflection w-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <img
              src={`${import.meta.env.BASE_URL}brand/kaf-emblem.svg`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="pointer-events-none absolute inset-0 m-auto h-[70%] opacity-[0.14] transition-transform duration-700 group-hover:scale-105"
            />
            <span className="relative font-display text-[1.7rem] font-extrabold leading-none tracking-tight opacity-80 transition-opacity duration-500 group-hover:opacity-100">
              {product.name}
            </span>
          </div>
        )}
        <span
          className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em]"
          style={{
            // the KAF pill sits on the brightest corner of the well, so it
            // gets its own dark backing rather than the translucent line token
            background: product.series === 'promark' ? 'var(--badge-bg)' : 'rgb(10 28 21 / 0.6)',
            color: product.series === 'promark' ? 'var(--badge-fg)' : 'var(--fg)',
          }}
        >
          {product.series === 'promark' ? 'Promark' : 'KAF'}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.15rem] font-bold leading-tight tracking-tight">
          {product.name}
        </h3>
        {product.type && (
          <p className="mt-1 text-[0.82rem] leading-snug" style={{ color: 'var(--fg-muted)' }}>
            {pick(product.type, lang)}
          </p>
        )}

        {npk.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {npk.map((a) => (
              <li
                key={a.tr}
                className="tabular rounded-md px-2 py-1 text-[0.68rem] font-medium"
                style={{ background: 'var(--bg-sunk)', color: 'var(--fg-muted)' }}
              >
                {abbr(pick(a, lang))} {fmtValue(a.value, lang)}
              </li>
            ))}
          </ul>
        )}

        <span
          className="mt-auto flex items-center gap-1.5 pt-5 text-[0.78rem] font-semibold uppercase tracking-[0.1em]"
          style={{ color: 'var(--accent)' }}
        >
          {t.common.more}
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-400 group-hover:translate-x-1"
          >
            <path d="M5 12h13M12.5 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
