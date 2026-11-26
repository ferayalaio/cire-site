import { useState } from 'react'
import { Boton, CampoEditable } from './campos'
import { recortar, valorLista, valorObjeto, type Seccion, type SeccionLista, type SeccionObjeto } from './registro'
import type { Contenido } from './api'

interface Props {
  seccion: Seccion
  borrador: Contenido
  alCambiar: (clave: string, valor: unknown) => void
}

export function EditorSeccion({ seccion, borrador, alCambiar }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-tight font-medium text-ink">{seccion.titulo}</h1>
        <p className="text-[15px] text-ink/70">{seccion.descripcion}</p>
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-ink/60">
          Se ve en:
          {seccion.paginas.map((p) => (
            <a key={p.ruta} href={p.ruta} target="_blank" rel="noreferrer" className="font-semibold text-magenta underline-offset-2 hover:underline">
              {p.nombre} ↗
            </a>
          ))}
        </p>
      </header>
      {seccion.tipo === 'lista' ? (
        <EditorLista seccion={seccion} borrador={borrador} alCambiar={alCambiar} />
      ) : (
        <EditorObjeto seccion={seccion} borrador={borrador} alCambiar={alCambiar} />
      )}
    </div>
  )
}

function EditorObjeto({ seccion, borrador, alCambiar }: { seccion: SeccionObjeto } & Omit<Props, 'seccion'>) {
  const valor = valorObjeto(seccion, borrador)
  const cambiar = (clave: string, nuevo: unknown) =>
    alCambiar(seccion.clave, recortar({ ...valor, [clave]: nuevo }, seccion.campos, false))
  return (
    <div className="grid gap-5 rounded-card border border-linea bg-white p-5 sm:p-6">
      {seccion.campos.map((c) => (
        <CampoEditable key={c.clave} campo={c} valor={valor[c.clave]} alCambiar={(v) => cambiar(c.clave, v)} />
      ))}
    </div>
  )
}

function resumenPrecio(item: Record<string, unknown>): string {
  const precio = item.precioPaquete ?? item.precioDesde ?? item.precio ?? item.precioRegular
  if (precio === undefined) return ''
  if (precio === null) return 'Pendiente'
  return (precio as number).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
}

function EditorLista({ seccion, borrador, alCambiar }: { seccion: SeccionLista } & Omit<Props, 'seccion'>) {
  const items = valorLista(seccion, borrador)
  const [abierto, setAbierto] = useState<string | null>(null)

  const guardar = (nuevos: Record<string, unknown>[]) =>
    alCambiar(
      seccion.clave,
      nuevos.map((i) => recortar(i, seccion.campos, true)),
    )

  const mover = (desde: number, hacia: number) => {
    if (hacia < 0 || hacia >= items.length) return
    const copia = [...items]
    const [item] = copia.splice(desde, 1)
    copia.splice(hacia, 0, item)
    guardar(copia)
  }

  return (
    <ol className="flex flex-col gap-2">
      {items.map((item, i) => {
        const slug = item.slug as string
        const estaAbierto = abierto === slug
        return (
          <li key={slug} className="overflow-hidden rounded-card border border-linea bg-white">
            <div className="flex items-center gap-2 pr-2">
              <button
                type="button"
                onClick={() => setAbierto(estaAbierto ? null : slug)}
                aria-expanded={estaAbierto}
                className="flex min-h-14 flex-1 items-center gap-3 px-4 text-left"
              >
                <span aria-hidden className={`text-ink/40 transition ${estaAbierto ? 'rotate-90' : ''}`}>
                  ›
                </span>
                <span className="flex-1 text-[15px] font-semibold text-ink">{(item.nombre as string) || slug}</span>
                <span className={`text-[14px] tabular-nums ${resumenPrecio(item) === 'Pendiente' ? 'text-ink/40' : 'text-ink/80'}`}>
                  {resumenPrecio(item)}
                </span>
              </button>
              <div className="flex">
                <Boton variante="fantasma" className="min-h-9 px-2" aria-label="Subir" disabled={i === 0} onClick={() => mover(i, i - 1)}>
                  ↑
                </Boton>
                <Boton
                  variante="fantasma"
                  className="min-h-9 px-2"
                  aria-label="Bajar"
                  disabled={i === items.length - 1}
                  onClick={() => mover(i, i + 1)}
                >
                  ↓
                </Boton>
              </div>
            </div>
            {estaAbierto && (
              <div className="grid gap-5 border-t border-linea bg-hueso/60 p-5">
                {seccion.campos.map((c) => (
                  <CampoEditable
                    key={c.clave}
                    campo={c}
                    valor={item[c.clave]}
                    alCambiar={(v) => guardar(items.map((x) => (x.slug === slug ? { ...x, [c.clave]: v } : x)))}
                  />
                ))}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
