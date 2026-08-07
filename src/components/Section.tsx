import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  tone?: 'default' | 'alt' | 'dark'
  className?: string
  children: ReactNode
}

const TONES: Record<NonNullable<SectionProps['tone']>, string> = {
  default: '',
  alt: 'bg-blush-50/60',
  /*
   * Banda de alto contraste, para el bloque de la oferta (ver Home.tsx).
   * `isolate` le da stacking context propio para que el resplandor blush de
   * abajo (que va en `-z-0` relativo a esta sección) no se compare contra el
   * fondo ambiental del Layout y termine pintado detrás de él.
   */
  dark: 'isolate bg-ink text-white',
}

/*
 * Wrapper de cada bloque de una landing (Beneficios, Precios, Reseñas,
 * Agendar...). El padding vertical es a propósito generoso (96/128/144px):
 * es lo que hace que la página se sienta como un scroll con ritmo y no como
 * todo comprimido en una pantalla. `tone="alt"` alterna un fondo tintado
 * para que el ojo note el cambio de sección al hacer scroll, sin depender
 * solo del espacio en blanco.
 *
 * No reemplaza a PageShell (que sigue siendo el header de cada página): este
 * es el wrapper de cada sección que va debajo.
 *
 * `tone="dark"` es el tercer registro (05/ago/26): el sitio entero eran
 * secciones blancas y blush-50/60 alternadas, y pasado cierto largo esa
 * alternancia deja de leerse como ritmo y pasa a leerse como una sola página
 * plana. Una banda negra corta el scroll de verdad, y por eso se reserva para
 * lo que tiene que destacar (la oferta) en vez de entrar en la alternancia.
 */
export function Section({ id, tone = 'default', className = '', children }: SectionProps) {
  return (
    <section id={id} className={`scroll-anchor relative py-24 sm:py-32 lg:py-36 ${TONES[tone]} ${className}`}>
      {/* Resplandor blush sobre el negro: es lo que ata la banda oscura a la
          paleta de la marca en vez de dejarla como un rectángulo negro pegado
          encima de una página rosa. */}
      {tone === 'dark' && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blush-500/25 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blush-400/20 blur-3xl" />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 sm:px-10">{children}</div>
    </section>
  )
}
