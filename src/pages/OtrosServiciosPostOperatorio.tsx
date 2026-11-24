import { PageShell, SectionHeading } from '../components/PageShell'
import { PaqueteCards } from '../components/PaqueteCards'
import { Reveal } from '../components/Reveal'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CIRE_SCULPT_POST_OPERATORIO } from '../data/precios'

export function OtrosServiciosPostOperatorio() {
  useDocumentMeta({
    title: 'Masaje post operatorio y drenaje: precios',
    description:
      'Cire Sculpt Post Op: drenaje y acompañamiento en tu recuperación después de una cirugía estética. Precios por número de sesiones en CDMX y Metepec.',
  })

  return (
    <PageShell
      eyebrow="Masaje post operatorio"
      title="Cire Sculpt Post Operativo"
      intro="Post Op: drenaje y acompañamiento en tu recuperación, con precio por número de sesiones."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Otros servicios', to: '/otros-servicios' },
      ]}
    >
      <Reveal className="space-y-6">
        <SectionHeading>Precios</SectionHeading>
        <PaqueteCards paquetes={CIRE_SCULPT_POST_OPERATORIO} categoria="otros" />
      </Reveal>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'post-operatorio', nombre: 'el post-operatorio', categoria: 'otros', articulo: 'el' }}
        titulo="¿Necesitas acompañamiento post-operatorio?"
        texto="Cuéntanos de tu cirugía y te armamos el protocolo de sesiones que te conviene."
      >
        Consultar por WhatsApp
      </WhatsAppSection>
    </PageShell>
  )
}
