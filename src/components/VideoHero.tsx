import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n'

interface Props {
  /** basename under public/media: `${src}-1080.webm`, `-1080.mp4`, `-720.mp4` */
  src: string
  poster: string
  children: ReactNode
  /** rendered on the right of the bottom row, next to the pause control */
  aside?: ReactNode
  className?: string
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  )
}

/**
 * Full-bleed looping product film with the page copy over it.
 *
 * The film is decorative and silent, so it autoplays muted; it is still motion
 * that runs longer than five seconds, so there is always a pause control, and
 * anyone who asked for reduced motion (or a data-saving connection) gets the
 * poster and a play button instead of the download. While the hero overlaps
 * the fixed header the document carries `data-hero="dark"`, which the header
 * uses to switch to light-on-dark.
 */
export default function VideoHero({ src, poster, children, aside, className = '' }: Props) {
  const { t } = useI18n()
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  // Decided once: the renditions never need to change under a live page.
  const [quiet] = useState(
    () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true,
  )
  const [small] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  const [paused, setPaused] = useState(quiet)      // what the user asked for
  const [rolling, setRolling] = useState(false)    // what the element is doing
  const [inView, setInView] = useState(true)
  const [failed, setFailed] = useState(false)

  const base = `${import.meta.env.BASE_URL}media/`

  // Play only while the user can actually see it.
  useEffect(() => {
    const el = video.current
    if (!el || failed) return
    // React does not reliably reflect `muted` as an attribute, and autoplay
    // policy checks the property, so set it by hand before any play().
    el.muted = true
    el.defaultMuted = true
    if (paused || !inView) {
      el.pause()
    } else {
      el.play().catch((err: unknown) => {
        // Autoplay refused by policy (iOS Low Power Mode, Firefox "Block Audio
        // and Video", Safari "Never Auto-Play"): show the film's real state so
        // the first press is a play() inside a user gesture. AbortError is our
        // own pause() interrupting a pending play() and must not flip it.
        if ((err as DOMException | undefined)?.name === 'NotAllowedError') setPaused(true)
      })
    }
  }, [paused, inView, failed])

  // The control reports the element's real state, not the intent: a browser
  // can pause the film on its own (low-power mode, a backgrounded tab), and
  // the label must not keep saying "pause" over a stopped film.
  const toggle = () => {
    const el = video.current
    if (el && el.paused) {
      setPaused(false)
      el.play().catch(() => {})
    } else {
      setPaused(true)
    }
  }

  useEffect(() => {
    const el = root.current
    if (!el) return
    const visible = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.05 },
    )
    // Once the hero's bottom edge clears the header, the header goes back to
    // the page's own colours.
    const overlap = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) document.documentElement.setAttribute('data-hero', 'dark')
        else document.documentElement.removeAttribute('data-hero')
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
    )
    visible.observe(el)
    overlap.observe(el)
    return () => {
      visible.disconnect()
      overlap.disconnect()
      document.documentElement.removeAttribute('data-hero')
    }
  }, [])

  return (
    <section ref={root} className={`video-hero ${className}`}>
      <img
        className="poster"
        src={poster}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
      />
      {!failed && (
        <video
          ref={video}
          className="film"
          poster={poster}
          loop
          muted
          playsInline
          autoPlay={!quiet}
          preload={quiet ? 'none' : 'metadata'}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
          onPlaying={() => setRolling(true)}
          onPause={() => setRolling(false)}
          onEnded={() => setRolling(false)}
        >
          {!small && <source src={`${base}${src}-1080.webm`} type="video/webm" />}
          {/* With <source> children the element itself never gets 'error' when
              every rendition fails; the last candidate does. */}
          <source
            src={`${base}${src}-${small ? 720 : 1080}.mp4`}
            type="video/mp4"
            onError={() => setFailed(true)}
          />
        </video>
      )}

      <div className="on-studio shell relative w-full pb-8 pt-[calc(68px+5rem)] md:pb-12 md:pt-[calc(76px+6rem)]">
        {children}

        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 md:mt-14"
          style={{ animation: 'kaf-fade-up .9s var(--ease-out-quint) 1.1s both' }}
        >
          <a
            href="#katalog"
            className="glass hidden items-center gap-3 rounded-full px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:inline-flex"
            style={{ color: 'var(--fg)' }}
          >
            <span className="block h-px w-8" style={{ background: 'currentColor' }} />
            {t.common.scroll}
          </a>

          <div className="flex flex-wrap items-center gap-2">
            {aside}
            {!failed && (
              <button
                type="button"
                onClick={toggle}
                className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-80"
                style={{ color: 'var(--fg)' }}
              >
                {rolling ? <PauseIcon /> : <PlayIcon />}
                {rolling ? t.products.videoPause : t.products.videoPlay}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
