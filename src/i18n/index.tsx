import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dict, type Lang } from './dict'

const LANG_KEY = 'kaf-lang'
const THEME_KEY = 'kaf-theme'

export type Theme = 'light' | 'dark'

interface Ctx {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
  t: (typeof dict)['tr']
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const I18nContext = createContext<Ctx | null>(null)

/** Fill `{name}` slots in a dictionary string: fill(t.products.title, { n: 42 }). */
export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}

/** First visit follows the browser/system language, then the choice sticks. */
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'tr' || saved === 'en') return saved
  } catch {
    /* private mode */
  }
  const nav = navigator.languages?.[0] ?? navigator.language ?? 'en'
  return /^tr/i.test(nav) ? 'tr' : 'en'
}

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* private mode */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try {
      localStorage.setItem(THEME_KEY, t)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const d = dict[lang]
    document.documentElement.lang = lang
    document.title = d.meta.title
    const set = (sel: string, value: string) =>
      document.querySelector(sel)?.setAttribute('content', value)
    set('meta[name="description"]', d.meta.description)
    set('meta[property="og:title"]', d.meta.title)
    set('meta[property="og:description"]', d.meta.description)
    set('meta[property="og:locale"]', lang === 'tr' ? 'tr_TR' : 'en_US')
    set('meta[property="og:locale:alternate"]', lang === 'tr' ? 'en_US' : 'tr_TR')
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === 'tr' ? 'en' : 'tr'),
      t: dict[lang],
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [lang, theme, setLang, setTheme],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): Ctx {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

export type { Lang }
