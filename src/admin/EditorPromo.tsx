/*
 * Promoción de temporada (Buen Fin, Hot Sale, Aniversario…). Edita
 * PROMO_TEMPORADA de src/data/promos.ts: se guarda el objeto completo, porque
 * cada temporada se redefine entera.
 */
import { NIVELES_BIKINI, PAQUETES_HOME, ZONAS, formatPrecio } from '../data/precios'
import { PROMO_TEMPORADA, type ListaPromo, type PaquetePromo } from '../data/promos'
import type { Contenido } from './api'
import { Boton, CampoEditable } from './campos'

type Promo = typeof PROMO_TEMPORADA

const PAQUETES = [{ slug: 'full-body', nombre: 'Full Body' }, ...PAQUETES_HOME.map((p) => ({ slug: p.slug, nombre: p.nombre }))]
const ZONAS_OPCIONES = [...NIVELES_BIKINI, ...ZONAS].map((z) => ({ slug: z.slug, nombre: z.nombre }))

const select =
  'w-full rounded-lg border border-linea bg-white px-3 py-2.5 text-[15px] text-ink outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/15'
const numero = `${select} tabular-nums`

function Tarjeta({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-card border border-linea bg-white p-5 sm:p-6">
      <div>
        <h2 className="font-display text-[20px] font-medium text-ink">{titulo}</h2>
        {ayuda && <p className="mt-1 text-[13.5px] text-ink/60">{ayuda}</p>}
      </div>
      {children}
    </section>
  )
}

