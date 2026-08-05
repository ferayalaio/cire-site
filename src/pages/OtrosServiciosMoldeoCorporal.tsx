import { PageShell, SectionHeading } from '../components/PageShell'
import { PaqueteCards } from '../components/PaqueteCards'
import { Reveal, Stagger } from '../components/Reveal'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { MOLDEO_CORPORAL } from '../data/precios'

// Fotos reales de sesión (radiofrecuencia/cavitación en abdomen). Viven en
// public/resultados-reales/, mismo criterio que /laser: sesión real, no
// antes/después clínico.
const RESULTADOS_REALES = [
  { src: '/resultados-reales/resultado-moldeo-1.png', alt: 'Sesión de moldeo corporal en abdomen' },
  { src: '/resultados-reales/resultado-moldeo-2.png', alt: 'Aplicación de cabezal de radiofrecuencia en abdomen' },
]

export function OtrosServiciosMoldeoCorporal() {
  useDocumentMeta({
    title: 'Moldeo corporal — Moldeo Cire-Na y Cire Body',
    description: 'Precios de moldeo corporal por número de sesiones: Moldeo Cire-Na y Cire Body.',
  })

  return (
    <PageShell
      eyebrow="Otros servicios"
      title="Moldeo corporal"
      intro="Moldeo Cire-Na y Cire Body, con precio por número de sesiones."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Otros servicios', to: '/otros-servicios' },
      ]}
    >
      <Reveal className="space-y-6">
        <SectionHeading>Precios</SectionHeading>
        <PaqueteCards paquetes={MOLDEO_CORPORAL} categoria="otros" />
      </Reveal>

      <Reveal className="mt-16 space-y-6">
        <SectionHeading>Resultados reales</SectionHeading>
        <Stagger className="grid max-w-2xl grid-cols-2 gap-6" step={90}>
          {RESULTADOS_REALES.map(({ src, alt }) => (
            <div
              key={src}
              className="group aspect-[3/4] overflow-hidden rounded-2xl border border-blush-200 shadow-[0_25px_60px_-30px_rgba(166,94,109,0.4)]"
            >
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </Stagger>
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'moldeo-corporal', nombre: 'moldeo corporal', categoria: 'otros', articulo: 'el' }}
        titulo="¿No sabes cuál te conviene?"
        texto="Cuéntanos qué buscas y te ayudamos a elegir entre Moldeo Cire-Na y Cire Body."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
