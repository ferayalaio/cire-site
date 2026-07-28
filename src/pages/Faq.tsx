import { Link } from 'react-router-dom'
import { PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Stagger } from '../components/Reveal'
import { WhatsAppSection } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { FASES_VELLO, PREGUNTAS } from '../data/faq'

/*
 * A diferencia del bot —que reserva información para generar conversación—
 * acá las dudas se resuelven abiertamente: el objetivo es que la persona
 * llegue a WhatsApp ya sin dudas, no que llegue a preguntarlas.
 */
export function Faq() {
  useDocumentMeta({
    title: 'Preguntas frecuentes',
    description:
      'Las dudas más comunes antes de la primera sesión de depilación láser: dolor, frecuencia de sesiones, niveles de bikini y qué no cubre el Full Body.',
  })

  return (
    <PageShell
      eyebrow="Preguntas frecuentes"
      title="Lo que casi todas preguntan"
      intro="Las dudas más comunes antes de la primera sesión, resueltas."
    >
      <Stagger className="space-y-10" step={90}>
        {PREGUNTAS.map((item) => (
          <div key={item.slug} className="space-y-3">
            <SectionHeading className="text-2xl sm:text-3xl">{item.pregunta}</SectionHeading>
            {item.respuesta ? (
              item.respuesta.map((parrafo, index) => (
                <p key={index} className="text-sm leading-relaxed text-neutral-600">
                  {parrafo}
                </p>
              ))
            ) : (
              <Placeholder label="Pendiente: respuesta aprobada, en src/data/faq.ts" />
            )}
            {item.verMas && (
              <Link
                to={item.verMas.to}
                className="inline-block text-sm text-neutral-900 underline hover:text-neutral-500"
              >
                {item.verMas.label} →
              </Link>
            )}
          </div>
        ))}

        <div className="space-y-3">
          <SectionHeading className="text-2xl sm:text-3xl">Fases del crecimiento del vello</SectionHeading>
          <ol className="flex flex-wrap gap-3">
            {FASES_VELLO.map((fase, index) => (
              <li
                key={fase}
                className="rounded-full border border-black/[0.07] bg-white px-4 py-2 text-sm text-neutral-600"
              >
                {index + 1}. {fase}
              </li>
            ))}
          </ol>
          <Placeholder label="Pendiente: explicación de cada fase, en src/data/faq.ts" />
        </div>
      </Stagger>

      <WhatsAppSection
        context={{ sku: 'faq', nombre: 'sus servicios', categoria: 'general' }}
        titulo="¿Quedó una duda afuera?"
        texto="Pregúntanos lo que sea por WhatsApp, te contestamos en el día."
      />
    </PageShell>
  )
}
