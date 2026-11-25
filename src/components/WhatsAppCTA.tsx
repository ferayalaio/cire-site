import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import type { WhatsAppClickContext } from '../lib/analytics'
import { trackAgendarClick, trackWhatsAppClick } from '../lib/analytics'
import { agendarUrl } from '../lib/site'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import { rememberSucursal } from '../lib/sucursal-context'
import { SectionHeading } from './PageShell'
import { VideoAccent } from './VideoAccent'

/*
 * Único camino a WhatsApp en todo el sitio. Cualquier CTA nuevo pasa por acá y
 * por lo tanto queda medido; no hay `<a href="wa.me/...">` suelto en las páginas.
 *
 * Dos decisiones que sostienen la medición y conviene no revertir sin querer:
 *
 * - Es un `<a href>` de verdad, no un botón con `window.open`. Los popups los
 *   bloquean los navegadores en cuanto el handler tarda un poco, y encima así
 *   funcionan el clic con rueda, "abrir en pestaña nueva" y el hover que muestra
 *   el destino.
 *
 * - `target="_blank"`. Además de no perder la visita, es lo que hace confiable
 *   el tracking: `fbq` manda el evento de forma asíncrona, y en una navegación
 *   en la misma pestaña el navegador puede cancelar ese request al descargar la
 *   página. Con la pestaña actual viva, el evento sale completo.
 */

type Variant = 'primary' | 'secondary' | 'floating' | 'link'

interface WhatsAppCTAProps {
  context: WhatsAppClickContext
  children?: ReactNode
  variant?: Variant
  className?: string
  /** Nombre accesible cuando el texto visible se repite ("Cotizar" en cada fila de precios). */
  ariaLabel?: string
}

/*
 * Un solo lenguaje de botón en todo el sitio (rediseño nov/26): rectángulo de
 * esquinas suaves, tinta sólida, sin escalar al pasar el mouse. `link` es la
 * versión de texto para las filas de precio, donde un botón lleno por fila
 * convertiría la lista en una pared de botones.
 */
const BASE =
  'inline-flex items-center justify-center gap-2.5 rounded-btn font-semibold transition-colors duration-200'

const VARIANTS: Record<Variant, string> = {
  primary: `${BASE} min-h-12 bg-ink px-6 py-3 text-[15px] text-white hover:bg-blush-900`,
  secondary: `${BASE} min-h-12 border border-ink/20 bg-white px-6 py-3 text-[15px] text-ink hover:border-ink/50`,
  // Presente en todas las rutas: discreto en tamaño, pero siempre a un toque.
  floating: `${BASE} h-12 bg-ink px-5 text-[15px] text-white shadow-[0_12px_30px_-12px_rgba(43,27,30,0.6)] hover:bg-blush-900`,
  link: 'inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink',
}

const GLYPH_SIZE: Record<Variant, string> = {
  primary: 'h-[18px] w-[18px]',
  secondary: 'h-[18px] w-[18px]',
  floating: 'h-5 w-5',
  link: 'h-4 w-4',
}

function WhatsAppGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} shrink-0`} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.94 1.35-.54.05-1.04.24-3.5-.73-2.96-1.17-4.83-4.24-4.98-4.44-.14-.2-1.18-1.58-1.18-3.01 0-1.43.75-2.13 1.02-2.42.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.19 0 .43-.07.67.5.24.58.83 2.01.9 2.16.07.15.12.32.02.51-.1.2-.36.53-.53.71-.17.19-.25.24-.12.48.14.24.61 1.01 1.31 1.63.9.8 1.66 1.05 1.9 1.17.24.12.38.1.52-.06.14-.17.6-.7.76-.94.17-.24.34-.2.56-.12.22.08 1.42.67 1.66.79.24.12.4.18.46.29.05.1.05.66-.19 1.3Z" />
    </svg>
  )
}

export function WhatsAppCTA({
  context,
  children,
  variant = 'primary',
  className = '',
  ariaLabel,
}: WhatsAppCTAProps) {
  return (
    <a
      href={buildWhatsAppUrl(context)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(context)}
      aria-label={
        ariaLabel ??
        // Los enlaces de fila repiten el mismo texto ("Cotizar") en cada fila:
        // sin esto, un lector de pantalla escucha "Cotizar" diez veces.
        (variant === 'link' && typeof children === 'string' ? `${children}: ${context.nombre}` : undefined)
      }
      className={`${VARIANTS[variant]} ${className}`}
    >
      <WhatsAppGlyph className={GLYPH_SIZE[variant]} />
      {children ?? 'Escríbenos por WhatsApp'}
    </a>
  )
}

function CalendarGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`${className} shrink-0`} aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/*
 * Botón a la agenda en línea (nov/26). Mismo lenguaje visual que WhatsAppCTA
 * (las mismas variantes) para que el sitio siga teniendo un solo tipo de
 * botón; cambia el destino, el ícono y el evento que se mide.
 *
 * Abre en pestaña nueva por la misma razón que WhatsApp: el evento de Meta se
 * manda de forma asíncrona y una navegación en la misma pestaña puede
 * cancelarlo antes de que salga.
 */
export function AgendarCTA({
  context,
  children,
  variant = 'primary',
  className = '',
  ariaLabel,
}: WhatsAppCTAProps) {
  return (
    <a
      // Con sucursal en el contexto (home, /ubicaciones, página de sucursal)
      // va directo a la agenda de esa sucursal; sin ella, a la general.
      href={agendarUrl(context.sucursal)}
      target="_blank"
      rel="noopener"
      onClick={() => trackAgendarClick(context)}
      aria-label={
        ariaLabel ?? (variant === 'link' && typeof children === 'string' ? `${children}: ${context.nombre}` : undefined)
      }
      className={`${VARIANTS[variant]} ${className}`}
    >
      <CalendarGlyph className={GLYPH_SIZE[variant]} />
      {children ?? 'Agendar cita'}
    </a>
  )
}

/*
 * Bloque de cierre de las páginas de servicio. Existe para que el CTA de cada
 * página tenga siempre el mismo lugar y el mismo peso visual, y sobre todo para
 * que agregar una página nueva sea pasarle su `context` — no volver a decidir
 * cómo se ve ni acordarse de instrumentarlo.
 */
interface WhatsAppSectionProps {
  context: Omit<WhatsAppClickContext, 'placement'>
  titulo?: string
  texto?: string
  children?: ReactNode
  /** Ancla del bloque de cierre; el botón flotante se oculta mientras está a la vista. */
  id?: string
  /** Clip opcional de referencia para llenar el espacio libre a la derecha (solo desktop). Sin esto, la tarjeta queda igual que siempre. */
  videoSrc?: string
  /** Frame estático del clip de arriba (ver LoopVideo) — sin esto, la tarjeta se ve negra un instante al entrar a la ruta. */
  videoPoster?: string
  /** Leyenda opcional sobre el video (ver VideoAccent) — sin esto, el clip va sin texto encima. */
  videoCaption?: { tag: string; title: string }
  /** `agendar` manda el botón a la agenda en línea en vez de a WhatsApp. */
  accion?: 'whatsapp' | 'agendar'
}

export function WhatsAppSection({
  context,
  titulo,
  texto,
  children,
  id,
  videoSrc,
  videoPoster,
  videoCaption,
  accion = 'whatsapp',
}: WhatsAppSectionProps) {
  const Boton = accion === 'agendar' ? AgendarCTA : WhatsAppCTA
  return (
    <section
      id={id}
      className={`mt-20 rounded-3xl bg-blush-100 px-6 py-12 sm:mt-28 sm:px-12 sm:py-16 ${videoSrc ? 'sm:flex sm:items-center sm:justify-between sm:gap-8' : ''} ${id ? 'scroll-anchor' : ''}`}
    >
      <div className={videoSrc ? 'sm:max-w-xl' : undefined}>
        <SectionHeading>{titulo ?? '¿Lo armamos juntas?'}</SectionHeading>
        <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-blush-900/85">
          {texto ?? 'Cuéntanos qué zona te interesa y te pasamos precios y disponibilidad.'}
        </p>
        <div className="mt-7">
          <Boton context={{ ...context, placement: 'seccion' }}>{children}</Boton>
        </div>
      </div>
      {videoSrc && (
        <VideoAccent
          src={videoSrc}
          poster={videoPoster}
          caption={videoCaption}
          className="mt-8 hidden shrink-0 sm:mt-0 sm:block sm:h-56 sm:w-48 md:h-[340px] md:w-[300px]"
        />
      )}
    </section>
  )
}

/*
 * Cada página de sucursal llama a este hook una vez para dejar registrada "la
 * sucursal que se está mirando ahora" en la visita. Es lo que le permite a
 * `whatsapp.ts` armar el mensaje combinado ("...y estoy cerca de Coapa") cuando
 * la persona vuelve después a una página de servicio y ahí sí escribe.
 */
export function useRememberSucursal(slug: string | undefined): void {
  useEffect(() => {
    // Vacío pasa cuando el slug de la URL todavía no resolvió a una sucursal
    // válida (o no resolvió nunca) — no hay nada que recordar todavía.
    if (!slug) return
    rememberSucursal(slug)
  }, [slug])
}

/*
 * Contexto del botón flotante según la ruta. Existe en todas las rutas y por lo
 * tanto no puede depender de que la página le pase un paquete — mapear la ruta
 * a un sku propio es lo que evita que todos esos clics caigan en una misma
 * bolsa "general": se sigue sabiendo desde qué página se fue a WhatsApp.
 */
function contextForPath(pathname: string, sucursalSlug: string | undefined): WhatsAppClickContext {
  const [, primero, segundo] = pathname.split('/')

  if (primero === 'laser') {
    if (segundo === 'zonas') {
      return { sku: 'laser-zonas', nombre: 'una zona', categoria: 'laser', placement: 'floating' }
    }
    if (segundo === 'bikini') {
      return {
        sku: 'laser-bikini',
        nombre: 'un nivel de bikini',
        categoria: 'laser',
        placement: 'floating',
      }
    }
    if (segundo === 'cuerpo-completo') {
      return {
        sku: 'full-body',
        nombre: 'el Full Body',
        categoria: 'laser',
        placement: 'floating',
        articulo: 'el',
      }
    }
    return { sku: 'laser', nombre: 'depilación láser', categoria: 'laser', placement: 'floating' }
  }

  if (primero === 'ubicaciones' && segundo) {
    return {
      sku: `sucursal-${segundo}`,
      nombre: 'una cita',
      categoria: 'sucursal',
      placement: 'floating',
      sucursal: segundo,
      intencion: 'agendar',
    }
  }

  if (primero === 'cera') {
    return {
      sku: 'cera',
      nombre: 'la depilación con cera',
      categoria: 'cera',
      placement: 'floating',
      articulo: 'la',
      sucursal: sucursalSlug,
    }
  }

  if (primero === 'hifu') {
    return {
      sku: 'hifu',
      nombre: 'HIFU — Cire Lift Protocol',
      categoria: 'hifu',
      placement: 'floating',
      sucursal: sucursalSlug,
    }
  }

  if (primero === 'otros-servicios') {
    if (segundo === 'moldeo-corporal') {
      return {
        sku: 'moldeo-corporal',
        nombre: 'moldeo corporal',
        categoria: 'otros',
        placement: 'floating',
        articulo: 'el',
        sucursal: sucursalSlug,
      }
    }
    if (segundo === 'cire-sculpt-anticelulitico') {
      return {
        sku: 'cire-sculpt',
        nombre: 'Cire Sculpt Anticelulítico',
        categoria: 'otros',
        placement: 'floating',
        articulo: 'el',
        sucursal: sucursalSlug,
      }
    }
    if (segundo === 'post-operatorio') {
      return {
        sku: 'post-operatorio',
        nombre: 'el post-operatorio',
        categoria: 'otros',
        placement: 'floating',
        articulo: 'el',
        sucursal: sucursalSlug,
      }
    }
    return {
      sku: 'otros',
      nombre: 'sus servicios',
      categoria: 'otros',
      placement: 'floating',
      sucursal: sucursalSlug,
    }
  }

  return {
    sku: 'general',
    nombre: 'sus servicios',
    categoria: 'general',
    placement: 'floating',
    sucursal: sucursalSlug,
  }
}

/*
 * `true` mientras una sección que ya trae su propio CTA a WhatsApp ocupa la
 * pantalla: el hero del home (`#inicio`) arriba y el cierre (`#agendar`)
 * abajo. Ahí el flotante solo competiría con el botón de la sección y le
 * taparía texto en celular.
 *
 * `#agendar` usa un `rootMargin` negativo arriba para disparar solo cuando la
 * sección llega a la franja inferior (donde vive el botón); `#inicio` cuenta
 * mientras siga ocupando la parte alta de la pantalla.
 */
