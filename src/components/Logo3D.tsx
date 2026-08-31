import { useEffect, useRef, useState } from 'react'
import type { LogoMode, LogoScene } from '../lib/logo3d'
import { useI18n } from '../i18n'
import Logo from './Logo'

interface Props {
  /** `lockup` is the full mark with the wordmark reveal; `emblem` is the roundel */
  mode?: LogoMode
  /** keep turning slowly once the intro has landed */
  spin?: boolean
  /** drive the intro and the rotation from this element's scroll progress */
  scrollDriven?: boolean
  /** how far the mark turns across a full scroll pass, in radians */
  spinRange?: number
  /**
   * With `scrollDriven`, travel horizontally as the section arrives: from
   * `slideFrom` to `slideTo`, both as a percentage of the mark's own width.
   * Leave both at 0 to stay put.
   */
  slideFrom?: number
  slideTo?: number
  /**
   * Vertical parallax across the same pass, as a percentage of the mark's own
   * height. Unlike the horizontal travel this stays linear, so the mark keeps
   * sinking for as long as the section is on screen.
   */
  driftFrom?: number
  driftTo?: number
  /** purely decorative: render nothing at all rather than a flat fallback */
  decorative?: boolean
  /** show the "replay" affordance (hero only) */
  replayable?: boolean
  className?: string
  /** height of the flat fallback, in px */
  fallbackHeight?: number
}

/**
 * Mounts the extruded mark. three.js is fetched on demand and the scene is only
 * created once the element is near the viewport, so a page with two of these
 * still holds one WebGL context until the second one is actually needed.
 * Anything that cannot run WebGL gets the flat vector logo instead.
 */
export default function Logo3D({
  mode = 'lockup',
  spin = false,
  scrollDriven = false,
  spinRange,
  slideFrom = 0,
  slideTo = 0,
  driftFrom = 0,
  driftTo = 0,
  decorative = false,
  replayable = false,
  className = '',
  fallbackHeight = 160,
}: Props) {
  const root = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<LogoScene | null>(null)
  const [state, setState] = useState<'idle' | 'ready' | 'fallback'>('idle')
  const [canReplay, setCanReplay] = useState(false)
  const { theme, t } = useI18n()

  useEffect(() => {
    const el = host.current
    if (!el) return

    let cancelled = false
    let instance: LogoScene | null = null

    const start = async () => {
      try {
        const mod = await import('../lib/logo3d')
        if (cancelled || !host.current) return
        if (!mod.webglAvailable()) {
          setState('fallback')
          return
        }
        // A weak device gets fewer curve segments and no bevels.
        const lean =
          window.matchMedia('(max-width: 768px)').matches ||
          (navigator.hardwareConcurrency ?? 8) <= 4
        instance = new mod.LogoScene({
          container: host.current,
          mode,
          spin,
          scrollDriven,
          spinRange,
          quality: lean ? 'low' : 'high',
          onContextLost: () => setState('fallback'),
          // Written straight to the node: this fires every frame and a state
          // update here would re-render the tree sixty times a second.
          onScrollProgress:
            slideFrom !== slideTo || driftFrom !== driftTo
              ? (p) => {
                  const e = p * p * (3 - 2 * p) // smoothstep, for the entrance
                  const x = slideFrom + (slideTo - slideFrom) * e
                  const y = driftFrom + (driftTo - driftFrom) * p
                  const el = root.current
                  if (el) {
                    el.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 0)`
                  }
                }
              : undefined,
        })
        scene.current = instance
        if (import.meta.env.DEV) {
          // A page can hold more than one of these, so keep a list rather than
          // letting the second mount clobber the first.
          const w = window as unknown as { __kafLogos?: LogoScene[] }
          ;(w.__kafLogos ??= []).push(instance)
        }
        setCanReplay(replayable && !instance.isStatic)
        setState('ready')
      } catch {
        if (!cancelled) setState('fallback')
      }
    }

    // Build as soon as the element is within a screen of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          void start()
        }
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(el)

    return () => {
      cancelled = true
      io.disconnect()
      instance?.dispose()
      scene.current = null
      if (import.meta.env.DEV && instance) {
        const w = window as unknown as { __kafLogos?: LogoScene[] }
        w.__kafLogos = (w.__kafLogos ?? []).filter((s) => s !== instance)
      }
    }
  }, [mode, spin, scrollDriven, spinRange, slideFrom, slideTo, driftFrom, driftTo, decorative, replayable])

  useEffect(() => {
    scene.current?.setTheme(theme === 'dark')
  }, [theme, state])

  if (state === 'fallback') {
    if (decorative) return null
    return (
      <div className={`grid place-items-center ${className}`}>
        <Logo
          variant={mode === 'emblem' ? 'emblem' : 'full'}
          height={fallbackHeight}
          className="max-w-full"
        />
      </div>
    )
  }

  return (
    <div
      ref={root}
      className={`relative ${className}`}
      style={
        slideFrom !== slideTo || driftFrom !== driftTo
          ? {
              transform: `translate3d(${slideFrom}%, ${driftFrom}%, 0)`,
              willChange: 'transform',
            }
          : undefined
      }
    >
      <div ref={host} className="h-full w-full" aria-hidden="true" />
      {/* the mark is decorative in the canvas; give assistive tech the words */}
      <span className="sr-only">Kaf Tarım</span>
      {canReplay && (
        <button
          type="button"
          onClick={() => scene.current?.replay()}
          className="absolute bottom-0 right-0 rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] opacity-0 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
          style={{ color: 'var(--fg-faint)' }}
        >
          {t.hero.replay}
        </button>
      )}
    </div>
  )
}
