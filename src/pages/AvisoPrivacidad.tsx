import type { ReactNode } from 'react'
import { PageShell } from '../components/PageShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { COFEPRIS, MARCA } from '../data/marca'
import { getSucursal } from '../data/sucursales'
import { buildPrivacyWhatsAppUrl } from '../lib/whatsapp'

/*
 * Texto provisto por Cire (sep/26), publicado tal cual. Es la URL que se carga
 * en Meta Ads Manager como política de privacidad de los formularios de
 * leads, así que tiene que seguir respondiendo en /aviso-de-privacidad aunque
 * cambie el resto del sitio.
 */
const ULTIMA_ACTUALIZACION = 'Septiembre 2026'

/*
 * Domicilio del Responsable: la sucursal Polanco, por decisión del cliente
 * (sep/26) mientras no haya un domicilio fiscal propio. Se lee de
 * sucursales.ts para que no quede una copia de la dirección desactualizada.
 */
const DOMICILIO = getSucursal('polanco')?.direccion ?? ''

interface Apartado {
  titulo: string
  contenido: ReactNode
}

const APARTADOS: Apartado[] = [
  {
    titulo: 'Responsable del Tratamiento de Datos',
    contenido: (
      <>
        <p>
          <span className="font-medium text-neutral-900">{MARCA.nombre}</span>, con domicilio en{' '}
          {DOMICILIO}, es responsable del tratamiento de tus datos personales.
        </p>
        <p>
          El tratamiento de los datos personales recabados se realiza con la finalidad de gestionar la
          atención al cliente, agenda de citas y prestación de servicios de depilación láser.
        </p>
      </>
    ),
  },
  {
    titulo: 'Datos Personales que Recopilamos',
    contenido: (
      <>
        <p>Podemos recopilar los siguientes datos de contacto:</p>
        <Lista
          items={[
            'Nombre completo',
            'Número de teléfono / WhatsApp',
            'Correo electrónico',
            'Sucursal de preferencia y zonas de interés de tratamiento',
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'Finalidades del Uso de Datos',
    contenido: (
      <>
        <p>Los datos recabados serán utilizados para:</p>
        <Lista
          items={[
            'Contactarte vía WhatsApp, llamada o correo para confirmar tus citas, sesiones de prueba o promociones.',
            'Asignar tu atención a la sucursal más cercana.',
            'Enviarte información relevante sobre nuestros servicios, promociones y seguimiento de tratamiento.',
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'Protección y Transferencia de Datos',
    contenido: (
      <p>
        Tus datos personales no serán vendidos, alquilados ni compartidos con terceros con fines
        comerciales ajenos a nuestra empresa. Se utilizan únicamente dentro de nuestro sistema de
        gestión y atención al cliente.
      </p>
    ),
  },
  {
    titulo: 'Derechos ARCO y Cancelación',
    contenido: (
      <p>
        Puedes solicitar en cualquier momento la actualización, rectificación o eliminación de tus
        datos de nuestras bases de datos enviando un mensaje directo a nuestra línea de atención de{' '}
        <a
          href={buildPrivacyWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-neutral-900 underline decoration-blush-300 underline-offset-4 transition-colors hover:text-blush-600"
        >
          WhatsApp
        </a>
        .
      </p>
    ),
  },
]

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-blush-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function AvisoPrivacidad() {
  useDocumentMeta({
    title: 'Aviso de Privacidad',
    description:
      'Cómo Cire Depilación recopila, utiliza y protege los datos personales que nos proporcionas en campañas digitales, formularios y sitio web.',
  })

  return (
    <PageShell
      title="Aviso de Privacidad"
      intro="En nuestro centro de depilación láser diodo, la privacidad y protección de tus datos personales es una prioridad. Este Aviso de Privacidad explica cómo recopilamos, utilizamos y protegemos la información que nos proporcionas a través de nuestras campañas digitales, formularios y sitio web."
    >
      <div className="max-w-3xl pb-24">
        <p className="text-[15px] text-neutral-600">
          <span className="font-semibold text-ink">Última actualización:</span> {ULTIMA_ACTUALIZACION}
        </p>

        <div className="mt-8 divide-y divide-black/[0.08] rounded-2xl bg-white px-6 ring-1 ring-black/[0.06] sm:px-10">
          {APARTADOS.map((apartado, index) => (
            <section key={apartado.titulo} className="py-8 sm:py-10">
                <h2 className="flex items-baseline gap-4 text-2xl text-ink sm:text-[1.7rem]">
                  <span className="text-base font-semibold text-morado-700 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {apartado.titulo}
                </h2>
                <div className="mt-4 max-w-[65ch] space-y-3 text-[16px] leading-relaxed text-neutral-700">{apartado.contenido}</div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-[15px] leading-relaxed text-neutral-600">{COFEPRIS}</p>
      </div>
    </PageShell>
  )
}
