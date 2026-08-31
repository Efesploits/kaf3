import { useEffect, useRef, useState } from 'react'
import type { LogoScene } from '../lib/logo3d'
import { useI18n } from '../i18n'
import Logo from './Logo'

/**
 * Mounts the extruded 3D mark. three.js is loaded on demand so the rest of the
 * site is not held up by it, and anything that cannot run WebGL simply gets the
 * flat vector logo instead.
 */
export default function HeroLogo3D({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<LogoScene | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [canReplay, setCanReplay] = useState(false)
  const { theme, t } = useI18n()

  useEffect(() => {
    let cancelled = false
    let instance: LogoScene | null = null

    ;(async () => {
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
          quality: lean ? 'low' : 'high',
          onContextLost: () => setState('fallback'),
        })
        scene.current = instance
        if (import.meta.env.DEV) {
          ;(window as unknown as Record<string, unknown>).__kafLogo = instance
        }
        setCanReplay(!instance.isStatic)
        setState('ready')
      } catch {
        if (!cancelled) setState('fallback')
      }
    })()

    return () => {
      cancelled = true
      instance?.dispose()
      scene.current = null
      if (import.meta.env.DEV) {
        delete (window as unknown as Record<string, unknown>).__kafLogo
      }
    }
  }, [])

  useEffect(() => {
    scene.current?.setTheme(theme === 'dark')
  }, [theme, state])

  if (state === 'fallback') {
    return (
      <div className={`grid place-items-center ${className}`}>
        <Logo variant="full" height={160} className="max-w-full" />
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
