/*
 * Google Analytics 4.
 *
 * Convive con el Meta Pixel sin interferir: son dos scripts independientes y
 * ninguno pisa al otro. Está acá por un motivo concreto — como los precios son
 * abiertos para SEO, GA4 dice qué páginas de zona y de sucursal traen tráfico
 * orgánico, dato que Ads Manager no puede dar porque solo ve tráfico pagado.
 *
 * Las páginas NO llaman a este módulo: lo llama `analytics.ts`, que es la única
 * puerta de salida de eventos. Así no hay forma de mandar algo a Meta y
 * olvidarse de GA4.
 *
 * Sin `VITE_GA4_ID` el módulo queda inerte y avisa una vez en dev.
 */

const GA4_ID = import.meta.env.VITE_GA4_ID

type GtagArgs =
  | ['js', Date]
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: GtagArgs) => void
  }
}

let initialized = false
let warned = false

function warnMissingId(): void {
  if (warned || !import.meta.env.DEV) return
  warned = true
  console.warn('[ga4] Falta VITE_GA4_ID en .env.local — no se envía nada a Google Analytics.')
}

/*
 * Idempotente, igual que `initPixel`. Se llama en cada cambio de ruta y solo la
 * primera vez hace algo.
 *
 * `send_page_view: false` es deliberado: gtag manda un page_view solo al
 * configurarse, pero en una SPA los cambios de ruta no recargan nada y no los
 * vería. Se apaga el automático y se manda todo desde `trackPageView`, así el
 * primero y los de navegación salen del mismo lugar y el inicial no se duplica.
 */
export function initGa4(): void {
  if (initialized) return
  if (!GA4_ID) {
    warnMissingId()
    return
  }

  window.dataLayer ??= []
  window.gtag ??= function gtag(...args: GtagArgs) {
    window.dataLayer?.push(args)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', GA4_ID, { send_page_view: false })

  initialized = true
}

function isReady(): boolean {
  return initialized && Boolean(window.gtag)
}

export function ga4PageView(path: string): void {
  if (!isReady()) return

  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  })
}

/*
 * Los nombres son los eventos recomendados de GA4 (`view_item`,
 * `generate_lead`) y no inventados: los recomendados alimentan los informes ya
 * armados de la consola en lugar de quedar como eventos custom sueltos.
 */
export function ga4ViewItem(params: {
  item_id: string
  item_name: string
  item_category: string
  value?: number
}): void {
  if (!isReady()) return

  window.gtag?.('event', 'view_item', {
    currency: 'MXN',
    ...(params.value !== undefined ? { value: params.value } : {}),
    items: [
      {
        item_id: params.item_id,
        item_name: params.item_name,
        item_category: params.item_category,
        ...(params.value !== undefined ? { price: params.value } : {}),
      },
    ],
  })
}

export function ga4Lead(params: {
  item_id: string
  item_name: string
  item_category: string
  /** `whatsapp` o `formulario`, para separar los dos canales. */
  method: string
  value?: number
  sucursal?: string
}): void {
  if (!isReady()) return

  const payload = {
    method: params.method,
    currency: 'MXN',
    ...(params.value !== undefined ? { value: params.value } : {}),
    ...(params.sucursal ? { sucursal: params.sucursal } : {}),
    items: [
      {
        item_id: params.item_id,
        item_name: params.item_name,
        item_category: params.item_category,
      },
    ],
  }

  window.gtag?.('event', 'generate_lead', payload)

  // Custom, para poder aislar WhatsApp puro el día que haya formulario.
  if (params.method === 'whatsapp') {
    window.gtag?.('event', 'whatsapp_click', payload)
  }
}
