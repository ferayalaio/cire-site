/*
 * Meta Pixel — única puerta de salida de eventos del sitio.
 *
 * El objetivo #1 del sitio es generar clics a WhatsApp que Meta pueda medir con
 * el contexto del paquete que los generó. Para que eso se sostenga, ninguna
 * página llama a `fbq` por su cuenta: todas pasan por `trackWhatsAppClick`. Así
 * queda un solo lugar donde cambiar nombres de evento o parámetros, y no hay
 * forma de agregar un CTA que se olvide de mandar el contexto.
 *
 * Sin `VITE_META_PIXEL_ID` el módulo queda inerte y avisa una vez en dev.
 */

import { getAttribution } from './attribution'
import { ga4Lead, ga4PageView, ga4ViewItem, initGa4 } from './ga4'

/*
 * El pixel de Cire va como default para que el sitio quede medido recién
 * clonado, sin depender de que alguien se acuerde de crear el `.env.local`.
 * El env var sigue ganando, que es lo que permite apuntar a un pixel de prueba
 * sin tocar código.
 */
const DEFAULT_PIXEL_ID = '706257346536151'

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || DEFAULT_PIXEL_ID

interface FbqStub {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[]
  push: unknown
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: FbqStub
    _fbq?: FbqStub
  }
}

/*
 * Equivalente legible al snippet oficial de Meta. Lo importante es el stub que
 * encola: deja que `fbq(...)` sea llamable desde el primer render aunque
 * fbevents.js todavía esté bajando, y cuando el script carga se reemplaza
 * `callMethod` y la cola se drena. Sin esto, un clic en el primer segundo de
 * visita se perdería.
 */
function loadPixelScript(): void {
  if (window.fbq) return

  const stub = function (this: unknown, ...args: unknown[]) {
    if (stub.callMethod) {
      stub.callMethod.apply(stub, args)
    } else {
      stub.queue.push(args)
    }
  } as FbqStub

  stub.queue = []
  stub.push = stub
  stub.loaded = true
  stub.version = '2.0'

  window.fbq = stub
  window._fbq ??= stub

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
}

let initialized = false
let warned = false

function warnMissingId(): void {
  if (warned || !import.meta.env.DEV) return
  warned = true
  console.warn(
    '[analytics] Falta VITE_META_PIXEL_ID en .env.local — no se envía ningún evento a Meta.',
  )
}

/*
 * Idempotente: la llama el hook en cada cambio de ruta y solo la primera vez
 * hace algo. Deliberadamente NO dispara PageView — de eso se encarga
 * `trackPageView`, para que el PageView inicial y los de navegación SPA salgan
 * del mismo lugar y no se duplique el primero.
 */
export function initPixel(): void {
  if (initialized) return
  if (!PIXEL_ID) {
    warnMissingId()
    return
  }

  loadPixelScript()
  window.fbq?.('init', PIXEL_ID)
  initialized = true
}

function isReady(): boolean {
  return initialized && Boolean(window.fbq)
}

/*
 * Arranca las dos plataformas. Es lo único que llama el hook, así que no hay
 * manera de inicializar una y olvidarse de la otra.
 */
export function initTracking(): void {
  initPixel()
  initGa4()
}

/*
 * En una SPA el pixel dispara PageView una sola vez, en la carga inicial:
 * `react-router` cambia de página sin recargar, así que el resto hay que
 * mandarlas a mano o Meta ve una visita de una sola página.
 *
 * El guard por ruta existe por StrictMode, que en dev monta, desmonta y vuelve
 * a montar cada efecto — sin él cada vista contaría doble mientras desarrollás.
 * No afecta a producción ni bloquea volver a una ruta ya visitada (A → B → A
 * manda tres PageViews, porque compara contra la anterior, no contra un
 * historial).
 */
let lastPageViewPath: string | undefined

export function trackPageView(path: string): void {
  if (path === lastPageViewPath) return
  lastPageViewPath = path

  /*
   * El guard de duplicados va antes y afuera de los dos envíos, pero cada
   * plataforma chequea su propia disponibilidad: si el pixel no está
   * configurado, GA4 igual tiene que recibir la vista.
   */
  if (isReady()) window.fbq?.('track', 'PageView')
  ga4PageView(path)
}

export type CtaPlacement = 'hero' | 'card' | 'seccion' | 'floating' | 'footer'

export interface WhatsAppClickContext {
  /**
   * Identificador estable del paquete o servicio. Es LA dimensión por la que se
   * desglosa en Meta, así que conviene que no cambie una vez publicado: si lo
   * renombrás, el histórico del anterior queda cortado. Usar kebab-case
   * jerárquico, ej. `laser-bikini-brasileno`.
   */
  sku: string

