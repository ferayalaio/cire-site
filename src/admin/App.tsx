/*
 * Portal de edición de Cire (/admin).
 *
 * Flujo para el cliente: entra → cambia lo que quiera (se guarda solo como
 * borrador) → Publicar → el sitio se actualiza en 1 a 2 minutos. El sitio
 * público no cambia hasta Publicar, y cada publicación queda en el historial.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { api, ErrorApi, fechaLegible, type Contenido, type EstadoContenido, type Usuario } from './api'
import { Boton } from './campos'
import { EditorPromo } from './EditorPromo'
import { EditorSeccion } from './EditorSeccion'
import { Historial } from './Historial'
import { Login } from './Login'
import { Medios } from './Medios'
import { SECCIONES_PRECIOS } from './registro'

type Vista = 'inicio' | 'promo' | 'medios' | 'historial' | `precios:${string}`
type EstadoGuardado = 'guardado' | 'pendiente' | 'guardando' | 'error'

const ESPERA_AUTOGUARDADO_MS = 1200

export function App() {
  const [usuario, setUsuario] = useState<Usuario | null | 'cargando'>('cargando')

  useEffect(() => {
    api
      .sesion()
      .then((r) => setUsuario(r.usuario))
      .catch(() => setUsuario(null))
  }, [])

  if (usuario === 'cargando') return <Pantalla>Cargando…</Pantalla>
  if (!usuario) return <Login alEntrar={setUsuario} />
  return <Portal usuario={usuario} alSalir={() => setUsuario(null)} />
}

function Pantalla({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-dvh place-items-center bg-hueso text-ink/60">{children}</div>
}

function Portal({ usuario, alSalir }: { usuario: Usuario; alSalir: () => void }) {
  const [estado, setEstado] = useState<EstadoContenido | null>(null)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [borrador, setBorrador] = useState<Contenido>({})
  const [guardado, setGuardado] = useState<EstadoGuardado>('guardado')
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [vista, setVista] = useState<Vista>('inicio')
  // Cambia al recuperar una versión: remonta los formularios con los valores nuevos.
  const [revision, setRevision] = useState(0)

  const base = useRef<string | null>(null)
  const ultimo = useRef<Contenido>({})
  const temporizador = useRef<number | undefined>(undefined)
  const enCurso = useRef<Promise<void> | null>(null)

  const cargar = useCallback(async () => {
    try {
      const e = await api.contenido()
      base.current = e.id
      ultimo.current = e.contenido
      setEstado(e)
      setBorrador(e.contenido)
      setGuardado('guardado')
      setRevision((r) => r + 1)
    } catch (e) {
      if (e instanceof ErrorApi && e.status === 401) alSalir()
      else setErrorCarga(e instanceof Error ? e.message : 'No se pudo cargar el contenido.')
    }
  }, [alSalir])

  useEffect(() => {
    cargar()
  }, [cargar])

  const guardarAhora = useCallback(async (): Promise<boolean> => {
    window.clearTimeout(temporizador.current)
    if (enCurso.current) await enCurso.current
    const contenido = ultimo.current
    let ok = true
    enCurso.current = (async () => {
      setGuardado('guardando')
      try {
        const r = await api.guardar(contenido, base.current)
        base.current = r.id
        setEstado((e) => (e ? { ...e, id: r.id, guardadoEn: r.guardadoEn, guardadoPor: usuario.usuario, pendiente: true } : e))
        setGuardado(ultimo.current === contenido ? 'guardado' : 'pendiente')
      } catch (e) {
        ok = false
        setGuardado('error')
        if (e instanceof ErrorApi && e.status === 401) alSalir()
        setMensaje({
          tipo: 'error',
          texto:
            e instanceof ErrorApi && e.status === 409
              ? 'Otra persona guardó cambios mientras editabas. Recarga la página para ver la versión más reciente (tus últimos cambios no se guardaron).'
              : e instanceof Error
                ? e.message
                : 'No se pudo guardar.',
        })
      }
    })()
    await enCurso.current
    enCurso.current = null
    return ok
  }, [alSalir, usuario.usuario])

  const cambiar = useCallback(
    (clave: string, valor: unknown) => {
      setBorrador((b) => {
        const nuevo = { ...b, [clave]: valor }
        ultimo.current = nuevo
        return nuevo
      })
      setGuardado('pendiente')
      window.clearTimeout(temporizador.current)
      temporizador.current = window.setTimeout(guardarAhora, ESPERA_AUTOGUARDADO_MS)
    },
    [guardarAhora],
  )

  useEffect(() => {
    const avisar = (e: BeforeUnloadEvent) => {
      if (guardado === 'pendiente' || guardado === 'guardando') e.preventDefault()
    }
    window.addEventListener('beforeunload', avisar)
    return () => window.removeEventListener('beforeunload', avisar)
  }, [guardado])

  async function publicar() {
    if (!confirm('¿Publicar los cambios? El sitio se actualiza en 1 a 2 minutos.')) return
    setPublicando(true)
    setMensaje(null)
    try {
      if (guardado !== 'guardado' && !(await guardarAhora())) return
      const r = await api.publicar(base.current)
      setEstado((e) => (e ? { ...e, publicadoEn: r.publicadoEn, publicadoPor: usuario.usuario, pendiente: false } : e))
      setMensaje(
        r.deploy === 'ok'
          ? { tipo: 'ok', texto: 'Publicado. El sitio se actualiza en 1 a 2 minutos; recarga la página del sitio para ver los cambios.' }
          : r.deploy === 'sin-hook'
            ? { tipo: 'ok', texto: 'Guardado como publicado. En este entorno de prueba no se actualiza el sitio en línea.' }
            : { tipo: 'error', texto: 'Se guardó la versión, pero no se pudo actualizar el sitio. Vuelve a intentar en un momento.' },
      )
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e instanceof Error ? e.message : 'No se pudo publicar.' })
    } finally {
      setPublicando(false)
    }
  }

  async function restaurar(id: string) {
    await guardarAhora()
    const r = await api.restaurar(id)
    base.current = r.id
    ultimo.current = r.contenido
    setBorrador(r.contenido)
    setEstado((e) => (e ? { ...e, id: r.id, guardadoEn: r.guardadoEn, pendiente: true } : e))
    setGuardado('guardado')
    setRevision((n) => n + 1)
    setVista('inicio')
    setMensaje({ tipo: 'ok', texto: 'Versión recuperada como borrador. Revísala y dale Publicar cuando esté lista.' })
  }

  async function salir() {
    if (guardado !== 'guardado') await guardarAhora()
    await api.logout().catch(() => {})
    alSalir()
  }

  if (errorCarga)
    return (
      <Pantalla>
        <div className="flex flex-col items-center gap-3">
          <p className="text-ink">{errorCarga}</p>
          <Boton onClick={() => location.reload()}>Reintentar</Boton>
        </div>
      </Pantalla>
    )
  if (!estado) return <Pantalla>Cargando contenido…</Pantalla>

  const hayPendiente = estado.pendiente || guardado !== 'guardado'
  const seccion = vista.startsWith('precios:') ? SECCIONES_PRECIOS.find((s) => `precios:${s.clave}` === vista) : undefined

  const navegacion: { grupo: string; items: { vista: Vista; nombre: string }[] }[] = [
    {
      grupo: 'General',
      items: [
        { vista: 'inicio', nombre: 'Resumen' },
        { vista: 'promo', nombre: 'Promoción' },
      ],
    },
    { grupo: 'Precios y servicios', items: SECCIONES_PRECIOS.map((s) => ({ vista: `precios:${s.clave}` as Vista, nombre: s.titulo })) },
    {
      grupo: 'Archivos',
      items: [
        { vista: 'medios', nombre: 'Fotos y videos' },
        { vista: 'historial', nombre: 'Historial' },
      ],
    },
  ]

  return (
    <div className="min-h-dvh bg-hueso text-ink">
      <header className="sticky top-0 z-20 border-b border-linea bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-3">
            <span className="font-display text-[20px] font-medium tracking-tight whitespace-nowrap">Cire · Editor</span>
            <IndicadorGuardado estado={guardado} />
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="hidden text-[14px] font-semibold text-ink/70 hover:text-ink sm:inline">
            Ver sitio ↗
          </a>
          <Boton variante="primario" disabled={publicando || !hayPendiente} onClick={publicar}>
            {publicando ? 'Publicando…' : hayPendiente ? 'Publicar cambios' : 'Todo publicado'}
          </Boton>
        </div>
        {mensaje && (
          <div
            role={mensaje.tipo === 'error' ? 'alert' : 'status'}
            className={`border-t px-4 py-2.5 text-[14px] sm:px-6 ${mensaje.tipo === 'ok' ? 'border-morado-100 bg-morado-50 text-morado-700' : 'border-blush-200 bg-blush-50 text-blush-900'}`}
          >
            <div className="mx-auto flex max-w-7xl items-start gap-3">
              <p className="flex-1">{mensaje.texto}</p>
              <button type="button" className="font-semibold" onClick={() => setMensaje(null)} aria-label="Cerrar aviso">
                ×
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[17rem_1fr] lg:gap-10 lg:py-10">
        {/* Celular: un selector. Escritorio: barra lateral. */}
        <label className="flex flex-col gap-1 lg:hidden">
          <span className="text-[12px] font-semibold tracking-wide text-ink/50 uppercase">Sección</span>
          <select
            className="rounded-lg border border-linea bg-white px-3 py-3 text-[15px] font-semibold"
            value={vista}
            onChange={(e) => setVista(e.target.value as Vista)}
          >
            {navegacion.map((g) => (
              <optgroup key={g.grupo} label={g.grupo}>
                {g.items.map((i) => (
                  <option key={i.vista} value={i.vista}>
                    {i.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <nav className="hidden flex-col gap-6 lg:flex" aria-label="Secciones del editor">
          {navegacion.map((g) => (
            <div key={g.grupo} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-[11.5px] font-semibold tracking-wider text-ink/45 uppercase">{g.grupo}</p>
              {g.items.map((i) => (
                <button
                  key={i.vista}
                  type="button"
                  onClick={() => setVista(i.vista)}
                  aria-current={vista === i.vista ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2 text-left text-[14px] transition ${vista === i.vista ? 'bg-ink font-semibold text-white' : 'text-ink/80 hover:bg-ink/5'}`}
                >
                  {i.nombre}
                </button>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-1 border-t border-linea pt-4">
            <p className="px-3 text-[13px] text-ink/60">{usuario.nombre}</p>
            <button type="button" onClick={salir} className="rounded-lg px-3 py-2 text-left text-[14px] text-ink/70 hover:bg-ink/5">
              Cerrar sesión
            </button>
          </div>
        </nav>

        <main key={revision} className="max-w-3xl min-w-0">
          {vista === 'inicio' && <Resumen nombre={usuario.nombre} estado={estado} hayPendiente={hayPendiente} irA={setVista} />}
          {vista === 'promo' && <EditorPromo borrador={borrador} alCambiar={cambiar} />}
          {seccion && <EditorSeccion key={seccion.clave} seccion={seccion} borrador={borrador} alCambiar={cambiar} />}
          {vista === 'medios' && <Medios />}
          {vista === 'historial' && <Historial alRestaurar={restaurar} />}
          <button type="button" onClick={salir} className="mt-10 text-[14px] text-ink/60 underline lg:hidden">
            Cerrar sesión ({usuario.nombre})
          </button>
        </main>
      </div>
    </div>
  )
}

function IndicadorGuardado({ estado }: { estado: EstadoGuardado }) {
  const texto = {
    guardado: 'Borrador guardado',
    pendiente: 'Cambios sin guardar…',
    guardando: 'Guardando…',
    error: 'No se pudo guardar',
  }[estado]
  return (
    <span aria-live="polite" className={`text-[13px] ${estado === 'error' ? 'font-semibold text-blush-600' : 'text-ink/50'}`}>
      {texto}
    </span>
  )
}

function Resumen({
  nombre,
  estado,
  hayPendiente,
  irA,
}: {
  nombre: string
  estado: EstadoContenido
  hayPendiente: boolean
  irA: (v: Vista) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-[32px] leading-tight font-medium">Hola, {nombre}</h1>
        <p className="mt-2 text-[16px] text-ink/70">Aquí cambias precios, promociones, fotos y videos del sitio sin ayuda de nadie.</p>
      </header>

      <div className="rounded-card border border-linea bg-white p-5 sm:p-6">
        <h2 className="font-display text-[20px] font-medium">Cómo funciona</h2>
        <ol className="mt-4 flex flex-col gap-3 text-[15px] text-ink/80">
          <li>
            <strong className="text-ink">1. Edita.</strong> Elige una sección y cambia lo que quieras. Todo se guarda solo como borrador.
          </li>
          <li>
            <strong className="text-ink">2. Publica.</strong> Cuando termines, presiona <em>Publicar cambios</em> arriba. El sitio se actualiza en
            1 a 2 minutos.
          </li>
          <li>
            <strong className="text-ink">3. ¿Te equivocaste?</strong> En <em>Historial</em> recuperas cualquier versión anterior.
          </li>
        </ol>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-linea bg-white p-5">
          <dt className="text-[13px] text-ink/60">En línea desde</dt>
          <dd className="mt-1 text-[17px] font-semibold">{estado.publicadoEn ? fechaLegible(estado.publicadoEn) : 'Sin publicar todavía'}</dd>
          {estado.publicadoPor && <dd className="text-[13px] text-ink/60">por {estado.publicadoPor}</dd>}
        </div>
        <div className={`rounded-card border p-5 ${hayPendiente ? 'border-blush-200 bg-blush-50' : 'border-linea bg-white'}`}>
          <dt className="text-[13px] text-ink/60">Borrador</dt>
          <dd className="mt-1 text-[17px] font-semibold">{hayPendiente ? 'Tienes cambios sin publicar' : 'Igual a lo publicado'}</dd>
          {estado.guardadoEn && (
            <dd className="text-[13px] text-ink/60">
              Último guardado {fechaLegible(estado.guardadoEn)}
              {estado.guardadoPor ? ` por ${estado.guardadoPor}` : ''}
            </dd>
          )}
        </div>
      </dl>

      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            ['promo', 'Promoción', 'Nombre, fechas y precios de temporada'],
            ['precios:zonas', 'Precios de láser', 'Zonas, bikini, Full Body y combos'],
            ['medios', 'Fotos y videos', 'Sube y organiza tus archivos'],
          ] as [Vista, string, string][]
        ).map(([v, t, d]) => (
          <button
            key={v}
            type="button"
            onClick={() => irA(v)}
            className="flex flex-col gap-1 rounded-card border border-linea bg-white p-5 text-left transition hover:border-magenta/40"
          >
            <span className="text-[15px] font-semibold">{t} →</span>
            <span className="text-[13px] text-ink/60">{d}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
