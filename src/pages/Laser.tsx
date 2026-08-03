import { LinkCard, PageShell, Placeholder, SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Stagger } from '../components/Reveal'
import { TestimoniosSection } from '../components/Testimonios'
import { WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { CLAIMS, MARCA } from '../data/marca'
import { MSI } from '../data/precios'
import { TESTIMONIOS_DESTACADOS } from '../data/testimonios'

interface IconProps {
  className?: string
}

function LayersIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3.5l8 4.3-8 4.3-8-4.3 8-4.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M4 12l8 4.3 8-4.3M4 16.2l8 4.3 8-4.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DeviceIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 4.5h3.5a2 2 0 0 1 2 2V9l3-1v8l-3-1v2.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const BENEFICIOS = [
  { key: 'protocolo', title: 'Protocolo propio', text: CLAIMS.protocolo, Icon: LayersIcon },
  { key: 'tecnologia', title: 'Tecnología de punta', text: CLAIMS.tecnologia, Icon: DeviceIcon },
  { key: 'experiencia', title: 'Experiencia real', text: CLAIMS.experiencia, Icon: ClockIcon },
]

const AGENDAR_CONTEXT = {
  sku: 'laser',
  nombre: 'depilación láser',
  categoria: 'laser',
  placement: 'seccion',
} as const

export function Laser() {
  useDocumentMeta({
    title: 'Depilación láser de diodo — Protocolo Láser Expert 8®',
    description:
      'Depilación láser de diodo con punta de zafiro. Elige cómo armar tu tratamiento: zona por zona, un nivel de bikini, o Full Body en una sola sesión.',
  })

  return (
    <>
      <PageShell
        eyebrow={MARCA.protocolo}
        title="Láser de diodo"
        intro="Elige cómo quieres armar tu tratamiento: zona por zona, un nivel de bikini, o cuerpo completo en una sola sesión."
      />

      <Section id="beneficios">
        <SectionHeading>El protocolo</SectionHeading>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-3" step={90}>
          {BENEFICIOS.map(({ key, title, text, Icon }) => (
            <div key={key} className="rounded-2xl border border-black/[0.07] bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                <Icon />
              </span>
              <p className="mt-4 text-base font-medium text-neutral-900">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{text}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      <Section id="precios" tone="alt">
        <SectionHeading>Elige cómo armar tu tratamiento</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          Zona por zona, un nivel de bikini, o cuerpo completo en una sola sesión.
        </p>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={90}>
          <LinkCard
            to="/laser/zonas"
            meta="A la carta"
            title="Por zonas"
            description="Precio de cada zona individual y a qué combo te conviene pasarte si tratas más de una."
          />
          <LinkCard
            to="/laser/bikini"
            meta="4 niveles"
            title="Bikini"
            description="Del bikini básico al brazilian, con la cobertura de cada nivel."
          />
          <LinkCard
            to="/laser/cuerpo-completo"
            meta="Full Body"
            title="Cuerpo completo"
            description="Todas las zonas en una sesión, al mejor precio por área."
          />
        </Stagger>

        {MSI.disponible && (
          <p className="mt-10 text-sm text-neutral-400">
            Meses sin intereses disponibles{MSI.meses.length > 0 ? ` a ${MSI.meses.join(' y ')} meses` : ''}
            . {MSI.nota}
          </p>
        )}
      </Section>

      <Section id="antes-despues">
        <SectionHeading>Antes y después</SectionHeading>
        <div className="mt-8 max-w-2xl">
          <Placeholder label="Pendiente: subir fotos de antes/después a public/antes-despues/" />
        </div>
      </Section>

      <Section id="resenas" tone="alt">
        <TestimoniosSection testimonios={TESTIMONIOS_DESTACADOS} />
      </Section>

      <Section id="agendar">
        <SectionHeading>¿Lo armamos juntas?</SectionHeading>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
          Cuéntanos qué zona te interesa y te pasamos precios y disponibilidad.
        </p>
        <div className="mt-7">
          <WhatsAppCTA context={AGENDAR_CONTEXT}>Escríbenos por WhatsApp</WhatsAppCTA>
        </div>
      </Section>
    </>
  )
}
