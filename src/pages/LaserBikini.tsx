import { PageShell, Placeholder } from '../components/PageShell'
import { TestimoniosSection } from '../components/Testimonios'
import { NivelesBikini } from '../components/NivelesBikini'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { NIVELES_BIKINI } from '../data/precios'
import { TESTIMONIOS_LASER_BIKINI } from '../data/testimonios'

/*
 * Bikini (rediseño nov/26). Los 4 niveles van de menor a mayor cobertura (ver
 * data/precios.ts); la interacción vive en components/NivelesBikini.tsx.
 */
export function LaserBikini() {
  useDocumentMeta({
    title: 'Depilación láser de bikini y brazilian: 4 niveles',
    description:
      'Depilación láser de bikini en 4 niveles: básico, sexy, french y brazilian. Qué cubre cada uno y precio del paquete. CDMX y Metepec.',
  })

  return (
    <PageShell
      title="Depilación láser de bikini"
      intro="Elige según cuánta cobertura quieres. Precio por paquete de 8 sesiones."
      compact
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Láser', to: '/laser' },
      ]}
    >
      <section>
        {/* El h2 queda solo para lectores de pantalla: a la vista, los niveles
            van justo debajo del intro, sin otro bloque de texto en medio. */}
        <h2 className="sr-only">{`Los ${NIVELES_BIKINI.length} niveles de bikini`}</h2>
        <NivelesBikini />

        {!NIVELES_BIKINI.some((n) => n.cobertura) && (
          <div className="mt-10">
            <Placeholder label="Pendiente: descripción de cobertura de cada nivel y precios en src/data/precios.ts" />
          </div>
        )}
      </section>

      <section className="mt-20 sm:mt-28">
        <TestimoniosSection testimonios={TESTIMONIOS_LASER_BIKINI} />
      </section>

      <WhatsAppSection
        id="agendar"
        context={{ sku: 'laser-bikini', nombre: 'un nivel de bikini', categoria: 'laser' }}
        titulo="¿No sabes qué nivel elegir?"
        texto="Resultados visibles desde la primera sesión. Cuéntanos qué buscas y te ayudamos a decidir cuál te conviene."
      >
        Consultar por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