  /** Nombre legible. Es lo que se ve en los reportes y en el mensaje enviado. */
  nombre: string

  /** Familia de servicio: `laser`, `cera`, `hifu`, `otros`, `sucursal`, `general`. */
  categoria: string

  /** Dónde estaba el botón, para comparar qué posición convierte mejor. */
  placement: CtaPlacement

  /** Slug de sucursal, cuando el CTA es de una sucursal concreta. */
  sucursal?: string

  /**
   * Precio del paquete en MXN. Opcional porque todavía no hay precios cargados;
   * en cuanto se pase, Meta puede optimizar por valor y reportar ROAS.
   */
  valor?: number

  /**
   * `'agendar'` en los CTA de página de sucursal ("quiero agendar en...");
   * default informativo ("quiero información de..."). Son las dos formas de
   * mensaje que pide el brief.
   */
  intencion?: 'agendar' | 'informar'

  /**
   * Artículo gramatical del `nombre`, para que `whatsapp.ts` arme "información
   * del/de la/de los/de las <nombre>" sin sonar armado. Default `'el'`
   * ("del Full Body"); usar `'la'` para nombres femeninos ("de la depilación
   * con cera"), etc.
   */
  articulo?: 'el' | 'la' | 'los' | 'las'
}

/*
 * `<prefijo>_<timestamp>_<random>`. El timestamp solo no alcanza: dos clics en
 * el mismo milisegundo (doble tap, o el mismo botón en dos pestañas) chocarían
 * y Meta descartaría el segundo como duplicado.
 *
 * El sufijo random sale de `crypto` cuando está disponible, que da mejor
 * entropía que `Math.random`; el fallback existe porque `crypto.randomUUID`
 * solo está en contexto seguro (https o localhost).
 */
function newEventId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)

  return `${prefix}_${Date.now()}_${random}`
}

/*
 * Último `eventID` de Contact emitido. Queda accesible para cuando se agregue
 * el envío server-side: `trackWhatsAppClick` ya lo devuelve al llamador, y
 * esto cubre el caso de necesitarlo desde otro lugar del árbol sin tener que
 * pasarlo por props.
 */
let lastWhatsAppEventId: string | undefined

/*
 * Se dispara en el clic del CTA, antes de que el navegador abra WhatsApp.
 *
 * Manda DOS eventos con los mismos parámetros:
 *
 *  - `Contact`, que es el evento estándar de Meta para intención de contacto.
 *    Al ser estándar, las campañas pueden optimizar contra él sin configurar
 *    nada más.
 *  - `WhatsAppClick`, custom. Existe para que el día que se agregue otro canal
 *    de contacto (teléfono, formulario) esos también sean `Contact` y todavía
 *    quede una métrica limpia de WhatsApp puro.
 *
 * Comparten `eventID` a propósito: Meta deduplica por (nombre de evento, id),
 * no por id solo, así que no se pisan entre ellos — y si más adelante se manda
 * el mismo `Contact` por Conversions API desde el servidor, con ese id se
 * deduplica contra este y no cuenta doble.
 */
export function trackWhatsAppClick(context: WhatsAppClickContext): string {
  const attribution = getAttribution()

  const params: Record<string, unknown> = {
    // Nombres estándar de Meta: habilitan los desgloses ya armados en Ads
    // Manager en lugar de quedar como parámetros custom sueltos.
    content_name: context.nombre,
    content_category: context.categoria,
    content_ids: [context.sku],
    content_type: 'product',

    // Custom, para desglosar en informes y armar conversiones personalizadas.
    cire_sku: context.sku,
    cire_placement: context.placement,
    cire_path: window.location.pathname,
    ...(context.sucursal ? { cire_sucursal: context.sucursal } : {}),
    ...(attribution.utm_campaign ? { cire_campaign: attribution.utm_campaign } : {}),
    ...(attribution.ad_id ? { cire_ad_id: attribution.ad_id } : {}),

    // `value` sin `currency` lo descarta Meta, así que van juntos o no van.
    ...(context.valor !== undefined ? { value: context.valor, currency: 'MXN' } : {}),
  }

  /*
   * El id se genera antes del guard y se guarda, no se descarta al salir del
   * scope: es la pieza que va a necesitar la Conversions API el día que se
   * implemente. El server manda el mismo `Contact` con este `event_id` y Meta
   * lo deduplica contra el que salió del navegador en lugar de contar dos.
   */
  const eventID = newEventId('wa')
  lastWhatsAppEventId = eventID

  if (import.meta.env.DEV) {
    console.info('[analytics] WhatsAppClick', eventID, params)
  }

  if (isReady()) {
    window.fbq?.('track', 'Contact', params, { eventID })
    window.fbq?.('trackCustom', 'WhatsAppClick', params, { eventID })
  } else {
    warnMissingId()
  }

  ga4Lead({
    item_id: context.sku,
    item_name: context.nombre,
    item_category: context.categoria,
    method: 'whatsapp',
    value: context.valor,
    sucursal: context.sucursal,
  })

  return eventID
}

