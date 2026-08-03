import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  tone?: 'default' | 'alt'
  className?: string
  children: ReactNode
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
 */
export function Section({ id, tone = 'default', className = '', children }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-anchor py-24 sm:py-32 lg:py-36 ${tone === 'alt' ? 'bg-blush-50/60' : ''} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">{children}</div>
    </section>
  )
}
