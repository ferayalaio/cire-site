import { useEffect, useState } from 'react'
import { trackWhatsAppClick } from '../lib/analytics'
import { buildWhatsAppUrl } from '../lib/whatsapp'

/*
 * Cintillo de anuncios de alto contraste, fijo arriba de todo (05/ago/26).
 *
 * Existe porque la única oferta del sitio —el 10% de la primera sesión o la
 * evaluación gratuita, ver LEAD_MAGNET en data/marca.ts— vivía enterrada en el
 * formulario del final del home: quien no scrolleaba hasta abajo no se
 * enteraba nunca de que había un beneficio. Acá se anuncia antes del primer
 * scroll, en la única franja de la página que no compite con nada.
 *
 * Tres decisiones:
 *
 * - Va FIJO y no en el flujo. El nav también es fijo y el hero mide `h-dvh`:
 *   un cintillo en flujo quedaría tapado por el nav apenas se scrollea un
 *   pixel. Como contrapartida el nav tiene que correrse ese alto hacia abajo, y
 *   eso se resuelve con la variable `--anuncio-h` que publica Layout (ver
 *   Layout.tsx y Nav.tsx) — así el alto se declara UNA vez y no queda un número
 *   mágico repetido en tres archivos.
 *
 * - Se puede cerrar, y la decisión se recuerda en `localStorage`. Una barra
 *   fija que no se puede sacar es 2.5rem menos de viewport para siempre, y en
 *   un teléfono eso se paga en el hero. Quien ya la vio y no le interesa, la
 *   cierra.
 *
 * - El enlace pasa por `buildWhatsAppUrl` + `trackWhatsAppClick`, igual que
 *   WhatsAppCTA: es un CTA más y tiene que quedar medido con su propio `sku`
 *   para poder comparar cuánto trae el cintillo contra el resto. No usa
 *   directamente <WhatsAppCTA> porque acá el botón es una pastilla chica
 *   dentro de una franja de 40px, no un CTA de sección.
 */

const ANUNCIO_CONTEXT = {
  sku: 'anuncio-barra',
  nombre: 'la promoción de primera sesión',
  categoria: 'general',
  placement: 'hero',
  articulo: 'la',
  intencion: 'agendar',
} as const

export const ANUNCIO_STORAGE_KEY = 'cire-anuncio-cerrado'

/** Alto del cintillo. Lo consume Layout para correr el nav (ver `--anuncio-h`). */
export const ANUNCIO_ALTO = '2.5rem'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path d="M13.4 2.2c.5 2.6-.3 4.4-1.7 5.9-1.6 1.7-2.4 3-2.4 4.6 0 1 .4 1.9 1 2.5-.2-1.5.4-2.9 1.6-3.9-.2 1.7.5 2.6 1.6 3.6 1.3 1.2 2 2.3 2 3.7 0 2-1.7 3.4-3.5 3.4-3 0-5.9-2.3-5.9-6.1 0-2.5 1.2-4.6 2.8-6.4 1.9-2.1 3.7-4 4.5-7.3Z" />
    </svg>
  )
}

interface AnnouncementBarProps {
  onClose: () => void
}

export function AnnouncementBar({ onClose }: AnnouncementBarProps) {
  return (
    /*
     * z-[53] a propósito: por encima del nav (z-50) para que el cintillo nunca
     * quede tapado, y por debajo del menú mobile (z-[55]) para que el menú
     * abierto lo cubra sin lógica extra — el mismo criterio con el que el botón
     * flotante vive en z-40.
     */
    <div
      className="fixed inset-x-0 top-0 z-[53] h-10 overflow-hidden bg-linear-to-r from-blush-900 via-blush-600 to-blush-500 text-white"
      role="region"
      aria-label="Promoción vigente"
    >
      {/* Destello que barre la franja cada tanto: es lo que la separa de un
          bloque de color plano sin agregarle nada que leer. Puramente
          decorativo, así que `aria-hidden` y apagado con reduced-motion. */}
      <span
        aria-hidden="true"
        className="animate-sheen pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center gap-3 px-10 sm:px-12">
        {/* `truncate` + `min-w-0`: en un teléfono angosto el copy no entra
            entero, y preferimos que se recorte antes que empujar el botón de
            cerrar fuera de la pantalla. */}
        <p className="flex min-w-0 items-center gap-2 text-[11px] font-medium leading-none sm:text-xs">
          <FlameIcon />
          <span className="truncate">
            <strong className="font-semibold">10% OFF</strong> en tu primera sesión o{' '}
            <strong className="font-semibold">Evaluación GRATUITA</strong>
            <span className="hidden xs:inline"> — Reserva hoy</span>
          </span>
        </p>

        {/* El enlace se esconde en pantallas chicas: ahí el cintillo entero ya
            está a un dedo del hero y su CTA, y una segunda pastilla obliga a
            recortar el mensaje justo donde está la oferta. */}
        <a
          href={buildWhatsAppUrl(ANUNCIO_CONTEXT)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(ANUNCIO_CONTEXT)}
          className="hidden shrink-0 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blush-900 transition-transform duration-200 hover:scale-105 sm:inline-block"
        >
          Reserva hoy
        </a>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar el anuncio"
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white sm:right-3"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

/*
 * Estado del cintillo, con la decisión persistida.
 *
 * Arranca en `false` y se prende en un efecto en vez de leer `localStorage` en
 * el inicializador del `useState`: así el primer render es idéntico con y sin
 * la marca guardada, y el nav no se dibuja 40px más abajo para saltar hacia
 * arriba un frame después cuando resulta que el cintillo estaba cerrado.
 */
export function useAnuncio() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(ANUNCIO_STORAGE_KEY) !== '1') setVisible(true)
    } catch {
      // Safari en privado tira al tocar localStorage: mostrarlo igual es el
      // comportamiento correcto, lo único que se pierde es recordar el cierre.
      setVisible(true)
    }
  }, [])

  const cerrar = () => {
    setVisible(false)
    try {
      localStorage.setItem(ANUNCIO_STORAGE_KEY, '1')
    } catch {
      /* ver arriba */
    }
  }

  return { visible, cerrar }
}
