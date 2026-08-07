import { BeneficiosStrip } from '../components/BeneficiosStrip'
import { Faq } from '../components/Faq'
import { Hero } from '../components/Hero'
import { LeadForm } from '../components/LeadForm'
import { SectionHeading } from '../components/PageShell'
import { Section } from '../components/Section'
import { Stagger } from '../components/Reveal'
import { SucursalesHome } from '../components/SucursalesHome'
import { TestimoniosSection } from '../components/Testimonios'
import type { Tratamiento } from '../components/TratamientoCard'
import { TratamientoCard } from '../components/TratamientoCard'
import { WhatsAppCTA } from '../components/WhatsAppCTA'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useFaqJsonLd, useLocalBusinessJsonLd } from '../hooks/useJsonLd'
import { CLAIMS, LEAD_MAGNET, REDES } from '../data/marca'
import { FAQ_HOME } from '../data/faq'
import { TESTIMONIOS_HOME } from '../data/testimonios'
import { AVATAR_IMAGE } from '../lib/constants'

interface IconProps {
  className?: string
}

function ChipIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ShieldIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5l6.5 2.4v5.3c0 4.2-2.7 7.4-6.5 9.3-3.8-1.9-6.5-5.1-6.5-9.3V5.9L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

function SearchIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15.2 15.2 20 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function DeviceIcon({ className = 'h-4 w-4' }: IconProps) {
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

function SparkleIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5c.4 3.6 1.2 6 2.6 7.4 1.4 1.4 3.8 2.2 7.4 2.6-3.6.4-6 1.2-7.4 2.6-1.4 1.4-2.2 3.8-2.6 7.4-.4-3.6-1.2-6-2.6-7.4-1.4-1.4-3.8-2.2-7.4-2.6 3.6-.4 6-1.2 7.4-2.6 1.4-1.4 2.2-3.8 2.6-7.4Z" />
    </svg>
  )
}

function CheckBadgeIcon({ className = 'h-5 w-5 shrink-0 text-blush-500' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 12.5l2 2 4.5-5M12 3l1.8 1.4 2.3-.2 1 2.1 2.1 1-.2 2.3L20.4 12l-1.4 1.8.2 2.3-2.1 1-1 2.1-2.3-.2L12 20.5l-1.8-1.4-2.3.2-1-2.1-2.1-1 .2-2.3L3.6 12l1.4-1.8-.2-2.3 2.1-1 1-2.1 2.3.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M13.4 20.7v-6.9h2.1l.3-2.5h-2.4V9.6c0-.7.2-1.2 1.2-1.2h1.3V6.1c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.9H8.7v2.5h2.1v6.9" />
    </svg>
  )
}

/*
 * Contenido que antes vivía comprimido dentro del hero (ver git history de
 * Hero.tsx): ahora es su propia sección, con espacio para respirar.
 */
const BENEFICIOS = [
  {
    key: 'tecnologia',
    title: 'Tecnología avanzada',
    text: 'Láser diodo con punta de zafiro, la base del protocolo Láser Expert 8®.',
    Icon: ChipIcon,
  },
  {
    key: 'seguro',
    title: '100% seguro',
    text: 'Cumplimos con la normativa sanitaria vigente para procedimientos estéticos.',
    Icon: ShieldIcon,
  },
  {
    key: 'resultados',
    title: 'Resultados duraderos',
    text: 'Resultados progresivos, respaldados por 9 años de experiencia.',
    Icon: ClockIcon,
  },
]

const PASOS = [
  {
    key: 'evaluacion',
    title: 'Evaluación',
    text: 'Analizamos tu tipo de piel y vello para tu tratamiento personalizado.',
    Icon: SearchIcon,
  },
  { key: 'tratamiento', title: 'Tratamiento', text: CLAIMS.tecnologia, Icon: DeviceIcon },
  {
    key: 'resultados',
    title: 'Resultados',
    text: 'Piel suave y sin vello desde las primeras sesiones.',
    Icon: SparkleIcon,
  },
]

