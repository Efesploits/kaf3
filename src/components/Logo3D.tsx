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
  replayable = false,
  className = '',
  fallbackHeight = 160,
}: Props) {
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
          quality: lean ? 'low' : 'high',
          onContextLost: () => setState('fallback'),
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
  }, [mode, spin, scrollDriven, replayable])

  useEffect(() => {
    scene.current?.setTheme(theme === 'dark')
  }, [theme, state])

  if (state === 'fallback') {
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
    <div className={`relative ${className}`}>
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