function useSeccionConCtaVisible(pathname: string): boolean {
  const [visibles, setVisibles] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setVisibles({})
    if (typeof IntersectionObserver === 'undefined') return

    const objetivos = [
      { id: 'agendar', rootMargin: '-60% 0px 0px 0px' },
      { id: 'inicio', rootMargin: '0px 0px -45% 0px' },
    ]

    const observers = objetivos.flatMap(({ id, rootMargin }) => {
      // No todas las rutas tienen estas secciones; en esas el botón se
      // comporta como siempre.
      const node = document.getElementById(id)
      if (!node) return []
      const observer = new IntersectionObserver(
        ([entry]) => setVisibles((prev) => ({ ...prev, [id]: entry.isIntersecting })),
        { rootMargin },
      )
      observer.observe(node)
      return [observer]
    })

    return () => observers.forEach((observer) => observer.disconnect())
  }, [pathname])

  return Object.values(visibles).some(Boolean)
}

/*
 * Botón fijo, presente en todas las rutas. Es el que sostiene el objetivo del
 * sitio: no importa cuánto scrolleó la persona ni en qué página está, siempre
 * tiene WhatsApp a un toque.
 *
 * z-40 lo deja debajo del nav (z-50) y del menú mobile (z-[55]), así que el
 * menú abierto lo tapa sin necesidad de lógica extra para esconderlo.
 */
export function WhatsAppFloating() {
  const { pathname } = useLocation()
  // En /ubicaciones/:slug el propio router expone el slug; en el resto de rutas
  // no hay match y useParams devuelve undefined, que es el comportamiento que
  // se necesita para no leer sucursal fuera de esa ruta.
  const { slug } = useParams<{ slug: string }>()

  const oculto = useSeccionConCtaVisible(pathname)

  return (
    /*
     * Se esconde con opacity + pointer-events y no desmontando el nodo: así la
     * salida y la entrada son un fade y no un parpadeo, y `inert` se encarga de
     * que mientras está invisible tampoco lo alcancen el teclado ni un lector
     * de pantalla.
     */
    <div
      inert={oculto ? true : undefined}
      className={`fixed bottom-4 right-4 z-40 transition-opacity duration-300 sm:bottom-6 sm:right-6 ${
        oculto ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <WhatsAppCTA context={contextForPath(pathname, slug)} variant="floating">
        WhatsApp
      </WhatsAppCTA>
    </div>
  )
}
