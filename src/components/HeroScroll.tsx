import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { LogoCire } from './LogoCire'

/*
 * Hero del home controlado por el scroll.
 *
 * La sección mide 400svh y adentro hay una capa `sticky` de una pantalla. El
 * avance del scroll dentro de la sección (0 → 1) se reparte así:
 *
 *   0.00 – 0.40  primera mitad del video en un recuadro grande (súper zoom →
 *                la especialista sostiene el maneral, cuadro 48)
 *   0.40 – 0.55  la imagen se encoge al panel y entran los textos (--t: 0 → 1)
 *   0.58 – 1.00  segunda mitad dentro del panel (aplica el maneral en la pierna)
 *
 * Al final la sección se suelta y la página sigue. Si se sube, todo se rebobina.
 *
 * Al entrar no va a pantalla completa (el macro de golpe incomodaba): arranca
 * en un recuadro redondeado del ancho del contenido, con margen bajo la nav
 * (`marco`), y de ahí se encoge al panel.
 *
 * Logo: al entrar, el logo de CIRE va grande al centro del recuadro (blanco,
 * con sombra suave). Con el primer tramo del scroll (0 – 0.2) viaja a su lugar
 * en la nav y se vuelve rosa sobre círculo claro, como el de la nav. Mientras
 * viaja, <html> lleva `logo-en-hero` y el logo real de la nav se oculta; al
 * aterrizar se cambia por el real. Va `fixed` y fuera de la capa sticky para
 * poder pasar por encima de la nav. Al entrar, la imagen lleva un velo ciruela
 * (VELO_MAX) para que el logo contraste; se desvanece durante el viaje.
 *
 * No se usa <video>: adelantar y rebobinar un video con currentTime no es
 * fluido en Safari ni en muchos celulares. En su lugar hay una secuencia de
 * 97 cuadros WebP (todos los del video de 4 s NuevaCosmeHERO.mp4, en
 * public/hero/secuencia/) que se dibuja en un canvas, mezclando los dos
 * cuadros vecinos para que el movimiento se vea continuo. El video es un solo
 * movimiento continuo; la pausa para los textos va en el cuadro 48, cuando la
 * especialista sostiene el maneral con la cara a cuadro.
 *
 * Los cuadros se cargan por pasadas (cada 16, luego cada 8, 4, 2, 1): con
 * pocos cientos de KB ya se puede recorrer todo, y se va afinando.
 * Mientras no llega un cuadro se dibuja el más cercano que ya esté.
 *
 * Sin movimiento (reduced-motion o ahorro de datos): el script inline de
 * index.html pone `hero-estatico` en <html> y el CSS muestra textos y la
 * imagen final fija, sin descargar la secuencia.
 *
 * Escritorio: cuadros 1280×720. Móvil y tablet: recorte 4:5 (720×900) que
 * sigue a la especialista: su centro va del 60 % del ancho (cuadro 0) al 65 %
 * (cuadro 48, cara a cuadro) y al 55 % (cuadro 96, maneral en la pierna). Generados con ffmpeg (HDR HLG → SDR BT.709) a partir de
 * public/hero/fuente/NuevaCosmeHERO.mp4.
 */

const TOTAL = 97
const MEDIO = 48
const FIN_V1 = 0.4
const FIN_MORPH = 0.55
const INICIO_V2 = 0.58
/** Igual que --radius-media. */
const RADIO_PX = 24
/** Tramo del scroll en el que el logo viaja a la nav. */
const FIN_LOGO = 0.2
/** Rosa y fondo del logo de la nav (muestreados de public/hero/logo-160.webp). */
const ROSA_LOGO = [0xfe, 0xaf, 0xc8]
const FONDO_LOGO = 'rgb(253 253 253)'
/** Velo ciruela sobre la imagen al entrar, para que el logo blanco resalte. Se va mientras el logo viaja. */
const VELO_MAX = 0.5

const MQ_ESCRITORIO = '(min-width: 1024px)'

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)

/** Orden de carga por pasadas: primero un esqueleto de la secuencia, luego los huecos. */
function ordenDeCarga(): number[] {
  const orden: number[] = []
  const visto = new Set<number>()
  const agregar = (i: number) => {
    if (!visto.has(i)) {
      visto.add(i)
      orden.push(i)
    }
  }
  for (const paso of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < TOTAL; i += paso) agregar(i)
    agregar(TOTAL - 1)
  }
  return orden
}

/** Cuadro (con decimales) que toca según el avance del scroll. */
function cuadroPara(p: number): number {
  if (p <= FIN_V1) return (p / FIN_V1) * MEDIO
  if (p < INICIO_V2) return MEDIO
  return MEDIO + ((p - INICIO_V2) / (1 - INICIO_V2)) * (TOTAL - 1 - MEDIO)
}

