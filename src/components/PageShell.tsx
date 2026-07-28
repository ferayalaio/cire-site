import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
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
  breadcrumbs?: Crumb[]
  children?: ReactNode
}

/*
 * Encabezado común de las páginas internas. El `pt-32` deja libre la franja
 * del nav fijo, que mide 5rem de alto y no participa del flujo.
 */
export function PageShell({ eyebrow, title, intro, breadcrumbs, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:px-10 sm:pt-40">
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
         * tracking sutil) para que la identidad de marca no se quede solo en
         * el home — ver public/tipografias.html para el porqué de la fuente.
         */}
        <h1
          className="uppercase text-4xl leading-[1.05] tracking-[0.01em] text-neutral-900 sm:text-5xl md:text-6xl"
          style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400 }}
        >
          {title}
        </h1>

        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">{intro}</p>}
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

interface LinkCardProps {
  to: string
  title: string
  description: string
  meta?: string
}

// Tarjeta de los hubs (/laser, /ubicaciones) que lleva a cada sub-ruta.
export function LinkCard({ to, title, description, meta }: LinkCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-black/[0.07] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blush-300 hover:shadow-[0_20px_45px_-20px_rgba(166,94,109,0.35)]"
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
