import { Children } from 'react'
import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

/*
 * Mismo fade-up que el encabezado de PageShell (ver `animate-fade-in-up` en
 * index.css), pero disparado por scroll en vez de al montar — así una sección
 * que vive más abajo en la página anima al llegar, no solo la primera pantalla.
 * Vive fuera de PageShell porque cada página decide qué bloques envolver.
 */
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const DURATION = '700ms'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section'
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  const style = {
    transitionProperty: 'opacity, transform',
    transitionDuration: DURATION,
    transitionTimingFunction: EASING,
    transitionDelay: `${delay}ms`,
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(1rem)',
  }

  if (as === 'section') {
    return (
      <section ref={ref} className={className} style={style}>
        {children}
      </section>
    )
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

// Mismo tope que la vieja `.stagger-fade`: pasado cierto punto ya no se nota
// la diferencia y solo alarga la espera del último elemento en grids grandes.
const MAX_DELAY = 350

interface StaggerProps {
  children: ReactNode
  className?: string
  /** ms de diferencia entre la entrada de un hijo y el siguiente. */
  step?: number
  /** Duración de la transición de cada hijo. */
  duration?: number
  /**
   * 'up' (default): entra con fade-up, igual que antes.
   * 'sides': entra deslizándose desde el lado — pares desde la izquierda,
   * nones desde la derecha. Pensado para grids anchos (p. ej. sucursales),
   * donde el movimiento horizontal se nota más que un fade-up.
   */
  direction?: 'up' | 'sides'
}

/*
 * Reveal para grids y listas de tarjetas (servicios, precios, sucursales):
 * un solo observer en el contenedor, cada hijo entra con su propio delay
 * según su posición. Reemplaza a `.stagger-fade`, que solo animaba al montar.
 */
export function Stagger({
  children,
  className = '',
  step = 70,
  duration = 600,
  direction = 'up',
}: StaggerProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        const hiddenTransform =
          direction === 'sides'
            ? `translateX(${index % 2 === 0 ? '-4rem' : '4rem'})`
            : 'translateY(1rem)'

        return (
          <div
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: EASING,
              transitionDelay: `${Math.min(index * step, MAX_DELAY)}ms`,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translate(0, 0)' : hiddenTransform,
            }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
