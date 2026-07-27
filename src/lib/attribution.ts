/*
 * Captura de origen de campaña.
 *
 * El problema que resuelve: alguien entra desde un anuncio a `/laser/bikini`
 * con `?utm_campaign=...&ad_id=...`, después navega a `/ubicaciones/polanco` y
 * recién ahí toca WhatsApp. En ese momento la URL ya perdió los parámetros, así
 * que si los leyéramos del `location.search` del clic llegarían vacíos.
 *
 * Por eso se guardan una vez en sessionStorage y se adjuntan a cada evento de
 * WhatsApp. Es sessionStorage y no localStorage a propósito: la atribución
 * pertenece a la visita, no al dispositivo — con localStorage una visita
 * orgánica de la semana siguiente heredaría la campaña de la anterior.
 *
 * Nada de esto reemplaza al `_fbc` que el pixel arma solo con el `fbclid`; es
 * una capa de contexto legible para poder cruzar los reportes a mano.
 */

const STORAGE_KEY = 'cire:attribution'

/*
 * `ad_id`, `adset_id` y `campaign_id` no vienen solos: hay que agregarlos como
 * parámetros de URL dinámicos en el anuncio (Ads Manager > Seguimiento >
 * Parámetros de URL). Si no están configurados, simplemente no se capturan.
 */
const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'ad_id',
  'adset_id',
  'campaign_id',
] as const

export type Attribution = Partial<Record<(typeof TRACKED_PARAMS)[number], string>>

// sessionStorage tira excepción en Safari privado y con cookies bloqueadas. Que
// falle la atribución no puede tumbar el render, así que todo va en try/catch.
function readStorage(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}

/*
 * Se llama en cada cambio de ruta. Solo escribe cuando la URL actual trae
 * parámetros: una navegación interna limpia no puede borrar lo capturado al
 * entrar. Cuando sí trae parámetros, sobreescribe — es un clic de anuncio
 * nuevo y la campaña que corresponde es la última.
 */
export function captureAttribution(): void {
  const params = new URLSearchParams(window.location.search)
  const found: Attribution = {}

  for (const key of TRACKED_PARAMS) {
    const value = params.get(key)
    if (value) found[key] = value
  }

  if (Object.keys(found).length === 0) return

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
  } catch {
    // Sin persistencia el evento igual se envía, solo sin contexto de campaña.
  }
}

export function getAttribution(): Attribution {
  return readStorage()
}

/*
 * Etiqueta corta para el mensaje de WhatsApp. Se prefiere `utm_campaign`
 * porque es legible para quien atiende; el `campaign_id` numérico es el plan B.
 * El `fbclid` queda afuera a propósito: son 100+ caracteres de ruido dentro de
 * un mensaje que la persona va a leer antes de enviarlo.
 */
export function getCampaignLabel(): string | undefined {
  const { utm_campaign, campaign_id } = getAttribution()
  return utm_campaign ?? campaign_id
}