function Foto({ nombre, prioridad = false }: { nombre: 'inicio' | 'final'; prioridad?: boolean }) {
  return (
    <picture>
      <source media={MQ_ESCRITORIO} srcSet={`/hero/${nombre}.avif`} type="image/avif" />
      <source media={MQ_ESCRITORIO} srcSet={`/hero/${nombre}.webp`} type="image/webp" />
      <source srcSet={`/hero/${nombre}-movil.avif`} type="image/avif" />
      <img
        src={`/hero/${nombre}-movil.webp`}
        alt=""
        aria-hidden="true"
        width={864}
        height={1080}
        decoding="async"
        fetchPriority={prioridad ? 'high' : 'auto'}
        loading={prioridad ? 'eager' : 'lazy'}
        className="hero-media absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  )
}

export function HeroScroll({ children }: { children: ReactNode }) {
  const seccionRef = useRef<HTMLElement>(null)
  const capaRef = useRef<HTMLDivElement>(null)
  const huecoRef = useRef<HTMLDivElement>(null)
  const marcoRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const textoRef = useRef<HTMLDivElement>(null)
  const pistaRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const logoFondoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (document.documentElement.classList.contains('hero-estatico')) return
    const seccion = seccionRef.current
    const capa = capaRef.current
    const hueco = huecoRef.current
    const marco = marcoRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!seccion || !capa || !hueco || !marco || !canvas || !ctx) return

    const escritorio = window.matchMedia(MQ_ESCRITORIO).matches
    const carpeta = escritorio ? 'd' : 'm'
    const cuadros: (HTMLImageElement | null)[] = new Array(TOTAL).fill(null)
    let vivo = true

    // Carga por pasadas, con 6 descargas a la vez.
    const cola = ordenDeCarga()
    const cargarSiguiente = async (): Promise<void> => {
      while (vivo && cola.length) {
        const i = cola.shift()!
        const img = new Image()
        img.decoding = 'async'
        img.src = `/hero/secuencia/${carpeta}/${String(i).padStart(3, '0')}.webp`
        try {
          await img.decode()
        } catch {
          continue
        }
        if (!vivo) return
        cuadros[i] = img
        pedir(true)
      }
    }
    for (let k = 0; k < 6; k++) void cargarSiguiente()

    /** El cuadro i, o el más cercano ya cargado. */
    const cercano = (i: number): HTMLImageElement | null => {
      for (let d = 0; d < TOTAL; d++) {
        const a = cuadros[i - d]
        if (a) return a
        const b = cuadros[i + d]
        if (b) return b
      }
      return null
    }

    // Geometría: tamaño de la capa, recuadro inicial (marco) y destino del
    // panel (el hueco del layout), relativos a la capa.
    let ancho = 0
    let alto = 0
    let dpr = 1
    const medir = () => {
      const c = capa.getBoundingClientRect()
      ancho = c.width
      alto = c.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(ancho * dpr)
      canvas.height = Math.round(alto * dpr)
      pedir(true)
    }

    /** Dibuja `img` cubriendo el rectángulo, como object-fit: cover + object-position. */
    const cubrir = (img: HTMLImageElement, x: number, y: number, w: number, h: number, posX: number, posY: number) => {
      const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight)
      const dw = img.naturalWidth * escala
      const dh = img.naturalHeight * escala
      ctx.drawImage(img, x + (w - dw) * posX, y + (h - dh) * posY, dw, dh)
    }

    // Logo volador: se mide contra el logo real de la nav.
    const logo = logoRef.current
    const logoFondo = logoFondoRef.current
    const raiz = document.documentElement
    let logoEnHero = raiz.classList.contains('logo-en-hero')
    const ponerLogoEnHero = (si: boolean) => {
      if (si === logoEnHero) return
      logoEnHero = si
      raiz.classList.toggle('logo-en-hero', si)
    }
    const moverLogo = (p: number) => {
      const nav = document.querySelector<HTMLElement>('[data-logo-nav]')
      if (!logo || !logoFondo || !nav) return
      const f = clamp(p / FIN_LOGO)
      const e = 1 - (1 - f) ** 3
      if (f >= 1) {
        logo.style.visibility = 'hidden'
        ponerLogoEnHero(false)
        return
      }
      ponerLogoEnHero(true)
      const m = marco.getBoundingClientRect()
      const n = nav.getBoundingClientRect()
      const lado = logo.offsetWidth
      const cx = m.left + m.width / 2 + (n.left + n.width / 2 - (m.left + m.width / 2)) * e
      const cy = m.top + m.height / 2 + (n.top + n.height / 2 - (m.top + m.height / 2)) * e
      const escala = 1 + (n.width / lado - 1) * e
      logo.style.visibility = 'visible'
      logo.style.left = '0px'
      logo.style.top = '0px'
      // transform-origin en la esquina: se resta medio lado ya escalado para centrar.
      const medio = (lado * escala) / 2
      logo.style.transform = `translate(${(cx - medio).toFixed(1)}px, ${(cy - medio).toFixed(1)}px) scale(${escala.toFixed(4)})`
      // Blanco y con sombra casi todo el viaje (se lee sobre la imagen); el
      // rosa y el círculo claro llegan en el último tramo, ya junto a la nav.
      const k = clamp((e - 0.6) / 0.4)
      const [r, g, b] = ROSA_LOGO.map((c) => Math.round(255 + (c - 255) * k))
      logo.style.color = `rgb(${r} ${g} ${b})`
      logo.style.filter = `drop-shadow(0 2px 14px rgb(75 24 57 / ${(0.35 * (1 - k)).toFixed(3)}))`
      logoFondo.style.opacity = k.toFixed(3)
    }

    let actual = -1
    let raf = 0
    let ultimo = 0
    let visible = true
    let sucio = true
    let primero = true

    const progreso = () => {
      const r = seccion.getBoundingClientRect()
      const recorrido = r.height - window.innerHeight
      return recorrido > 0 ? clamp(-r.top / recorrido) : 1
    }

    const dibujar = (ahora: number) => {
      raf = 0
      const objetivo = progreso()
      const dt = ultimo ? Math.min((ahora - ultimo) / 1000, 0.1) : 1 / 60
      ultimo = ahora
      const antes = actual
      // Suavizado: sigue al scroll con un poco de inercia, sin tirones de la rueda.
      actual = actual < 0 ? objetivo : actual + (objetivo - actual) * (1 - Math.exp(-dt * 10))
      if (Math.abs(objetivo - actual) < 0.0002) actual = objetivo
      const p = actual

      if (p !== antes || sucio) {
        sucio = false
        const t = clamp((p - FIN_V1) / (FIN_MORPH - FIN_V1))
        const e = t * t * (3 - 2 * t)
        seccion.style.setProperty('--t', e.toFixed(4))
        if (pistaRef.current) pistaRef.current.style.opacity = String(1 - clamp(p / 0.04))
        moverLogo(p)

        // Rectángulo de la imagen: del recuadro inicial al hueco del panel.
        // Se mide en cada dibujo: el cintillo de arriba (--anuncio-h) puede
        // mover ambos sin cambiarles el tamaño.
        const c = capa.getBoundingClientRect()
        const m = marco.getBoundingClientRect()
        const hr = hueco.getBoundingClientRect()
        const origen = { x: m.left - c.left, y: m.top - c.top, w: m.width, h: m.height }
        const destino = { x: hr.left - c.left, y: hr.top - c.top, w: hr.width, h: hr.height }
        const x = origen.x + (destino.x - origen.x) * e
        const y = origen.y + (destino.y - origen.y) * e
        const w = origen.w + (destino.w - origen.w) * e
        const h = origen.h + (destino.h - origen.h) * e
        // Encuadre: escritorio del centro a la derecha. Celular: en el
        // recuadro vertical se carga a la derecha (ahí está la cara en el
        // cuadro 48); en el panel ya cabe casi todo el recorte, centrado y un
        // pelo arriba para no cortar la cabeza.
        const posX = escritorio ? 0.5 + 0.5 * e : 0.75 - 0.25 * e
        const posY = escritorio ? 0.5 : 0.5 - 0.05 * e

        const f = cuadroPara(p)
        const i0 = Math.floor(f)
        const mezcla = f - i0
        const a = cuadros[i0] ?? cercano(i0)
        const b = mezcla > 0.01 && cuadros[i0] ? cuadros[Math.min(i0 + 1, TOTAL - 1)] : null

        if (a) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, ancho, alto)
          ctx.save()
          ctx.beginPath()
          ctx.roundRect(x, y, w, h, RADIO_PX)
          ctx.clip()
          ctx.globalAlpha = 1
          cubrir(a, x, y, w, h, posX, posY)
          if (b) {
            ctx.globalAlpha = mezcla
            cubrir(b, x, y, w, h, posX, posY)
          }
          // Velo ciruela del inicio (el mismo tramo en que viaja el logo).
          const velo = VELO_MAX * (1 - (1 - (1 - clamp(p / FIN_LOGO)) ** 3))
          if (velo > 0.001) {
            ctx.globalAlpha = velo
            ctx.fillStyle = '#4b1839'
            ctx.fillRect(x, y, w, h)
          }
          ctx.restore()
          if (primero) {
            primero = false
            canvas.style.opacity = '1'
            if (posterRef.current) posterRef.current.style.visibility = 'hidden'
          }
        }
      }

      if (actual !== objetivo) pedir()
      else ultimo = 0
    }

    function pedir(forzar = false) {
      if (forzar) sucio = true
      if (!raf && visible && vivo) raf = requestAnimationFrame(dibujar)
    }
    const alScroll = () => pedir()

    const ro = new ResizeObserver(medir)
    ro.observe(capa)
    ro.observe(hueco)
    ro.observe(marco)
    const io = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting
      if (visible) pedir(true)
    })
    io.observe(seccion)
    window.addEventListener('scroll', alScroll, { passive: true })

    // Si alguien llega con Tab a un enlace del hero mientras los textos aún no
    // se ven, se salta al punto donde ya están visibles.
    const alEnfocar = (e: FocusEvent) => {
      if (!textoRef.current?.contains(e.target as Node)) return
      if (progreso() >= FIN_MORPH) return
      const r = seccion.getBoundingClientRect()
      const recorrido = r.height - window.innerHeight
      window.scrollTo({ top: window.scrollY + r.top + recorrido * (FIN_MORPH + 0.01), behavior: 'instant' })
    }
    seccion.addEventListener('focusin', alEnfocar)

    medir()

    return () => {
      vivo = false
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', alScroll)
      seccion.removeEventListener('focusin', alEnfocar)
      raiz.classList.remove('logo-en-hero')
    }
  }, [])

  return (
    <section id="inicio" ref={seccionRef} className="hero-scroll relative bg-hueso">
      <div ref={capaRef} className="hero-capa overflow-hidden">
        {/* Recuadro inicial: el primer cuadro entra contenido, no a pantalla
            completa. Lleva el primer cuadro como imagen normal (se ve antes
            del JS y mientras llega la secuencia; se oculta cuando el canvas
            dibuja). */}
        <div
          className="hero-panel absolute inset-x-0 bottom-4 top-[calc(4rem+var(--anuncio-h,0px)+1rem)] lg:bottom-8 lg:top-[calc(4rem+var(--anuncio-h,0px)+2rem)]"
          aria-hidden="true"
        >
          <div className="mx-auto h-full max-w-6xl px-4 sm:px-10">
            <div ref={marcoRef} className="relative h-full overflow-hidden rounded-media">
              <div ref={posterRef}>
                <Foto nombre="inicio" prioridad />
                {/* Mismo velo que dibuja el canvas al inicio (VELO_MAX). */}
                <div className="absolute inset-0 bg-ciruela" style={{ opacity: VELO_MAX }} />
              </div>
            </div>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="hero-panel absolute inset-0 h-full w-full"
          style={{ opacity: 0 }}
        />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col px-4 pb-4 pt-[calc(4rem+var(--anuncio-h,0px)+1rem)] sm:px-10 lg:grid lg:grid-cols-[minmax(0,1fr)_58%] lg:items-center lg:gap-12 lg:pb-10 lg:pt-[calc(4rem+var(--anuncio-h,0px)+2rem)]">
          <div ref={textoRef} className="hero-texto relative z-10 shrink-0 px-2 sm:px-0">
            {children}
          </div>
          {/* Hueco del panel: define a dónde se encoge la imagen. En modo
              estático lleva la imagen final fija. */}
          <div
            ref={huecoRef}
            className="hero-hueco relative mt-5 min-h-[12rem] flex-1 overflow-hidden rounded-media lg:mt-0 lg:aspect-[5/4] lg:w-full lg:flex-none"
          >
            <div className="hero-solo-estatico" aria-hidden="true">
              <Foto nombre="final" />
            </div>
          </div>
        </div>

        <div
          ref={pistaRef}
          className="hero-pista pointer-events-none absolute inset-x-0 bottom-10 text-center lg:bottom-14"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-[14px] font-semibold text-ink shadow-sm backdrop-blur-sm">
            Desliza
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* Logo volador (fuera de la capa sticky para poder pasar sobre la nav). */}
      <div ref={logoRef} className="hero-logo" aria-hidden="true">
        <div ref={logoFondoRef} className="absolute inset-0 rounded-full" style={{ background: FONDO_LOGO, opacity: 0 }} />
        <LogoCire className="relative h-full w-full" />
      </div>
    </section>
  )
}
