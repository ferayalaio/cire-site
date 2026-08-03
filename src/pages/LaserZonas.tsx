import { Link } from 'react-router-dom'
import { LinkCard, PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Reveal, Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { COMBOS, ZONAS, formatPrecio, hayPrecio } from '../data/precios'
import { TESTIMONIOS_DESTACADOS_ALT } from '../data/testimonios'

export function LaserZonas() {
  useDocumentMeta({
    title: 'Depilación láser: precios por zona',
    description:
      'Cada zona de depilación láser por separado, con precio por sesión y por paquete. Si tratas más de una, los combos casi siempre salen mejor.',
  })

  return (
    <PageShell
      eyebrow="Depilación láser"
      title="Precios por zona"
      intro="Cada zona por separado. Si vas a tratar más de una, los combos casi siempre salen mejor."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
    >
      <Reveal className="space-y-4">
        <SectionHeading>Tabla de zonas</SectionHeading>

        {/*
          Cinco columnas no entran en 375px. Antes el borde de la tarjeta
          usaba `overflow-hidden` y directamente recortaba "Sesiones" y el
          link de upsell sin dejar rastro de que faltaba algo. Ahora el
          scroll horizontal vive en un div interno (así el `rounded-2xl` de
          la tarjeta sigue recortando solo las esquinas) y el aviso de swipe
          solo se muestra en mobile, donde hace falta.
        */}
        <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.07] text-neutral-400">
                  <th className="px-5 py-3 font-normal">Zona</th>
                  <th className="px-5 py-3 font-normal">Por sesión</th>
                  <th className="px-5 py-3 font-normal">Paquete</th>
                  <th className="px-5 py-3 font-normal">Sesiones</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {ZONAS.map((zona) => (
                  <tr key={zona.slug} className="border-b border-black/[0.05] transition-colors last:border-0 hover:bg-blush-50/60">
                    <td className="px-5 py-4 text-neutral-900">{zona.nombre}</td>
                    <td className="px-5 py-4 text-neutral-600">
                      {formatPrecio(zona.precioSesion) ?? <span className="text-neutral-300">Pendiente</span>}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {formatPrecio(zona.precioPaquete) ?? <span className="text-neutral-300">Pendiente</span>}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">{zona.sesiones ?? '—'}</td>
                    <td className="px-5 py-4">
                      {/*
                        Zonas sin combo exacto: el upsell a Full Body va en la
                        misma fila, no como bloque aparte, para que se lea en el
                        momento en que la persona está mirando justo esa zona.
                      */}
                      {zona.sinComboExacto && (
                        <Link
                          to="/laser/cuerpo-completo"
                          className="whitespace-nowrap text-xs font-medium text-neutral-500 underline hover:text-neutral-900"
                        >
                          Ahorra más con Full Body →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-neutral-400 sm:hidden">Desliza para ver todas las columnas →</p>

        {!hayPrecio(...ZONAS.flatMap((z) => [z.precioSesion, z.precioPaquete])) && (
          <Placeholder label="Pendiente: cargar precios del tarifario en src/data/precios.ts" />
        )}
      </Reveal>

      <Reveal className="mt-16 space-y-6">
        <SectionHeading>Combos</SectionHeading>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-500">
          Si tratas más de una zona, un combo casi siempre sale mejor que sumarlas sueltas. El
          precio del combo es fijo: quitar una zona no genera descuento.
        </p>

        <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.07] text-neutral-400">
                  <th className="px-5 py-3 font-normal">Combo</th>
                  <th className="px-5 py-3 font-normal">Por sesión</th>
                  <th className="px-5 py-3 font-normal">Paquete</th>
                  <th className="px-5 py-3 font-normal">Sesiones</th>
                </tr>
              </thead>
              <tbody>
                {COMBOS.map((combo) => (
                  <tr key={combo.slug} className="border-b border-black/[0.05] transition-colors last:border-0 hover:bg-blush-50/60">
                    <td className="px-5 py-4 text-neutral-900">{combo.nombre}</td>
                    <td className="px-5 py-4 text-neutral-600">
                      {formatPrecio(combo.precioSesion) ?? <span className="text-neutral-300">Pendiente</span>}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {formatPrecio(combo.precioPaquete) ?? <span className="text-neutral-300">Pendiente</span>}
                    </td>
                    <td className="px-5 py-4 text-neutral-600">{combo.sesiones ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-neutral-400 sm:hidden">Desliza para ver todas las columnas →</p>

        <p className="text-xs text-neutral-400">
          El 5% de descuento en efectivo de los combos se confirma por WhatsApp, no está reflejado
          en esta tabla.
        </p>
      </Reveal>

      <Reveal className="mt-16 space-y-4">
        <SectionHeading>Te puede convenir el Full Body</SectionHeading>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          <LinkCard
            to="/laser/cuerpo-completo"
            meta="Full Body"
            title="Cuerpo completo"
            description="Si estás sumando tres zonas o más, el paquete completo suele costar menos."
          />
          <LinkCard
            to="/laser/bikini"
            meta="4 niveles"
            title="Bikini"
            description="Del básico al brazilian, con la cobertura de cada nivel."
          />
        </Stagger>
      </Reveal>

      <Reveal className="mt-16">
        <TestimoniosSection testimonios={TESTIMONIOS_DESTACADOS_ALT} />
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'laser-zonas', nombre: 'una zona', categoria: 'laser', articulo: 'la' }}
        titulo="¿No sabes por dónde empezar?"
        texto="Cuéntanos qué zona te interesa y te armamos la mejor combinación de precio."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