export function getLastWhatsAppEventId(): string | undefined {
  return lastWhatsAppEventId
}

/*
 * ViewContent — se dispara en cada página de paquete. Es lo que le da a Meta la
 * señal de interés por un servicio concreto antes de que haya contacto, y lo
 * que permite después armar públicos de remarketing por paquete visto.
 *
 * `content_name` usa el mismo nombre que el H1 de la página a propósito: si en
 * el reporte dice "Piernas completas" tiene que ser lo que la persona leyó en
 * pantalla, no un slug ni una abreviatura.
 */
export interface ViewContentContext {
  /** Nombre legible del paquete — debe coincidir con el H1 visible. */
  nombre: string

  /** Categoría de contenido. Por defecto, la del negocio. */
  categoria?: string

  /** Slug del paquete, para poder cruzar con `content_ids` de Contact. */
  sku?: string

  /** Precio en MXN cuando esté cargado. */
  valor?: number
}

/*
 * Mismo motivo que `lastPageViewPath`: StrictMode monta, desmonta y remonta cada
 * efecto en dev, así que sin este guard cada paquete visto contaría dos
 * ViewContent mientras desarrollás — y aparecería duplicado en Test Events, que
 * es justo donde se va a verificar que esto funciona.
 *
 * Compara contra el anterior y no contra un historial, así que volver a un
 * paquete ya visto (A → B → A) sí manda el tercer evento.
 */
let lastViewContentKey: string | undefined

export function trackViewContent(context: ViewContentContext): void {
  const key = context.sku ?? context.nombre
  if (key === lastViewContentKey) return
  lastViewContentKey = key

  const params: Record<string, unknown> = {
    content_name: context.nombre,
    content_category: context.categoria ?? 'Depilacion Laser',
    ...(context.sku ? { content_ids: [context.sku], content_type: 'product' } : {}),
    ...(context.valor !== undefined ? { value: context.valor, currency: 'MXN' } : {}),
  }

  if (import.meta.env.DEV) {
    console.info('[analytics] ViewContent', params)
  }

  if (isReady()) {
    window.fbq?.('track', 'ViewContent', params, { eventID: newEventId('vc') })
  } else {
    warnMissingId()
  }

  ga4ViewItem({
    item_id: context.sku ?? context.nombre,
    item_name: context.nombre,
    item_category: context.categoria ?? 'Depilacion Laser',
    value: context.valor,
  })
}

/*
 * Lead — todavía sin usar. Está listo para el formulario de contacto: llamarlo
 * en el submit exitoso (no en el click del botón, o se cuentan intentos
 * fallidos como leads). Devuelve el `eventID` por el mismo motivo que
 * `trackWhatsAppClick`: deduplicación contra Conversions API.
 */
export interface LeadContext {
  /** De dónde salió el formulario: paquete o página. */
  nombre: string
  categoria?: string
  sku?: string
  valor?: number
}

export function trackLead(context: LeadContext): string {
  const attribution = getAttribution()

  const params: Record<string, unknown> = {
    content_name: context.nombre,
    content_category: context.categoria ?? 'Depilacion Laser',
    ...(context.sku ? { content_ids: [context.sku], content_type: 'product' } : {}),
    cire_path: window.location.pathname,
    ...(attribution.utm_campaign ? { cire_campaign: attribution.utm_campaign } : {}),
    ...(attribution.ad_id ? { cire_ad_id: attribution.ad_id } : {}),
    ...(context.valor !== undefined ? { value: context.valor, currency: 'MXN' } : {}),
  }

  const eventID = newEventId('lead')

  if (import.meta.env.DEV) {
    console.info('[analytics] Lead', eventID, params)
  }

  if (isReady()) {
    window.fbq?.('track', 'Lead', params, { eventID })
  } else {
    warnMissingId()
  }

  ga4Lead({
    item_id: context.sku ?? context.nombre,
    item_name: context.nombre,
    item_category: context.categoria ?? 'Depilacion Laser',
    method: 'formulario',
    value: context.valor,
  })

  return eventID
}
