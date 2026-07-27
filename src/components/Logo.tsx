import { LOGO_PATH } from '../lib/constants'

interface LogoProps {
  className?: string
}

// El color sale de `currentColor` para que cada contexto lo fije con una clase
// de texto — el nav lo necesita blanco sobre el hero y oscuro en las internas.
export function Logo({ className = 'h-7 w-7 text-white' }: LogoProps) {
  return (
    <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden="true">
      <path d={LOGO_PATH} />
    </svg>
  )
}