export function EditorPromo({ borrador, alCambiar }: { borrador: Contenido; alCambiar: (clave: string, valor: unknown) => void }) {
  const promo: Promo = { ...PROMO_TEMPORADA, ...((borrador.promo as Partial<Promo>) ?? {}) }
  const cambiar = (parcial: Partial<Promo>) => alCambiar('promo', { ...promo, ...parcial })

  const vigente = promo.activa && new Date() <= new Date(`${promo.hasta}T23:59:59-06:00`)

  const cambiarCombo = (i: number, parcial: Partial<PaquetePromo>) =>
    cambiar({ combos: promo.combos.map((c, j) => (j === i ? { ...c, ...parcial } : c)) })

  const cambiarLista = (i: number, parcial: Partial<ListaPromo>) =>
    cambiar({ listas: promo.listas.map((l, j) => (j === i ? { ...l, ...parcial } : l)) })

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-tight font-medium text-ink">Promoción de temporada</h1>
        <p className="text-[15px] text-ink/70">
          Cupones, precios tachados y el aviso de arriba en todas las páginas. Se apaga sola al pasar la fecha de fin.
        </p>
        <p
          className={`self-start rounded-full px-3 py-1 text-[13px] font-semibold ${vigente ? 'bg-blush-100 text-blush-900' : 'bg-ink/5 text-ink/60'}`}
        >
          {vigente ? `Activa · ${promo.nombre} hasta el ${promo.hasta}` : 'Apagada: el sitio muestra precios regulares'}
        </p>
      </header>

      <Tarjeta titulo="Datos generales">
        <CampoEditable
          campo={{ clave: 'activa', etiqueta: 'Promoción activa', tipo: 'si-no', ayuda: 'Desmárcala para apagar la promoción antes de la fecha de fin.' }}
          valor={promo.activa}
          alCambiar={(v) => cambiar({ activa: Boolean(v) })}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <CampoEditable
            campo={{ clave: 'nombre', etiqueta: 'Nombre de la promoción', tipo: 'texto', ayuda: 'Ejemplo: Buen Fin, Hot Sale.' }}
            valor={promo.nombre}
            alCambiar={(v) => cambiar({ nombre: v as string })}
          />
          <CampoEditable
            campo={{ clave: 'hasta', etiqueta: 'Último día', tipo: 'fecha', ayuda: 'Al terminar este día (hora de CDMX) se apaga sola.' }}
            valor={promo.hasta}
            alCambiar={(v) => cambiar({ hasta: v as string })}
          />
        </div>
        <CampoEditable
          campo={{ clave: 'hastaTexto', etiqueta: 'Fecha como se lee en el cupón', tipo: 'texto', ayuda: 'Ejemplo: "hasta el 30 de noviembre".' }}
          valor={promo.hastaTexto}
          alCambiar={(v) => cambiar({ hastaTexto: v as string })}
        />
        <CampoEditable
          campo={{ clave: 'condicion', etiqueta: 'Condición', tipo: 'parrafo' }}
          valor={promo.condicion}
          alCambiar={(v) => cambiar({ condicion: v as string })}
        />
        <CampoEditable
          campo={{ clave: 'aviso', etiqueta: 'Frase de cierre', tipo: 'texto' }}
          valor={promo.aviso}
          alCambiar={(v) => cambiar({ aviso: v as string })}
        />
      </Tarjeta>

      <Tarjeta titulo="Aviso superior" ayuda="La franja que aparece arriba en todas las páginas mientras la promoción está activa.">
        <CampoEditable
          campo={{ clave: 'detalle', etiqueta: 'Texto completo', tipo: 'parrafo' }}
          valor={promo.anuncio.detalle}
          alCambiar={(v) => cambiar({ anuncio: { ...promo.anuncio, detalle: v as string } })}
        />
        <CampoEditable
          campo={{ clave: 'corto', etiqueta: 'Versión corta (celular)', tipo: 'texto' }}
          valor={promo.anuncio.corto}
          alCambiar={(v) => cambiar({ anuncio: { ...promo.anuncio, corto: v as string } })}
        />
      </Tarjeta>

      <Tarjeta titulo="Precio de temporada de los paquetes" ayuda="El precio regular se tacha solo y el ahorro se calcula solo.">
        <div className="flex flex-col gap-3">
          {promo.combos.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] items-end gap-3 rounded-lg bg-hueso p-3 sm:grid-cols-[1.4fr_1fr_0.7fr_auto]">
              <label className="col-span-2 flex flex-col gap-1 text-[12.5px] font-semibold text-ink sm:col-span-1">
                Paquete
                <select className={select} value={c.slug} onChange={(e) => cambiarCombo(i, { slug: e.target.value })}>
                  {PAQUETES.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-[12.5px] font-semibold text-ink">
                Precio
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className={numero}
                  value={c.precio}
                  onChange={(e) => cambiarCombo(i, { precio: Math.max(0, Math.round(Number(e.target.value))) })}
                />
              </label>
              <label className="flex flex-col gap-1 text-[12.5px] font-semibold text-ink">
                MSI
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  className={numero}
                  value={c.msi}
                  onChange={(e) => cambiarCombo(i, { msi: Math.max(0, Math.round(Number(e.target.value))) })}
                />
              </label>
              <Boton variante="fantasma" aria-label="Quitar paquete" onClick={() => cambiar({ combos: promo.combos.filter((_, j) => j !== i) })}>
                Quitar
              </Boton>
            </div>
          ))}
          <Boton
            className="self-start"
            onClick={() => cambiar({ combos: [...promo.combos, { slug: PAQUETES[0].slug, precio: 0, msi: 3 }] })}
          >
            + Agregar paquete
          </Boton>
        </div>
      </Tarjeta>

      {promo.listas.map((lista, i) => (
        <Tarjeta key={lista.slug} titulo={lista.titulo} ayuda="Precios de temporada por zona.">
          <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
            <CampoEditable
              campo={{ clave: 'titulo', etiqueta: 'Título', tipo: 'texto' }}
              valor={lista.titulo}
              alCambiar={(v) => cambiarLista(i, { titulo: v as string })}
            />
            <CampoEditable
              campo={{ clave: 'msi', etiqueta: 'MSI', tipo: 'numero' }}
              valor={lista.msi}
              alCambiar={(v) => cambiarLista(i, { msi: (v as number) ?? 0 })}
            />
          </div>
          <CampoEditable
            campo={{ clave: 'nota', etiqueta: 'Nota (opcional)', tipo: 'texto' }}
            valor={lista.nota}
            alCambiar={(v) => cambiarLista(i, { nota: (v as string) || undefined })}
          />
          <div className="flex flex-col gap-3">
            {lista.items.map((item, k) => {
              const cambiarItem = (parcial: Partial<typeof item>) =>
                cambiarLista(i, { items: lista.items.map((x, j) => (j === k ? { ...x, ...parcial } : x)) })
              return (
                <div key={k} className="grid gap-3 rounded-lg bg-hueso p-3 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end">
                  <label className="flex flex-col gap-1 text-[12.5px] font-semibold text-ink">
                    Zona
                    <select
                      className={select}
                      value={item.zonaSlug}
                      onChange={(e) => {
                        const z = ZONAS_OPCIONES.find((o) => o.slug === e.target.value)
                        cambiarItem({ zonaSlug: e.target.value, nombre: z?.nombre ?? item.nombre })
                      }}
                    >
                      {ZONAS_OPCIONES.map((z) => (
                        <option key={z.slug} value={z.slug}>
                          {z.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-[12.5px] font-semibold text-ink">
                    Detalle
                    <input className={select} value={item.detalle} onChange={(e) => cambiarItem({ detalle: e.target.value })} />
                  </label>
                  <label className="flex flex-col gap-1 text-[12.5px] font-semibold text-ink">
                    Precio
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      className={numero}
                      value={item.precio}
                      onChange={(e) => cambiarItem({ precio: Math.max(0, Math.round(Number(e.target.value))) })}
                    />
                  </label>
                  <Boton
                    variante="fantasma"
                    aria-label={`Quitar ${item.nombre}`}
                    onClick={() => cambiarLista(i, { items: lista.items.filter((_, j) => j !== k) })}
                  >
                    Quitar
                  </Boton>
                  <p className="text-[12px] text-ink/50 sm:col-span-4">
                    Se muestra como "{item.nombre}" a {formatPrecio(item.precio)}
                  </p>
                </div>
              )
            })}
            <Boton
              className="self-start"
              onClick={() =>
                cambiarLista(i, {
                  items: [...lista.items, { nombre: ZONAS_OPCIONES[0].nombre, detalle: '8 sesiones', precio: 0, zonaSlug: ZONAS_OPCIONES[0].slug }],
                })
              }
            >
              + Agregar zona
            </Boton>
          </div>
        </Tarjeta>
      ))}
    </div>
  )
}
