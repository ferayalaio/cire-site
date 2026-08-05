import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatedHeading } from './AnimatedHeading'
import { Reveal } from './Reveal'
import { PROMO_ACTIVA } from '../data/precios'

interface Crumb {
  label: string
  to: string
}

interface PageShellProps {
  eyebrow?: string
  title: string
  intro?: string
  /**
   * Bloque opcional debajo del `intro`, para cuando el copy de la página no
   * entra cómodo en un solo párrafo gris (ver /laser/cuerpo-completo: una
   * frase corta como `intro` + el resto del texto en una tarjeta con más
   * jerarquía, mismo patrón que ya usaba HIFU con su propio hero). Sin esto,
   * el header queda igual que siempre — es aditivo, no reemplaza a `intro`.
   */
  introExtra?: ReactNode
  breadcrumbs?: Crumb[]
  /** Acento de video opcional junto al título (ver VideoAccent), solo visible desde `md`. Sin esto, el header queda igual que siempre. */
  media?: ReactNode
  children?: ReactNode
}

/*
 * Encabezado común de las páginas internas. El `pt-32` deja libre la franja
 * del nav fijo, que mide 5rem de alto y no participa del flujo. Sin padding
 * inferior propio: la sección siguiente (`Section`) ya aporta su propio
 * espacio superior, y sumar los dos dejaba un salto enorme entre el intro y
 * el primer heading de sección.
 */
export function PageShell({ eyebrow, title, intro, introExtra, breadcrumbs, media, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 sm:px-10 sm:pt-40">
      <div className={media ? 'grid items-center gap-10 md:grid-cols-[1fr_320px] md:gap-14' : undefined}>
        {/*
         * El bloque de encabezado entra igual que el h1 del hero (fade-up en
         * vez de slide horizontal, porque acá hay una sola línea de contenido
         * y no dos): es el eco de esa animación en cada página interna.
         */}
        <div className="animate-fade-in-up motion-reduce:animate-none">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Ruta" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.to} className="flex items-center gap-2">
                  {/* El separador va antes, no después: puesto al final queda una
                      barra colgando sin nada que la siga. */}
                  {index > 0 && <span aria-hidden="true">/</span>}
                  <Link to={crumb.to} className="hover:text-neutral-900">
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}

          {eyebrow && (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-blush-500">
              {eyebrow}
            </p>
          )}

          {/*
           * Mismo tratamiento que el h1 del hero (Bodoni Moda, mayúsculas,
           * tracking positivo) para que la identidad de marca no se quede solo
           * en el home — ver public/tipografias.html para el porqué de la
           * fuente. El underline se dibuja después de que entran las palabras,
           * como firma visual de que esta es la página en la que estás.
           */}
          <AnimatedHeading
            as="h1"
            underline
            className="heading-1 text-5xl leading-[1.05] text-neutral-900 sm:text-6xl md:text-7xl"
          >
            {title}
          </AnimatedHeading>

          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">{intro}</p>}
          {introExtra}
        </div>

        {media && (
          <div className="hidden animate-fade-in-up motion-reduce:animate-none [animation-delay:150ms] md:block">
            {media}
          </div>
        )}
      </div>

      {/*
       * Vive acá y no en cada página para que una promo cargada en
       * PROMO_ACTIVA (src/data/precios.ts) se vea en todo el sitio con un
       * solo cambio de dato, no solo en /laser como antes.
       */}
      {PROMO_ACTIVA && (
        <Reveal className="mt-10 rounded-2xl border border-blush-200 bg-blush-100 px-6 py-4">
          <p className="text-sm text-neutral-600">
            <span className="font-medium text-neutral-900">{PROMO_ACTIVA.nombre}:</span>{' '}
            {PROMO_ACTIVA.detalle}
          </p>
        </Reveal>
      )}

      {children && <div className="mt-14">{children}</div>}
    </main>
  )
}

// h2 de sección, usado por todas las páginas internas: el tamaño y la
// animación de entrada viven acá una sola vez en vez de repetirse por página.
export function SectionHeading({ children, className = '' }: { children: string; className?: string }) {
  return (
    <AnimatedHeading as="h2" className={`text-3xl text-neutral-900 sm:text-4xl ${className}`}>
      {children}
    </AnimatedHeading>
  )
}

interface LinkCardProps {
  to: string
  title: string
  description: string
  meta?: string
  /**
   * Marco vino ya visible en reposo (no solo al hover) y sombra levantada.
   * Opt-in porque LinkCard se usa también en hubs más neutros (Home,
   * /ubicaciones) donde ese acento no aplica — acá lo pide /laser para que
   * las 4 tarjetas de "armar tu tratamiento" no se vean tan planas.
   */
  accent?: boolean
}

// Tarjeta de los hubs (/laser, /ubicaciones) que lleva a cada sub-ruta.
export function LinkCard({ to, title, description, meta, accent }: LinkCardProps) {
  return (
    <Link
      to={to}
      className={`group flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)] ${
        accent
          ? 'border-blush-200 bg-gradient-to-br from-blush-50 to-white shadow-[0_15px_35px_-22px_rgba(166,94,109,0.4)]'
          : 'border-black/[0.07] bg-white'
      }`}
    >
      {meta && (
        <span className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-blush-500">
          {meta}
        </span>
      )}
      <span className="text-xl text-neutral-900">{title}</span>
      <span className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{description}</span>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900">
        Ver más
        <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  )
}

// Marca visible de sección todavía sin contenido definitivo, para que se note
// qué falta en vez de que la página parezca terminada y vacía.
export function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50/60 px-6 py-10 text-center">
      <p className="text-sm text-neutral-400">{label}</p>
    </div>
  )
}