/*
 * Los cuatro servicios, ahora como tarjetas con imagen y badge (ver
 * TratamientoCard.tsx). Los badges no describen el servicio —para eso está la
 * descripción— sino que le dan a cada uno un motivo distinto para ser elegido:
 * el más pedido, el que da resultado hoy, el que no es depilación. Solo el
 * láser lleva `badgeDestacado`: si los cuatro gritan, no destaca ninguno.
 *
 * Las imágenes son los posters de los videos que ya usa la página de cada
 * servicio (ver constants.ts), así que no entra un solo asset nuevo al repo y
 * la tarjeta muestra exactamente la técnica que se ve al entrar.
 */
const TRATAMIENTOS: Tratamiento[] = [
  {
    to: '/laser',
    badge: 'Láser diodo',
    badgeDestacado: true,
    title: 'Láser de diodo',
    description: 'Zona por zona, por nivel de bikini, o cuerpo completo en una sola sesión.',
    imagen: '/videos/posters/laser-principal.jpg',
  },
  {
    to: '/cera',
    badge: 'Resultado inmediato',
    title: 'Cera italiana',
    description: 'Para quien prefiere resultado inmediato o no es candidata a láser.',
    imagen: '/videos/posters/cera-principal.jpg',
  },
  {
    to: '/hifu',
    badge: 'Popular',
    title: 'HIFU 4D',
    description: 'Lifting sin cirugía: reafirma, define y rejuvenece desde las capas profundas de la piel.',
    imagen: '/videos/posters/hifu-referencia-1.jpg',
  },
  {
    to: '/otros-servicios',
    badge: 'Recuperación y moldeado',
    title: 'Otros servicios',
    description: 'Post-operatorio, Cire Sculpt y moldeo corporal.',
    imagen: '/resultados-reales/resultado-moldeo-1.png',
  },
]

const HOME_CTA_CONTEXT = {
  sku: 'home-cta-final',
  nombre: 'sus servicios',
  categoria: 'general',
  placement: 'seccion',
} as const

