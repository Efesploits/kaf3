const files = {
  full: 'kaf-logo.svg',
  compact: 'kaf-logo-compact.svg',
  emblem: 'kaf-emblem.svg',
} as const

/** width / height of each artwork, so the browser can reserve the box */
const ratio = { full: 3.631, compact: 3.612, emblem: 1 } as const

interface Props {
  variant?: keyof typeof files
  className?: string
  /** height in px; width follows the mark's own proportions */
  height?: number
  title?: string
}

/**
 * The real mark, straight from the vector artwork recovered from the company's
 * printed catalogue. It reads correctly on both themes, so no recolouring.
 */
export default function Logo({
  variant = 'compact',
  className = '',
  height = 34,
  title = 'Kaf Tarım',
}: Props) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/${files[variant]}`}
      alt={title}
      width={Math.round(height * ratio[variant])}
      height={height}
      style={{ height }}
      className={`w-auto select-none ${className}`}
      draggable={false}
    />
  )
}
