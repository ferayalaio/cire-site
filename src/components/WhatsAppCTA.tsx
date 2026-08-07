import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import type { WhatsAppClickContext } from '../lib/analytics'
import { trackWhatsAppClick } from '../lib/analytics'
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

type Variant = 'primary' | 'secondary' | 'floating'

interface WhatsAppCTAProps {
  context: WhatsAppClickContext
  children?: ReactNode
  variant?: Variant
  className?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]'

const VARIANTS: Record<Variant, string> = {
  primary: `${BASE} bg-neutral-900 px-6 py-3.5 text-white hover:bg-neutral-700`,
  secondary: `${BASE} border border-black/15 px-6 py-3.5 text-neutral-900 hover:border-black/40`,
  // Más grande que primary/secondary a propósito: es el único CTA presente en
  // TODAS las rutas, así que le conviene pesar más que uno de sección.
  floating: `${BASE} bg-neutral-900 px-8 py-5 text-lg text-white shadow-lg shadow-blush-900/30 hover:bg-neutral-700`,
}

// Más grande en floating para que el glifo escale junto con el padding y el
// texto de arriba, en vez de quedar chico dentro de una pastilla más grande.
const GLYPH_SIZE: Record<Variant, string> = {
  primary: 'h-4 w-4',
  secondary: 'h-4 w-4',
  floating: 'h-6 w-6',
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
}: WhatsAppCTAProps) {
  return (
    <a
      href={buildWhatsAppUrl(context)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(context)}
      className={`${VARIANTS[variant]} ${className}`}
    >
      <WhatsAppGlyph className={GLYPH_SIZE[variant]} />
      {children ?? 'Escríbenos por WhatsApp'}
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
  /** Ancla para el scroll contextual del nav (ver RUTAS_CON_AGENDAR en lib/nav.ts). */
  id?: string
  /** Clip opcional de referencia para llenar el espacio libre a la derecha (solo desktop). Sin esto, la tarjeta queda igual que siempre. */
  videoSrc?: string
  /** Frame estático del clip de arriba (ver LoopVideo) — sin esto, la tarjeta se ve negra un instante al entrar a la ruta. */
  videoPoster?: string
  /** Leyenda opcional sobre el video (ver VideoAccent) — sin esto, el clip va sin texto encima. */
  videoCaption?: { tag: string; title: string }
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
}: WhatsAppSectionProps) {
  return (
    <section
      id={id}
      className={`mt-16 rounded-2xl border border-blush-200 bg-blush-100/80 px-6 py-10 shadow-[0_25px_60px_-30px_rgba(166,94,109,0.4)] backdrop-blur-sm sm:px-10 ${videoSrc ? 'sm:flex sm:items-center sm:justify-between sm:gap-8' : ''} ${id ? 'scroll-anchor' : ''}`}
    >
      <div className={videoSrc ? 'sm:max-w-xl' : undefined}>
        <SectionHeading>{titulo ?? '¿Lo armamos juntas?'}</SectionHeading>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
          {texto ?? 'Cuéntanos qué zona te interesa y te pasamos precios y disponibilidad.'}
        </p>
        <div className="mt-7">
          <WhatsAppCTA context={{ ...context, placement: 'seccion' }}>{children}</WhatsAppCTA>
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
 * `true` mientras la sección `#agendar` ocupa la franja inferior del viewport
 * — justo la esquina donde vive el botón flotante.
 *
 * Existe porque esa sección ahora tiene un formulario (ver LeadForm.tsx) y en
 * celular su botón de envío queda debajo del flotante: dos targets táctiles
 * pisados, y el que gana no es el que la persona quiso tocar. De paso resuelve
 * algo que ya molestaba antes: en la única sección que ya tiene su propio CTA
 * a WhatsApp, el flotante no aporta nada y compite consigo mismo.
 *
 * El `rootMargin` negativo arriba es lo que hace que dispare solo cuando la
 * sección llega abajo, y no apenas asoma por el borde inferior de la pantalla.
 */
function useAgendarEnZonaDelBoton(pathname: string): boolean {
  const [enZona, setEnZona] = useState(false)

  useEffect(() => {
    setEnZona(false)

    // No todas las rutas tienen bloque `#agendar` (ver RUTAS_CON_AGENDAR en
    // lib/nav.ts); en esas el botón se comporta como siempre.
    const node = document.getElementById('agendar')
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => setEnZona(entry.isIntersecting), {
      rootMargin: '-60% 0px 0px 0px',
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [pathname])

  return enZona
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

  const oculto = useAgendarEnZonaDelBoton(pathname)

  return (
    /*
     * Se esconde con opacity + pointer-events y no desmontando el nodo: así la
     * salida y la entrada son un fade y no un parpadeo, y `inert` se encarga de
     * que mientras está invisible tampoco lo alcancen el teclado ni un lector
     * de pantalla (sin eso quedaría un link enfocable encima del formulario).
     */
    <div
      inert={oculto ? true : undefined}
      className={`fixed bottom-5 right-5 z-40 transition-opacity duration-300 sm:bottom-7 sm:right-7 ${
        oculto ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/*
       * El anillo que late detrás del botón (ver `pulse-ring` en index.css).
       * Es la única animación permanente del sitio y está puesta con criterio:
       * el flotante está siempre ahí y por eso mismo el ojo lo deja de ver a
       * los dos scrolls: el pulso lo devuelve a la periferia sin moverlo de
       * lugar ni taparle nada al contenido.
       *
       * Va en un hermano absoluto y no en el propio botón: animar el botón
       * significa escalar el texto y el glifo con él. `inset-0` lo calca sobre
       * el CTA, así que el anillo sale exactamente del borde de la pastilla
       * sin que haya que replicar su tamaño a mano.
       */}
      <span className="relative block">
        <span
          aria-hidden="true"
          className="animate-pulse-ring pointer-events-none absolute inset-0 rounded-full bg-blush-400 motion-reduce:hidden"
        />
        <WhatsAppCTA
          context={contextForPath(pathname, slug)}
          variant="floating"
          className="relative"
        >
          WhatsApp
        </WhatsAppCTA>
      </span>
    </div>
  )
}
