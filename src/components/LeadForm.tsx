import { useId, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { trackLead } from '../lib/analytics'
import { buildLeadWhatsAppUrl } from '../lib/whatsapp'
import { LEAD_MAGNET } from '../data/marca'

/*
 * Formulario de captura del home (05/ago/26).
 *
 * Para qué está: el botón de WhatsApp pide un salto grande — abrir el chat y
 * escribirle a un desconocido. Quien todavía está comparando precios no lo da.
 * Este formulario es la rampa: dos campos, un beneficio concreto y ninguna
 * conversación que sostener en el momento.
 *
 * NO reemplaza al CTA de WhatsApp, que sigue arriba y sigue siendo el camino
 * principal: es la segunda opción para quien no lo tomó.
 *
 * A dónde va el lead: al mismo WhatsApp, con los datos ya escritos en el
 * mensaje (ver buildLeadWhatsAppUrl en lib/whatsapp.ts). No hay backend en
 * este sitio y agregar uno solo para esto sería un segundo buzón que alguien
 * tendría que acordarse de revisar. La contra, anotada acá para que no
 * sorprenda: si la persona no aprieta "enviar" en WhatsApp, el dato se pierde
 * del lado del negocio. El evento `Lead` se dispara igual, así que esa brecha
 * se puede medir (Lead vs. conversaciones iniciadas) y decidir con números si
 * vale la pena un endpoint real.
 */

const LEAD_SKU = 'lead-magnet-home'

/*
 * Validación deliberadamente laxa: acepta email o teléfono porque el campo es
 * "WhatsApp o email", y lo único que se rechaza es lo que seguro no sirve para
 * devolver el contacto (vacío, o algo sin arroba y con menos de 10 dígitos).
 * Un regex estricto de email acá solo consigue frenar a gente real con
 * direcciones válidas raras — y el costo de un dato mal escrito es que quien
 * atiende lo pregunta de nuevo, no que se rompa nada.
 */
function contactoValido(valor: string): boolean {
  const limpio = valor.trim()
  if (limpio.includes('@')) return limpio.length >= 5
  return (limpio.match(/\d/g) ?? []).length >= 10
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/*
 * Regalo de la insignia. Va como SVG y no como el emoji 🎁 del pedido: el
 * emoji lo dibuja cada sistema operativo con su propia paleta (rojo y amarillo
 * saturados en casi todos), y es justo el elemento que corona el único bloque
 * de color de la página — una nota de color ajena ahí le gana al blush y
 * abarata la promoción en vez de destacarla.
 */
function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path d="M3.5 8.5h17v3h-17zM5 11.5h14V20H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 8.5V20" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8.5S11 4 8.6 4a2 2 0 0 0 0 4.5H12Zm0 0S13 4 15.4 4a2 2 0 0 1 0 4.5H12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/*
 * Marco de "promoción" que envuelve al formulario y también a su estado de
 * confirmación (05/ago/26).
 *
 * Antes el formulario era una tarjeta blanca más, sobre una sección blanca,
 * al lado de un CTA: la única oferta del sitio no se distinguía de un bloque
 * de contenido. Acá el degradado blush y la insignia lo separan del fondo
 * mientras se scrollea, sin recurrir a un color fuera de la paleta.
 *
 * El marco envuelve los dos estados y no solo al formulario a propósito: si
 * desapareciera al enviar, la tarjeta daría un salto de color y de tamaño
 * justo en el momento de la confirmación.
 *
 * La insignia monta sobre el borde superior (`-top-3.5`) en vez de ir adentro:
 * rompe la silueta del rectángulo, que es lo que la hace saltar en un scroll
 * rápido. `pt-*` en el contenido le deja el lugar para que no pise nada.
 */
function PromoShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-3xl border border-blush-300 bg-linear-to-br from-blush-200 via-blush-100 to-blush-50 p-2 shadow-[0_30px_70px_-40px_rgba(166,94,109,0.65)]">
      <span className="absolute -top-3.5 left-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-blush-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_20px_-10px_rgba(166,94,109,0.9)] sm:left-8">
        <GiftIcon />
        {LEAD_MAGNET.badge}
      </span>

      <div className="rounded-[1.25rem] border border-white/70 bg-white px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-9">
        {children}
      </div>
    </div>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-blush-500" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const INPUT_CLASS =
  'w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-200'

export function LeadForm() {
  const nombreId = useId()
  const contactoId = useId()
  const errorId = useId()

  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nombre.trim()) {
      setError('Escribe tu nombre para que sepamos cómo dirigirnos a ti.')
      return
    }
    if (!contactoValido(contacto)) {
      setError('Déjanos un WhatsApp a 10 dígitos o un correo donde podamos responderte.')
      return
    }

    setError(undefined)

    const datos = { nombre: nombre.trim(), contacto: contacto.trim() }

    /*
     * El evento sale en el submit válido y no en el clic del botón: un clic
     * con el formulario incompleto no es un lead, y contarlo infla justo la
     * métrica contra la que después se optimizan las campañas.
     */
    trackLead({
      nombre: 'Lead magnet — 10% primera sesión',
      categoria: 'general',
      sku: LEAD_SKU,
    })

    /*
     * `window.open` y no un <a>: acá el destino depende de lo que la persona
     * acaba de tipear, así que no existe hasta el submit. Es un handler de
     * click directo y sin await, que es la condición para que el navegador no
     * lo trate como popup. Si aun así lo bloquea, el estado de confirmación de
     * abajo deja el enlace a mano.
     */
    window.open(buildLeadWhatsAppUrl(datos, LEAD_SKU), '_blank', 'noopener,noreferrer')
    setEnviado(true)
  }

  if (enviado) {
    return (
      <PromoShell>
        <div className="flex items-start gap-3">
          <CheckCircleIcon />
          <div>
            <p className="font-medium text-neutral-900">Listo, {nombre.trim().split(' ')[0]}.</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">
              Te abrimos WhatsApp con tus datos ya escritos: solo envía el mensaje y una especialista te
              responde con el beneficio aplicado.
            </p>
            <a
              href={buildLeadWhatsAppUrl({ nombre: nombre.trim(), contacto: contacto.trim() }, LEAD_SKU)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-blush-600 underline underline-offset-4"
            >
              ¿No se abrió? Abrir WhatsApp
            </a>
          </div>
        </div>
      </PromoShell>
    )
  }

  return (
    <PromoShell>
      <form onSubmit={handleSubmit} noValidate>
        {/* h3 y no h2: este bloque vive dentro de la sección "¿Lo armamos
            juntas?", que ya aporta el h2 de la sección. */}
        <h3 className="text-xl leading-snug text-neutral-900 sm:text-2xl">{LEAD_MAGNET.titulo}</h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">{LEAD_MAGNET.texto}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={nombreId} className="mb-1.5 block text-xs font-medium text-neutral-600">
              Nombre
            </label>
            <input
              id={nombreId}
              name="nombre"
              type="text"
              autoComplete="given-name"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor={contactoId} className="mb-1.5 block text-xs font-medium text-neutral-600">
              WhatsApp o email
            </label>
            <input
              id={contactoId}
              name="contacto"
              type="text"
              inputMode="text"
              autoComplete="tel"
              placeholder="55 1234 5678 o tu correo"
              value={contacto}
              onChange={(event) => setContacto(event.target.value)}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error ? true : undefined}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {/* `role="alert"` para que el lector de pantalla lo anuncie al
            aparecer: sin eso el error es invisible para quien no ve el cambio
            de color. */}
        {error && (
          <p id={errorId} role="alert" className="mt-3 text-sm text-blush-600">
            {error}
          </p>
        )}

        {/* Ancho completo también en escritorio (antes `sm:w-auto`): dentro
            del marco de promoción el botón es el remate del bloque, y a media
            caja se leía como un control más de un formulario cualquiera. */}
        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-700 active:scale-[0.98]"
        >
          {LEAD_MAGNET.cta}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <ArrowUpRightIcon />
          </span>
        </button>

        <p className="mt-3 text-xs leading-relaxed text-neutral-400">
          Usamos tus datos solo para contactarte sobre tu cita. Consulta nuestro{' '}
          <Link to="/aviso-de-privacidad" className="underline underline-offset-2 hover:text-neutral-600">
            aviso de privacidad
          </Link>
          .
        </p>
      </form>
    </PromoShell>
  )
}
