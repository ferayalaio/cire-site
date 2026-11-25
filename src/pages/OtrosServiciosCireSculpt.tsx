import { Faq } from '../components/Faq'
import { PageShell } from '../components/PageShell'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CIRE_SCULPT_ANTICELULITICO } from '../data/precios'
import { FAQ_CORPORAL } from '../data/faq'
import { CatalogoSesiones } from '../components/CatalogoSesiones'

const CTA_CONTEXT = {
  sku: 'cire-sculpt',
  nombre: 'Cire Sculpt Anticelulítico',
  categoria: 'otros',
  articulo: 'el',
} as const

/* Las dos preguntas del FAQ corporal que aplican a este tratamiento. */
const PREGUNTAS = FAQ_CORPORAL.filter((item) =>
  ['¿Los tratamientos corporales sirven para bajar de peso?', '¿Cuándo necesito una valoración especial?'].includes(
    item.pregunta,
  ),
)

export function OtrosServiciosCireSculpt() {
  useDocumentMeta({
    title: 'Tratamiento anticelulítico Cire Sculpt: precios',
    description:
      'Cire Sculpt, tratamiento anticelulítico: precios por número de sesiones. Sucursales en CDMX y Metepec, agenda tu cita por WhatsApp.',
  })

  return (
    <PageShell
      title="Cire Sculpt Anticelulítico"
      intro="Cire Sculpt Anti, con precio por número de sesiones."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Otros servicios', to: '/otros-servicios' },
      ]}
    >
      <CatalogoSesiones
        titulo="Cire Sculpt Anti"
        paquetes={CIRE_SCULPT_ANTICELULITICO}
        categoria="otros"
        context={CTA_CONTEXT}
        ctaLabel="Consultar por WhatsApp"
      />

      <section className="mt-20 sm:mt-28">
        <Faq items={PREGUNTAS} titulo="Antes de agendar" />
      </section>

      <WhatsAppSection
        id="agendar"
        context={CTA_CONTEXT}
        titulo="¿Empezamos con Cire Sculpt?"
        texto="Te confirmamos disponibilidad y el número de sesiones que te conviene por WhatsApp."
      >
        Consultar por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
