import { Faq } from '../components/Faq'
import { PageShell } from '../components/PageShell'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { MOLDEO_CORPORAL } from '../data/precios'
import { FAQ_CORPORAL } from '../data/faq'
import { CatalogoSesiones, FOTO_CORPORAL } from '../components/CatalogoSesiones'

/*
 * Antes esta página mostraba dos fotos de public/resultados-reales/ bajo
 * "Resultados reales". No son comparativas de clientas (ver PRODUCT.md), así
 * que se reemplazan por la foto de cabina corregida de /sesion/, sin
 * presentarla como resultado.
 */

const CTA_CONTEXT = {
  sku: 'moldeo-corporal',
  nombre: 'moldeo corporal',
  categoria: 'otros',
  articulo: 'el',
} as const

/* Las dos preguntas del FAQ corporal que ayudan a elegir entre Cire-Na y Cire Body. */
const PREGUNTAS = FAQ_CORPORAL.filter((item) =>
  [
    '¿Qué diferencia hay entre Moldeo Cire-Na y Cire Body?',
    '¿Los tratamientos corporales sirven para bajar de peso?',
  ].includes(item.pregunta),
)

export function OtrosServiciosMoldeoCorporal() {
  useDocumentMeta({
    title: 'Moldeo corporal: Cire-Na y Cire Body, precios',
    description:
      'Moldeo corporal con Moldeo Cire-Na y Cire Body: precios por número de sesiones. Sucursales en CDMX y Metepec, agenda por WhatsApp.',
  })

  return (
    <PageShell
      title="Moldeo corporal"
      intro="Moldeo Cire-Na y Cire Body, con precio por número de sesiones."
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Otros servicios', to: '/otros-servicios' },
      ]}
    >
      <CatalogoSesiones
        titulo="Moldeo corporal"
        paquetes={MOLDEO_CORPORAL}
        categoria="otros"
        context={CTA_CONTEXT}
        ctaLabel="Consultar por WhatsApp"
      />

      <section className="mt-20 grid gap-10 sm:mt-28 md:grid-cols-[0.8fr_1.2fr] md:items-start lg:gap-16">
        <img
          src={FOTO_CORPORAL.src}
          alt={FOTO_CORPORAL.alt}
          loading="lazy"
          width={480}
          height={640}
          className="aspect-[4/3] w-full rounded-2xl object-cover object-[50%_62%] md:aspect-[3/4] md:max-w-sm"
        />
        <Faq items={PREGUNTAS} titulo="¿Cuál elijo?" />
      </section>

      <WhatsAppSection
        id="agendar"
        context={CTA_CONTEXT}
        titulo="¿No sabes cuál te conviene?"
        texto="Cuéntanos qué buscas y te ayudamos a elegir entre Moldeo Cire-Na y Cire Body."
      >
        Consultar por WhatsApp
      </WhatsAppSection>

      <div className="h-20 sm:h-28" aria-hidden="true" />
    </PageShell>
  )
}
