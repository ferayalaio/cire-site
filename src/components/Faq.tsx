import type { FaqItem } from '../data/faq'
import { SectionHeading } from './PageShell'
import { Stagger } from './Reveal'

/*
 * Acordeón de preguntas frecuentes (ver el contenido y su criterio en
 * src/data/faq.ts).
 *
 * Construido sobre <details>/<summary> nativos y no sobre estado de React a
 * propósito:
 *
 * - Teclado, foco y semántica de "expandido/colapsado" ya vienen resueltos por
 *   el navegador. Reimplementarlos con aria-expanded y onKeyDown es donde se
 *   rompen los acordeones caseros.
 * - Ctrl/Cmd+F encuentra texto dentro de un <details> cerrado en los
 *   navegadores modernos (`hidden=until-found`), cosa que no pasa si el
 *   contenido no está en el DOM.
 * - El contenido está siempre en el HTML, que es lo que necesita el crawler:
 *   la respuesta se indexa aunque la tarjeta arranque cerrada.
 *
 * Sin `name` compartido entre los <details>: cerrar la anterior al abrir una
 * nueva se lee como que el sitio te quita la respuesta que estabas
 * comparando. Acá se pueden tener varias abiertas.
 *
 * El despliegue suave (05/ago/26) se hace con CSS sobre `::details-content`,
 * ver `.faq-item` en index.css: la alternativa era reescribirlo con estado de
 * React y una medición de altura, y eso significaba tirar todo lo de arriba
 * para ganar una transición. Donde el navegador no soporta la propiedad, el
 * acordeón abre de golpe como venía haciendo — que es exactamente el
 * comportamiento actual, no una regresión.
 */

interface FaqProps {
  items: FaqItem[]
  titulo?: string
  intro?: string
}

/*
 * El "+" que gira 45° hasta ser un "−" al abrir.
 *
 * Va dentro de un círculo con fondo, no suelto: a la derecha de una pregunta,
 * un signo sin contorno se lee como parte del texto, y es el único elemento
 * que anuncia que la tarjeta se puede abrir. El círculo lo convierte en un
 * control visible y le da un blanco táctil cómodo en celular.
 *
 * Las dos barras son <path> separados para que solo gire la vertical: girando
 * el ícono entero, la horizontal también rota y el cruce "vibra" a mitad de la
 * animación. Así el trazo horizontal queda fijo y la vertical se le acuesta
 * encima — la transición limpia de + a −.
 */
function PlusIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-50 text-blush-500 transition-colors duration-300 group-open:bg-blush-500 group-open:text-white group-hover:bg-blush-100 group-open:group-hover:bg-blush-600">
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M12 5v14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="origin-center transition-transform duration-300 group-open:rotate-90 motion-reduce:transition-none"
        />
      </svg>
    </span>
  )
}

export function Faq({ items, titulo, intro }: FaqProps) {
  if (items.length === 0) return null

  return (
    <div>
      <SectionHeading>{titulo ?? 'Preguntas frecuentes'}</SectionHeading>
      {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">{intro}</p>}

      <Stagger className="mt-10 max-w-3xl space-y-3" step={60}>
        {items.map((item) => (
          <details
            key={item.pregunta}
            className="faq-item group rounded-2xl border border-black/[0.07] bg-white px-5 transition-all duration-200 open:border-blush-200 open:shadow-[0_20px_45px_-30px_rgba(166,94,109,0.55)] hover:border-blush-300 sm:px-6"
          >
            {/* `list-none` + `::-webkit-details-marker` apagado: sin eso queda
                el triángulo del navegador al lado del ícono propio.

                El foco se dibuja acá con un anillo interior en vez del outline
                del navegador: el outline por defecto rodea al <summary>, que
                es ancho y cuadrado, y se sale de las esquinas redondeadas de
                la tarjeta. */}
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl py-5 text-left text-base font-medium text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 [&::-webkit-details-marker]:hidden">
              <span className="leading-snug">{item.pregunta}</span>
              <PlusIcon />
            </summary>
            {/* El separador solo aparece con la tarjeta abierta: es lo que
                despega la respuesta de la pregunta cuando las dos están a la
                vista, y cerrada no tendría nada que separar. */}
            <p className="border-t border-blush-100 pb-6 pt-4 text-sm leading-relaxed text-neutral-500">
              {item.respuesta}
            </p>
          </details>
        ))}
      </Stagger>
    </div>
  )
}
