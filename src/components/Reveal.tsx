import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** ms before the transition starts once the element is in view */
  delay?: number
  /** `clip` wipes in from the left, useful for headings and rules */
  variant?: 'rise' | 'clip'
  as?: ElementType
  className?: string
  /** fraction of the element that must be visible before it reveals */
  amount?: number
  style?: React.CSSProperties
}

/**
 * Scroll-reveal primitive. One shared observer per instance is cheap enough and
 * keeps each element independent; the animation itself lives in CSS so it stays
 * off the main thread and respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'rise',
  as: Tag = 'div',
  className = '',
  amount = 0,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: amount, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount])

  const base = variant === 'clip' ? 'reveal-clip' : 'reveal'

  return (
    <Tag
      ref={ref}
      className={`${base} ${className}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