export function Home() {
  useDocumentMeta({
    title: 'Depilación láser diodo en CDMX y Metepec — Cire Depilación',
    description:
      'Depilación láser de diodo con punta de zafiro, cera italiana y HIFU. 9 años de experiencia y 5 sucursales en CDMX (Polanco, Del Valle, Coapa, Oriente) y Metepec. Agenda tu evaluación por WhatsApp.',
  })

  /*
   * Los dos bloques de structured data van solo en el home: es la página que
   * describe al negocio completo y la única que tiene el FAQ. Repetirlos en
   * cada ruta no suma nada y multiplica el riesgo de que uno quede desfasado.
   */
  useLocalBusinessJsonLd()
  useFaqJsonLd(FAQ_HOME)

  return (
    <>
      <Hero />

      {/* Banda oscura pegada al hero: lo cierra y arranca el contenido. Ver
          BeneficiosStrip.tsx. */}
      <BeneficiosStrip />

      <Section id="beneficios">
        <SectionHeading>Por qué elegir Cire</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          Nueve años de experiencia y cinco sucursales entre Ciudad de México y Metepec, con un protocolo
          pensado para tu tipo de piel y vello.
        </p>

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-3" step={90}>
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

        <div className="mt-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blush-500">Cómo funciona</p>
          <div className="relative mt-8">
            <div aria-hidden="true" className="absolute inset-x-0 top-[13px] hidden h-px bg-blush-200 sm:block" />
            <Stagger className="relative grid gap-6 sm:grid-cols-3" step={100}>
              {PASOS.map(({ key, title, text, Icon }) => (
                <div key={key} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blush-500 bg-white text-blush-600 sm:mt-0">
                    <Icon />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500 sm:max-w-[14rem]">{text}</p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </div>

        {/*
          La foto de la especialista vive en su propia tarjeta con padding,
          no flotando pegada al video del hero como antes.
        */}
        <div className="mt-16 flex flex-col items-center gap-5 rounded-2xl border border-black/[0.07] bg-white p-6 text-center sm:flex-row sm:text-left">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-blush-100">
            <img
              src={AVATAR_IMAGE}
              alt="Especialista Cire aplicando depilación láser diodo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <CheckBadgeIcon />
              <p className="text-sm font-medium text-neutral-900">Profesionales certificadas</p>
            </div>
            <p className="mt-1 text-sm text-neutral-500">Cada sesión la aplica personal capacitado en el protocolo.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={REDES.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Cire Depilación en Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-neutral-500 transition-colors hover:border-blush-300 hover:text-neutral-900"
            >
              <InstagramGlyph />
            </a>
            <a
              href={REDES.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Cire Depilación en Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-neutral-500 transition-colors hover:border-blush-300 hover:text-neutral-900"
            >
              <FacebookGlyph />
            </a>
          </div>
        </div>
      </Section>

      {/*
        Entre "Por qué elegir Cire" y "Elige tu tratamiento" a propósito: ya
        convenció de la marca, todavía no eligió servicio, y "¿me queda cerca?"
        es la pregunta que se cruza justo ahí. Ver SucursalesHome.tsx para el
        lado de SEO local.
      */}
      <Section id="sucursales" tone="alt">
        <SucursalesHome />
      </Section>

      <Section id="precios">
        <SectionHeading>Elige tu tratamiento</SectionHeading>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500">
          Cada servicio tiene su propio detalle de precios y paquetes.
        </p>

        {/* `[&>div]:h-full` estira el wrapper que agrega Stagger para animar
            (ver Reveal.tsx): es el ítem del grid, así que sin él las tarjetas
            no tienen contra qué crecer y quedan de alturas distintas cuando
            una descripción se parte en tres renglones. */}
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 [&>div]:h-full" step={80}>
          {TRATAMIENTOS.map((tratamiento) => (
            <TratamientoCard key={tratamiento.to} {...tratamiento} />
          ))}
        </Stagger>
      </Section>

      {/* El tono alterna sección por sección (ver Section.tsx); al insertar
          Sucursales se corrió un lugar todo lo que sigue. */}
      <Section id="resenas" tone="alt">
        {/* `carrusel`: solo el home lo pide, ver la nota del prop en
            Testimonios.tsx. */}
        <TestimoniosSection testimonios={TESTIMONIOS_HOME} carrusel />
      </Section>

      {/*
        Dos caminos en la misma sección, en orden de esfuerzo: el CTA directo a
        WhatsApp arriba para quien ya decidió, y el formulario debajo para
        quien todavía compara y no va a abrir un chat hoy (ver LeadForm.tsx).
        El orden no es negociable — invertirlo pondría el paso más caro
        primero para la persona que ya estaba lista.
      */}
      {/*
        En negro (`tone="dark"`, ver Section.tsx) desde el rediseño: es el
        bloque de la oferta del 10%, o sea lo único que se está vendiendo en
        toda la página, y como sección blanca más quedaba indistinguible de
        Beneficios o Precios. La tarjeta blanca del formulario encima del negro
        es el contraste más alto de la página, que es exactamente donde
        corresponde ponerlo.
      */}
      <Section id="agendar" tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blush-400/40 bg-blush-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blush-200">
              {LEAD_MAGNET.badge}
            </span>

            <SectionHeading className="mt-4 text-white!">¿Lo armamos juntas?</SectionHeading>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/60">
              Cuéntanos qué tratamiento te interesa y te confirmamos disponibilidad por WhatsApp.
            </p>

            {/* Botón blanco y no el `primary` negro por defecto: sobre la banda
                oscura, un CTA negro desaparece. */}
            <div className="mt-7">
              <WhatsAppCTA
                className="bg-white! px-7! py-4! text-blush-900! shadow-[0_18px_45px_-18px_rgba(255,255,255,0.45)]! hover:bg-blush-50!"
                context={HOME_CTA_CONTEXT}
              >
                Escríbenos por WhatsApp
              </WhatsAppCTA>
            </div>
          </div>

          <LeadForm />
        </div>
      </Section>

      {/*
        El FAQ va último, después del CTA y no antes: son objeciones de quien
        todavía duda, y ponerlas delante del botón obliga a scrollear un muro
        de texto a quien ya se decidió. También se emite como structured data
        FAQPage arriba, así que su lugar en la página es una decisión de CRO,
        no de SEO.
      */}
      <Section id="faq" tone="alt">
        <Faq
          items={FAQ_HOME}
          intro="Lo que más nos preguntan antes de la primera cita. Si te queda una duda que no está acá, escríbenos por WhatsApp."
        />
      </Section>
    </>
  )
}
