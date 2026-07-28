import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { REDES } from '../data/marca'

interface SocialIconProps {
  href: string
  label: string
  children: ReactNode
}

// Círculo de trazo fino, igual que el resto de los controles del sitio (nav,
// botón de menú): sin usar el color de marca de cada red, para que no rompan
// la paleta blanco/negro/blush.
function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.07] text-neutral-500 transition-colors hover:border-blush-300 hover:text-neutral-900"
    >
      {children}
    </a>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-black/[0.07] bg-blush-100">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="max-w-xs">
          <p className="text-sm leading-relaxed text-neutral-500">
            Depilación láser, cera y tratamientos corporales en Ciudad de México y Metepec.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <SocialIcon href={REDES.instagram} label="Cire Depilación en Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </SocialIcon>
            <SocialIcon href={REDES.facebook} label="Cire Depilación en Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M13.4 20.7v-6.9h2.1l.3-2.5h-2.4V9.6c0-.7.2-1.2 1.2-1.2h1.3V6.1c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.9H8.7v2.5h2.1v6.9" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-black/[0.07] pt-6 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Cire Depilación</span>
          <Link to="/aviso-de-privacidad" className="hover:text-neutral-900">
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
