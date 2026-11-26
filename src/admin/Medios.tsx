import { useCallback, useEffect, useRef, useState } from 'react'
import { api, fechaLegible, type Medio } from './api'
import { Boton } from './campos'

function tamano(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

const esVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(new URL(url).pathname)

export function Medios() {
  const [medios, setMedios] = useState<Medio[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [subiendo, setSubiendo] = useState<{ nombre: string; pct: number } | null>(null)
  const [copiado, setCopiado] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const cargar = useCallback(() => {
    api
      .medios()
      .then((r) => setMedios(r.medios))
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(cargar, [cargar])

  async function subir(archivos: FileList | null) {
    if (!archivos?.length) return
    setError(null)
    for (const archivo of Array.from(archivos)) {
      setSubiendo({ nombre: archivo.name, pct: 0 })
      try {
        await api.subir(archivo, (pct) => setSubiendo({ nombre: archivo.name, pct }))
      } catch (e) {
        setError(`${archivo.name}: ${e instanceof Error ? e.message : 'no se pudo subir.'}`)
      }
    }
    setSubiendo(null)
    if (input.current) input.current.value = ''
    cargar()
  }

  async function borrar(m: Medio) {
    if (!confirm(`¿Borrar ${m.nombre}? Si se usa en alguna página, dejará de verse.`)) return
    try {
      await api.borrarMedio(m.url)
      cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo borrar.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-tight font-medium text-ink">Fotos y videos</h1>
        <p className="text-[15px] text-ink/70">
          Sube fotos (JPG, PNG, WebP) y videos (MP4) de hasta 200 MB. Las fotos se ven mejor horizontales y de al menos 1600 px de ancho.
        </p>
      </header>

      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          subir(e.dataTransfer.files)
        }}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-ink/15 bg-white px-6 py-10 text-center transition hover:border-magenta/50"
      >
        <span className="text-[15px] font-semibold text-ink">Arrastra aquí tus archivos o toca para elegirlos</span>
        <span className="text-[13px] text-ink/60">Desde el celular puedes elegir directo de tu galería.</span>
        <input ref={input} type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime" className="sr-only" onChange={(e) => subir(e.target.files)} />
      </label>

      {subiendo && (
        <div className="rounded-card border border-linea bg-white p-4" role="status">
          <p className="text-[14px] text-ink">
            Subiendo {subiendo.nombre}… {Math.round(subiendo.pct)}%
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full bg-magenta transition-[width]" style={{ width: `${subiendo.pct}%` }} />
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-blush-50 px-4 py-3 text-[14px] text-blush-900">
          {error}
        </p>
      )}

      {medios === null ? (
        <p className="text-ink/60">Cargando…</p>
      ) : medios.length === 0 ? (
        <p className="text-ink/60">Todavía no has subido archivos.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {medios.map((m) => (
            <li key={m.url} className="flex flex-col overflow-hidden rounded-card border border-linea bg-white">
              <div className="aspect-square bg-hueso">
                {esVideo(m.url) ? (
                  <video src={m.url} muted playsInline preload="metadata" className="size-full object-cover" />
                ) : (
                  <img src={m.url} alt="" loading="lazy" className="size-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="truncate text-[13px] font-semibold text-ink" title={m.nombre}>
                  {m.nombre}
                </p>
                <p className="text-[12px] text-ink/50">
                  {tamano(m.tamano)} · {fechaLegible(m.subidoEn)}
                </p>
                <div className="mt-auto flex gap-1">
                  <Boton
                    className="min-h-8 flex-1 px-2 text-[12.5px]"
                    onClick={() => {
                      navigator.clipboard.writeText(m.url)
                      setCopiado(m.url)
                      setTimeout(() => setCopiado(null), 1800)
                    }}
                  >
                    {copiado === m.url ? 'Copiado' : 'Copiar enlace'}
                  </Boton>
                  <Boton variante="fantasma" className="min-h-8 px-2 text-[12.5px]" onClick={() => borrar(m)}>
                    Borrar
                  </Boton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
