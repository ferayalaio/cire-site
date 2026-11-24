import { Link } from 'react-router-dom'
import { ArticleShell } from '../../components/ArticleShell'
import { getPost } from '../../data/blog'
import type { FaqItem } from '../../data/faq'

/*
 * Fuente de cada dato: manual oficial "Servicio Láser Expert 8" (nov/26) —
 * protocolo inicial de 8 sesiones por zona, intervalos de 4 a 8 semanas,
 * hasta 95% de reducción en los mejores casos, SOP, rasurado entre sesiones,
 * contraindicaciones. Preparación: FAQ_HOME. Si el manual cambia, este texto
 * se revisa con él.
 */
const POST = getPost('cuantas-sesiones-depilacion-laser')!

const FAQ: FaqItem[] = [
  {
    pregunta: '¿Con 8 sesiones de láser es suficiente?',
    respuesta:
      'Para muchas personas sí, pero no para todas. El protocolo inicial es de 8 sesiones por zona; según tu vello, tu piel, la zona y factores hormonales, algunas personas necesitan sesiones adicionales o de mantenimiento. Se define en la valoración y se ajusta sesión con sesión.',
  },
  {
    pregunta: '¿Cada cuánto son las sesiones de depilación láser?',
    respuesta:
      'Generalmente entre 4 y 8 semanas, según la zona y cómo evoluciona tu vello. Respetar el intervalo importa: el láser actúa sobre el vello en fase de crecimiento, y adelantar la sesión no acelera el resultado.',
  },
  {
    pregunta: '¿Desde qué sesión se notan los resultados?',
    respuesta:
      'Desde las primeras sesiones el vello empieza a crecer más lento, más fino y en menor cantidad. El resultado es progresivo y se construye a lo largo de todo el protocolo.',
  },
  {
    pregunta: '¿La depilación láser es definitiva?',
    respuesta:
      'Logra una reducción permanente del vello, pero no garantiza eliminarlo al 100%. En los mejores casos se alcanza hasta un 95% de reducción. Algunos vellos pueden reaparecer con el tiempo y se trabajan con mantenimiento.',
  },
]

export function CuantasSesionesLaser() {
  return (
    <ArticleShell
      post={POST}
      faq={FAQ}
      whatsapp={{ sku: 'blog-cuantas-sesiones', nombre: 'depilación láser', categoria: 'laser' }}
    >
      <div className="resumen">
        <p>
          <strong>Respuesta corta:</strong> el protocolo inicial es de <strong>8 sesiones por zona</strong>, con{' '}
          <strong>4 a 8 semanas</strong> entre cada una. Los cambios se notan desde las primeras sesiones, pero el
          resultado se construye a lo largo de todo el tratamiento. Algunas personas necesitan sesiones adicionales o
          de mantenimiento, y eso se define en tu valoración.
        </p>
      </div>

      <h2>Por qué no basta con una sesión</h2>
      <p>
        El láser emite energía que absorbe la melanina del vello. Esa energía se transforma en calor y actúa sobre el
        folículo, que poco a poco pierde su capacidad de producir vello.
      </p>
      <p>
        El detalle está en que el vello crece por fases, y no todos los folículos están en la misma fase al mismo
        tiempo. En cada sesión el láser alcanza a los que están activos en ese momento; los demás se trabajan en las
        siguientes. Por eso el resultado es progresivo y se necesitan varias sesiones para cubrir todos los ciclos.
      </p>

      <h2>Por qué 8 sesiones</h2>
      <p>
        En Cire trabajamos con el <Link to="/laser">Protocolo Láser Expert 8®</Link>: un plan inicial de 8 sesiones
        por zona, definido a partir de 9 años de experiencia tratando distintos tipos de piel y vello. Es el número
        que incluyen nuestros paquetes por zona y el de{' '}
        <Link to="/laser/cuerpo-completo">depilación láser de cuerpo completo</Link>.
      </p>
      <p>
        Ocho sesiones no son una cifra mágica para todas: es el punto de partida. El tratamiento se ajusta sesión con
        sesión según el tono de tu piel, las características de tu vello, la zona y cómo vas respondiendo.
      </p>

      <h2>Qué cambia sesión con sesión</h2>
      <ul>
        <li>El vello empieza a crecer más lento.</li>
        <li>El vello que sale es más fino.</li>
        <li>Hay menos cantidad de vello en la zona.</li>
        <li>Necesitas rasurarte con mucha menos frecuencia.</li>
      </ul>
      <p>
        Al dejar de rasurarte tan seguido, también suele bajar la irritación y los vellos enterrados que provoca el
        rastrillo.
      </p>

      <h2>Cada cuánto son las sesiones</h2>
      <p>
        Por lo general, entre <strong>4 y 8 semanas</strong>, según la zona y cómo evoluciona tu vello. Tu
        especialista ajusta el calendario conforme avanzas. Adelantar una sesión no acelera el resultado, porque el
        láser necesita encontrar el vello en fase de crecimiento.
      </p>

      <h2>Qué hace que necesites más o menos sesiones</h2>
      <ul>
        <li>
          <strong>La zona.</strong> No todas las zonas responden al mismo ritmo; en rostro, por ejemplo, el
          componente hormonal suele pesar más.
        </li>
        <li>
          <strong>Tu vello.</strong> El láser busca el pigmento, así que el vello oscuro responde mejor. El vello muy
          claro, cano o pelirrojo responde menos.
        </li>
        <li>
          <strong>Tu piel.</strong> El tono de piel define los parámetros de cada sesión; por eso la primera cita es
          una valoración.
        </li>
        <li>
          <strong>Las hormonas.</strong> Con síndrome de ovario poliquístico (SOP), el estímulo hormonal hace que el
          vello siga apareciendo, y pueden necesitarse más sesiones y mantenimientos. El láser ayuda mucho a reducir
          el vello, pero no trata el SOP: lo ideal es acompañarlo con seguimiento médico.
        </li>
        <li>
          <strong>La constancia.</strong> Respetar los intervalos y no arrancar el vello entre sesiones hace una
          diferencia real.
        </li>
      </ul>

      <h2>¿Y al terminar las 8 sesiones?</h2>
      <p>
        La depilación láser logra una reducción permanente del vello, pero no garantiza eliminarlo al 100%. En los
        mejores casos se alcanza hasta un 95% de reducción. Con el tiempo pueden reaparecer algunos vellos, y para
        eso existen las sesiones de mantenimiento, que se programan según tu caso.
      </p>

      <h2>Cómo aprovechar cada sesión</h2>
      <ol>
        <li>Rasura la zona con rastrillo 24 horas antes y llega con la piel limpia, sin cremas, desodorante ni maquillaje.</li>
        <li>Entre sesiones puedes usar rastrillo, pero no cera, pinzas ni depiladoras eléctricas: el láser necesita la raíz.</li>
        <li>Evita el sol y las camas de bronceado antes y después. Si te bronceaste, hay que esperar de 10 a 15 días.</li>
        <li>Si estás embarazada, tomas medicamentos o tuviste un tratamiento reciente en la piel, coméntalo antes de tu cita.</li>
      </ol>
      <p>
        Si quieres calcular tu tratamiento, revisa los <Link to="/laser/zonas">precios de depilación láser por zona</Link>{' '}
        o los <Link to="/laser/bikini">niveles de bikini</Link>.
      </p>
    </ArticleShell>
  )
}
