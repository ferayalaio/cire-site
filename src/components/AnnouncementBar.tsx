import { useEffect, useState } from 'react'
import { trackAgendarClick } from '../lib/analytics'
import { AGENDAR_URL } from '../lib/site'

/*
 * Cintillo de anuncios de alto contraste, fijo arriba de todo (05/ago/26).
 *
 * Existe porque la única oferta del sitio —el 10% de la primera sesión o la
 * evaluación sin costo, que se repite en el cierre del home— vivía enterrada en el
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
      className="fixed inset-x-0 top-0 z-[53] h-10 bg-morado-700 text-white"
      role="region"
      aria-label="Promoción vigente"
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center gap-3 px-11 sm:px-12">
        {/* `truncate` + `min-w-0`: en un teléfono angosto el copy no entra
            entero, y preferimos que se recorte antes que empujar el botón de
            cerrar fuera de la pantalla. */}
        <p className="min-w-0 truncate text-[13px] leading-none text-white/85">
          <span className="font-semibold text-white">10% en tu primera sesión</span>
          <span className="hidden xs:inline"> o evaluación sin costo</span>
        </p>

        <a
          href={AGENDAR_URL}
          target="_blank"
          rel="noopener"
          onClick={() => trackAgendarClick(ANUNCIO_CONTEXT)}
          className="shrink-0 text-[13px] font-semibold leading-none text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
        >
          Agendar
        </a>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar el anuncio"
        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-3"
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
