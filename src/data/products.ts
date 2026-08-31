import raw from './products.tr.json'
import english from './products.en.json'
import type { Lang } from '../i18n/dict'

export type Series = 'promark' | 'kaf'
export type CategoryId = 'organik' | 'npk' | 'kalsiyum' | 'mikro' | 'ozel'

export interface AnalysisRow {
  tr: string
  en?: string
  value: string
}

export interface Product {
  slug: string
  name: string
  series: Series
  category: CategoryId
  type?: { tr: string; en?: string }
  tagline?: { tr: string; en?: string }
  description: { tr: string; en?: string }
  analysis: AnalysisRow[]
  gallery?: string[]
  packs?: string[]
  catalogPage?: number
}

interface EnglishPatch {
  glossary?: { terms?: { tr: string; en: string }[]; types?: { tr: string; en: string }[] }
  products?: { slug: string; description_en?: string; tagline_en?: string }[]
}

const patch = english as EnglishPatch
const termMap = new Map((patch.glossary?.terms ?? []).map((t) => [t.tr, t.en]))
const typeMap = new Map((patch.glossary?.types ?? []).map((t) => [t.tr, t.en]))
const textMap = new Map((patch.products ?? []).map((p) => [p.slug, p]))

export const products: Product[] = (raw as Product[]).map((p) => {
  const en = textMap.get(p.slug)
  return {
    ...p,
    type: p.type ? { ...p.type, en: typeMap.get(p.type.tr) } : undefined,
    tagline: p.tagline ? { ...p.tagline, en: en?.tagline_en || undefined } : undefined,
    description: { ...p.description, en: en?.description_en || undefined },
    analysis: p.analysis.map((a) => ({ ...a, en: termMap.get(a.tr) })),
  }
})

export const CATEGORY_ORDER: CategoryId[] = ['organik', 'npk', 'kalsiyum', 'mikro', 'ozel']

export const bySlug = new Map(products.map((p) => [p.slug, p]))

export const currentRange = products.filter((p) => p.series === 'promark')
export const catalogRange = products.filter((p) => p.series === 'kaf')

export function countByCategory(): Record<CategoryId, number> {
  const out = { organik: 0, npk: 0, kalsiyum: 0, mikro: 0, ozel: 0 }
  for (const p of products) out[p.category]++
  return out
}

/** Falls back to Turkish when a translation is missing rather than showing a gap. */
export function pick(field: { tr: string; en?: string } | undefined, lang: Lang): string {
  if (!field) return ''
  return (lang === 'en' ? field.en : field.tr) || field.tr
}

/**
 * Turkish labels write "%1,5"; English wants "1.5%". The stored value is the
 * Turkish form, exactly as printed on the pack.
 */
export function fmtValue(v: string, lang: Lang): string {
  if (lang === 'tr') return v
  const m = /^%\s*([\d.,]+)(.*)$/.exec(v)
  return m ? `${m[1].replace(',', '.')}%${m[2]}` : v
}

/** Product image URL, resolved against the deployment base path. */
export function shot(name: string): string {
  return `${import.meta.env.BASE_URL}products/${name}.webp`
}

export function heroShot(p: Product): string | null {
  const g = p.gallery ?? []
  if (!g.length) return null
  // prefer the mid-size pack when there is a family of three
  return shot(g.length >= 3 ? g[1] : g[0])
}
