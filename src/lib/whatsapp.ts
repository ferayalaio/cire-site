/*
 * Construcción de los links a WhatsApp.
 *
 * Separado de `analytics.ts` a propósito: acá se decide a qué número va y con
 * qué mensaje sale, allá se decide qué se le reporta a Meta y a GA4. Son dos
 * cosas que cambian por motivos distintos.
 *
 * UN SOLO NÚMERO para las cinco sucursales. El diferenciador de sucursal va
 * dentro del texto del mensaje, no en el número — así el equipo atiende todo
 * desde una línea y el sitio no tiene que enrutar nada.
 */

import type { WhatsAppClickContext } from './analytics'
import { getCampaignLabel } from './attribution'
import { nombreSucursal } from '../data/sucursales'
import { getLastSucursal } from './sucursal-context'

/*
 * Se limpia todo lo que no sea dígito para que el env var aguante cómo esté
 * escrito el número donde se copió (`+52 55 1234 5678`, `52-55-...`): wa.me
 * necesita dígitos pegados y un `+` o un espacio de más rompe el link entero.
 */
function onlyDigits(value: string | undefined): string {
  return (value ?? '').replace(/\D/g, '')
}

const PHONE = onlyDigits(import.meta.env.VITE_WHATSAPP_PHONE)

let warnedMissingPhone = false

function resolvePhone(): string {
  if (!PHONE && import.meta.env.DEV && !warnedMissingPhone) {
    warnedMissingPhone = true
    console.warn(
      '[whatsapp] Falta VITE_WHATSAPP_PHONE en .env.local — los botones apuntan a wa.me sin número.',
    )
  }

  return PHONE
}

/*
 * Contracción de "de" + artículo, para que el mensaje se lea como algo que
 * escribiría una persona: "información del Full Body", "de la depilación con
 * cera", "de las axilas". Sin esto saldría "información de el Full Body".
 */
const CONTRACCION: Record<string, string> = {
  el: 'del',
  la: 'de la',
  los: 'de los',
  las: 'de las',
}

function deArticulo(articulo: string | undefined): string {
  return CONTRACCION[articulo ?? 'el'] ?? 'del'
}

/*
 * El mensaje que la persona ve prellenado antes de enviar. Tres criterios:
 *
 * 1. Puede ser cálido — ya está simulando el arranque de la conversación de
 *    WhatsApp, que es donde vive la personalidad de la marca. El sitio es frío
 *    a propósito; el mensaje no tiene por qué serlo.
 * 2. Tiene que leerse como algo que un humano escribiría, porque es la persona
 *    la que aprieta enviar. Si parece un log, lo borra y escribe "hola" — y ahí
 *    se pierde el contexto justo del lado donde se cierra la venta.
 * 3. Tiene que decirle a quien atiende de dónde viene sin obligarlo a
 *    preguntar. De ahí el `ref` corto al final: el sku y, si vino de campaña,
 *    la campaña.
 *
 * El `fbclid` no se incluye (ver attribution.ts): son cien y pico de caracteres
 * de ruido en un mensaje que se lee antes de mandarse.
 */
function buildMessage(context: WhatsAppClickContext): string {
  const campaign = getCampaignLabel()
  const ref = `(ref: ${campaign ? `${context.sku}/${campaign}` : context.sku})`

  /*
   * Página de sucursal: la intención es agendar, no informarse. El nombre de la
   * sucursal ya va en la oración, así que no se le suma el "estoy cerca de".
   */
  if (context.intencion === 'agendar' && context.sucursal) {
    return `Hola, quiero agendar en la sucursal ${nombreSucursal(context.sucursal)} ${ref}`
  }

  const partes = [`Hola, quiero información ${deArticulo(context.articulo)} ${context.nombre}`]

  /*
   * Acá está el cruce que hace que el mensaje valga: si la persona ya pasó por
   * una página de sucursal en esta visita, el mensaje lo dice solo. Quien
   * atiende recibe zona + sucursal en el primer mensaje y no gasta dos idas y
   * vueltas en averiguarlo.
   */
  const cerca = context.sucursal ?? getLastSucursal()
  if (cerca) {
    partes.push(`y estoy cerca de ${nombreSucursal(cerca)}`)
  }

  partes.push(ref)

  return partes.join(' ')
}

/*
 * `wa.me` es el formato oficial y el que mejor se comporta en los dos lados: en
 * móvil abre la app instalada y en escritorio manda a WhatsApp Web o a la app de
 * escritorio.
 *
 * El texto se arma con `encodeURIComponent` a mano y NO con URLSearchParams:
 * este último codifica los espacios como `+` (form-encoding) y WhatsApp los
 * muestra tal cual, así que el mensaje prellenado llegaría como
 * "Hola,+quiero+información...". `encodeURIComponent` los codifica como %20, que
 * es lo que espera wa.me.
 */
export function buildWhatsAppUrl(context: WhatsAppClickContext): string {
  return `https://wa.me/${resolvePhone()}?text=${encodeURIComponent(buildMessage(context))}`
}
