import { FRONT_VIDEO } from '../lib/constants'
import { WhatsAppCTA } from './WhatsAppCTA'

/*
 * Bodoni Moda para el título del hero. Es variable en el eje `opsz`
 * (6..96) y con font-optical-sizing por defecto en `auto` el navegador
 * sube la óptica según el font-size — a 10rem eso adelgaza los remates
 * y da el contraste didone que buscamos.
 *
 * Las otras candidatas quedaron comparables en /tipografias.html; si
 * cambiás de fuente acordate de pedirla también en index.html.
 */
const HEADING_STYLE = {
  className: 'uppercase tracking-[0.01em]',
  style: { fontFamily: "'Bodoni Moda', serif", fontWeight: 400 },
} as const

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Layer 1 — full-bleed video background */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={FRONT_VIDEO}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Layer 2 — scrim so white type and nav stay legible over the light video */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[45vh] bg-gradient-to-b from-black/25 to-transparent" />

      {/* Layer 3 — hero heading */}
      <div className="absolute inset-x-0 top-20 z-20 px-6 sm:top-28 sm:px-10 md:top-32">
        <h1
          className={`leading-[0.9] text-white text-[2.25rem] xs:text-[2.75rem] sm:text-[4.25rem] md:text-[5.5rem] lg:text-[6.5rem] ${HEADING_STYLE.className}`}
          style={HEADING_STYLE.style}
        >
          <span className="block animate-slide-in-left motion-reduce:animate-none">Cire</span>
          <span className="block animate-slide-in-right motion-reduce:animate-none [animation-delay:250ms]">
            depilación
          </span>
        </h1>
      </div>

      {/*
        CTA del hero, anclado abajo y no debajo del título: el h1 llega a 10rem
        en desktop y su alto cambia por breakpoint, así que colgarlo del título
        lo empujaba fuera de pantalla en algunos tamaños.

        Es la superficie que más tráfico de anuncios recibe, así que va con sku
        propio (`home-hero`) — si compartiera el del botón flotante no se podría
        comparar cuál de los dos convierte.
      */}
      <div className="absolute inset-x-0 bottom-24 z-20 px-6 sm:bottom-28 sm:px-10">
        <WhatsAppCTA
          context={{
            sku: 'home-hero',
            nombre: 'sus servicios',
            categoria: 'general',
            placement: 'hero',
          }}
        >
          Agenda por WhatsApp
        </WhatsAppCTA>
      </div>
    </section>
  )
}
