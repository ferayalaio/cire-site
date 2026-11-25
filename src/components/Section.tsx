import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  tone?: 'default' | 'alt' | 'dark'
  className?: string
  children: ReactNode
}

const TONES: Record<NonNullable<SectionProps['tone']>, string> = {
  default: '',
  /* Rosa satinado: máximo dos bandas por página, nunca dos seguidas. */
  alt: 'bg-rosa-satin',
  /* Ciruela: UNA sección oscura por página (en el home, "¿Duele?"). */
  dark: 'bg-ciruela text-hueso',
}

/*
 * Wrapper de cada bloque de una landing (Beneficios, Precios, Reseñas,
 * Agendar...). El padding vertical es a propósito generoso (80px, 112px desde sm):
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
    <section id={id} className={`scroll-anchor relative py-20 sm:py-28 ${TONES[tone]} ${className}`}>
      <div className="mx-auto max-w-6xl px-6 sm:px-10">{children}</div>
    </section>
  )
}
