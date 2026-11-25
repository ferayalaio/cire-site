import { Faq } from '../components/Faq'
import { PageShell } from '../components/PageShell'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CIRE_SCULPT_POST_OPERATORIO } from '../data/precios'
import { FAQ_CORPORAL } from '../data/faq'
import { CatalogoSesiones } from '../components/CatalogoSesiones'

const CTA_CONTEXT = {
  sku: 'post-operatorio',
  nombre: 'el post-operatorio',
  categoria: 'otros',
  articulo: 'el',
} as const

/* La pregunta del FAQ corporal que aplica a una recuperación post cirugía. */
const PREGUNTAS = FAQ_CORPORAL.filter((item) => item.pregunta === '¿Cuándo necesito una valoración especial?')

export function OtrosServiciosPostOperatorio() {
  useDocumentMeta({
    title: 'Masaje post operatorio y drenaje: precios',
    description:
      'Cire Sculpt Post Op: drenaje y acompañamiento en tu recuperación después de una cirugía estética. Precios por número de sesiones en CDMX y Metepec.',
  })

  return (
    <PageShell
      title="Masaje post operatorio Cire Sculpt"
      intro="Post Op: drenaje y acompañamiento en tu recuperación, con precio por número de sesiones."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Otros servicios', to: '/otros-servicios' },
      ]}
    >
      <CatalogoSesiones
        titulo="Cire Sculpt Post Op"
        paquetes={CIRE_SCULPT_POST_OPERATORIO}
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
        titulo="¿Necesitas acompañamiento post-operatorio?"
        texto="Cuéntanos de tu cirugía y te armamos el protocolo de sesiones que te conviene."
      >
        Consultar por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
