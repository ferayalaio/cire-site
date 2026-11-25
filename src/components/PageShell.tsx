import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PROMO_ACTIVA } from '../data/precios'
import { useBreadcrumbJsonLd } from '../hooks/useJsonLd'

interface Crumb {
  label: string
  to: string
}

interface PageShellProps {
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
  /**
   * Encabezado apretado para páginas donde lo importante es el contenido de
   * abajo (p. ej. /laser/bikini): menos aire, intro más chico y la promo en
   * una línea, para que el contenido principal entre en la primera pantalla.
   */
  compact?: boolean
}

/*
 * Encabezado común de las páginas internas. El `pt-32` deja libre la franja
 * del nav fijo, que mide 5rem de alto y no participa del flujo. Sin padding
 * inferior propio: la sección siguiente (`Section`) ya aporta su propio
 * espacio superior, y sumar los dos dejaba un salto enorme entre el intro y
 * el primer heading de sección.
 *
 * Al padding se le suma `--anuncio-h` (ver AnnouncementBar.tsx): el nav se
 * corre esos 2.5rem cuando el cintillo está abierto, y sin sumarlos acá el nav
 * quedaba a 4px del breadcrumb en celular en vez de tener aire.
 */
export function PageShell({ title, intro, introExtra, breadcrumbs, media, children, compact = false }: PageShellProps) {
  // Las migas visibles también salen como BreadcrumbList: Google las muestra
  // en el resultado en lugar de la URL cruda.
  useBreadcrumbJsonLd(breadcrumbs, title)

  return (
    <main
      className={`mx-auto max-w-6xl px-6 sm:px-10 ${
        compact
          ? 'pt-[calc(6rem+var(--anuncio-h,0px))] sm:pt-[calc(7rem+var(--anuncio-h,0px))]'
          : 'pt-[calc(6.5rem+var(--anuncio-h,0px))] sm:pt-[calc(8.5rem+var(--anuncio-h,0px))]'
      }`}
    >
      <div className={media ? 'grid items-center gap-10 md:grid-cols-[1fr_320px] md:gap-14' : undefined}>
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Ruta" className={`${compact ? 'mb-3' : 'mb-5'} flex flex-wrap items-center gap-2 text-[14px] text-neutral-600`}>
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.to} className="flex items-center gap-2">
                  {/* El separador va antes, no después: puesto al final queda una
                      barra colgando sin nada que la siga. */}
                  {index > 0 && <span aria-hidden="true">/</span>}
                  <Link to={crumb.to} className="underline-offset-4 hover:text-ink hover:underline">
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}

          <PageHeading>
            {title}
          </PageHeading>

          {intro && (
            <p
              className={`max-w-[60ch] leading-relaxed text-neutral-700 ${
                compact ? 'mt-3 text-[16px] sm:text-[17px]' : 'mt-5 text-[17px] sm:text-lg'
              }`}
            >
              {intro}
            </p>
          )}
          {introExtra}
        </div>

        {media && (
          <div className="hidden md:block">
            {media}
          </div>
        )}
      </div>

      {/*
       * Vive acá y no en cada página para que una promo cargada en
       * PROMO_ACTIVA (src/data/precios.ts) se vea en todo el sitio con un
       * solo cambio de dato, no solo en /laser como antes.
       */}
      {PROMO_ACTIVA &&
        (compact ? (
          <p className="mt-4 inline-block rounded-full bg-blush-100 px-4 py-1.5 text-[14px] text-blush-900/85">
            <span className="font-semibold text-ink">{PROMO_ACTIVA.nombre}:</span>{' '}
            {PROMO_ACTIVA.corto ?? PROMO_ACTIVA.detalle}
          </p>
        ) : (
          <div className="mt-10 rounded-2xl bg-blush-100 px-6 py-4">
            <p className="text-[15px] text-blush-900/85">
              <span className="font-semibold text-ink">{PROMO_ACTIVA.nombre}:</span> {PROMO_ACTIVA.detalle}
            </p>
          </div>
        ))}

      {children && <div className={compact ? 'mt-6 sm:mt-8' : 'mt-14'}>{children}</div>}
    </main>
  )
}

/*
 * H1 de página (rediseño nov/26). Antes llevaba un "eyebrow" en mayúsculas
 * arriba del título para meter la palabra clave en el h1; ahora cada página
 * pasa un título natural que ya la contiene ("Depilación láser de cuerpo
 * completo"), sin etiqueta encima.
 */
export function PageHeading({ className = '', children }: { className?: string; children: string }) {
  return (
    <h1 className={`heading-1 text-[2.5rem] leading-[1.04] text-ink sm:text-[3.25rem] lg:text-[3.75rem] ${className}`}>
      {children}
    </h1>
  )
}

// h2 de sección, usado por todas las páginas internas: el tamaño y la
// animación de entrada viven acá una sola vez en vez de repetirse por página.
export function SectionHeading({ children, className = '' }: { children: string; className?: string }) {
  return <h2 className={`text-[2.125rem] leading-[1.05] text-ink text-balance sm:text-[3rem] ${className}`}>{children}</h2>
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
      className={`group flex flex-col rounded-2xl p-6 transition-colors duration-200 sm:p-7 ${
        accent ? 'bg-blush-100 hover:bg-blush-200/70' : 'bg-white ring-1 ring-black/[0.06] hover:ring-black/20'
      }`}
    >
      <span className="text-2xl font-semibold tracking-[-0.02em] text-ink">{title}</span>
      <span className="mt-2 flex-1 text-[15px] leading-relaxed text-neutral-700">{description}</span>
      {meta && <span className="mt-4 text-[15px] font-semibold text-ink tabular-nums">{meta}</span>}
      <span className="mt-5 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 group-hover:decoration-ink">
        Ver detalle
      </span>
    </Link>
  )
}

// Marca visible de sección todavía sin contenido definitivo, para que se note
// qué falta en vez de que la página parezca terminada y vacía.
export function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50/60 px-6 py-10 text-center">
      <p className="text-[15px] text-neutral-600">{label}</p>
    </div>
  )
}
