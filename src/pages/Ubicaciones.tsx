import { PageShell } from '../components/PageShell'
import { SucursalCard } from '../components/SucursalCard'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { HORARIO, SUCURSALES } from '../data/sucursales'
import type { Sucursal } from '../data/sucursales'

/*
 * Agrupación puramente geográfica para ordenar el grid (no es un dato de
 * negocio ni reemplaza la dirección real de cada sucursal, que sigue viviendo
 * y validándose en src/data/sucursales.ts). Ya está implícita en el copy de
 * abajo ("entre Ciudad de México y Metepec"); acá solo se usa para el layout,
 * en vez de tirar las cinco tarjetas en un único grid sin criterio.
 */
const ZONAS: Record<string, string> = {
  polanco: 'Ciudad de México',
  'del-valle': 'Ciudad de México',
  coapa: 'Ciudad de México',
  oriente: 'Ciudad de México',
  metepec: 'Estado de México',
}

function agruparPorZona(sucursales: Sucursal[]): [string, Sucursal[]][] {
  const grupos: Record<string, Sucursal[]> = {}
  for (const sucursal of sucursales) {
    const zona = ZONAS[sucursal.slug] ?? 'Otras sucursales'
    if (!grupos[zona]) grupos[zona] = []
    grupos[zona].push(sucursal)
  }
  return Object.entries(grupos)
}

export function Ubicaciones() {
  useDocumentMeta({
    title: 'Sucursales',
    description:
      'Nuestras sucursales entre Ciudad de México y Metepec. Todas atienden con cita: mira dirección y horarios de cada una.',
  })

  const grupos = agruparPorZona(SUCURSALES)

  return (
    <PageShell
      eyebrow="Sucursales"
      title="Dónde estamos"
      intro="Cinco sucursales entre Ciudad de México y Metepec. Todas atienden con cita."
    >
      <p className="mb-14 text-sm text-neutral-400">
        Horario en todas: {HORARIO.map((h) => `${h.dias} ${h.horas}`).join(' · ')}
      </p>

      <div className="space-y-16">
        {grupos.map(([zona, sucursales]) => (
          <section key={zona}>
            <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-blush-500">
              {zona}
            </h2>
            <div className="stagger-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sucursales.map((sucursal) => (
                <SucursalCard key={sucursal.slug} sucursal={sucursal} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
