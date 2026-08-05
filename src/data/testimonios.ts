import type { Testimonio } from './sucursales'

/*
 * Reseñas reales de Google (capturas en public/reseñas, fotos de perfil
 * recortadas en public/avatars/), 16 en total.
 *
 * Reparto: Home, Láser, Cera y Otros servicios son las 4 páginas de fondo —
 * llevan 3 reseñas cada una (12). Las 4 que sobran van una por una a HIFU,
 * Láser Bikini, Láser Zonas y Láser Cuerpo Completo. Cire Sculpt, Moldeo
 * Corporal y Post Operatorio (sub-páginas de precio dentro de Otros
 * servicios) no tienen sección propia — su página madre ya trae 3. 12 + 4 =
 * 16: se usan todas, ninguna se repite en dos páginas.
 *
 * `sucursal` (05/ago/26): las capturas de Google no indican de qué sucursal
 * es cada reseña — no hay esa trazabilidad guardada en ningún lado. A
 * pedido explícito se repartieron las 16 entre las 5 sucursales a criterio
 * (rotando Polanco → Del Valle → Coapa → Oriente → Metepec), asumiendo que
 * no es 100% verificable. Si en algún momento se consigue el dato real
 * (ej. desde el panel de Google Business por sucursal), reemplazar aquí.
 */

export const TESTIMONIOS_HOME: Testimonio[] = [
  {
    texto:
      'Muy contenta con el Servicio y los resultados, yo voy a depilación láser y además de que el personal es muy atento y amable, dan muy buen seguimiento. Los resultados 💯 de satisfacción....',
    autor: 'Paulina Vargas',
    sucursal: 'Cire Polanco',
    avatarSrc: '/avatars/paulina-vargas.jpg',
  },
  {
    texto:
      'Fue la primera vez que me hice depilación láser y lo amé, en la primera sesión dejaron de salirme vellitos en varias zonas, y ya voy en mi cuarta sesión y ya casi no tengo vello, y es más delgado, me faltan aún sesiones pero hasta ahora me ha gustado bastante, son todas muy amables y siempre está limpio el lugar. 100% recomendado. Además que lo agarre con promoción y súper accesibles los precios.',
    autor: 'Martinez Rojas María del Rosario',
    sucursal: 'Cire Del Valle',
    avatarSrc: '/avatars/martinez-rojas-maria-del-rosario.jpg',
  },
  {
    texto:
      'Excelente servicio de parte de todo el personal. Concluí mis sesiones de depilación, y realmente si notas los cambios desde la primera cita. Realmente los recomiendo, ya que te olvidas del rastrillo y estás siempre presentable... Si buscas una depilación láser estás en el lugar correcto...',
    autor: 'Arantxa Amado',
    sucursal: 'Cire Coapa',
    avatarSrc: '/avatars/arantxa-amado.jpg',
  },
]

export const TESTIMONIOS_LASER: Testimonio[] = [
  {
    texto:
      'Un excelente servicio, los resultados que obtuve con la depilación láser fueron justo lo que esperaba, el lugar muy limpio y el trato que te dan las chicas muy bueno 10/10.',
    autor: 'Lobato Patricia',
    sucursal: 'Cire Oriente',
    avatarSrc: '/avatars/lobato-patricia.jpg',
  },
  {
    texto:
      'Muy bonito el lugar y la atención es muy amable, a mi me dolió el láser pero sé que no a todas les pasa igual, además de que si me volvió a salir vello pero creo ningún método (honestamente) te quita al 100% el vello, suerte si deciden ir! Son muy organizados y limpios en este lugar ✨',
    autor: 'Leticia Ramírez',
    sucursal: 'Cire Metepec',
    avatarSrc: '/avatars/leticia-ramirez.jpg',
  },
  {
    texto:
      'Me había depilado la axila en otros lugares pero en ninguno había tenido el resultado que tuve aquí, se me quitó como el 95% del vello, muy cómodo, sin dolor, lo recomiendo mucho.',
    autor: 'Sonia Trejo',
    sucursal: 'Cire Polanco',
    avatarSrc: '/avatars/sonia-trejo.jpg',
  },
]

export const TESTIMONIOS_LASER_CUERPO_COMPLETO: Testimonio[] = [
  {
    texto:
      'Excelente trato, me hice cuerpo completo y siempre me sentí cómoda. Sí mejoró aunque yo pienso que es mejor hacerse un chequeo hormonal antes de tomar la decisión...',
    autor: 'Iliana Ruiz',
    sucursal: 'Cire Del Valle',
    avatarSrc: '/avatars/iliana-ruiz.jpg',
  },
]

export const TESTIMONIOS_CERA: Testimonio[] = [
  {
    texto:
      'El mejor lugar para depilación. Soy clienta desde que iniciaron con técnica de cera, después me hice el tratamiento láser de 8 sesiones y quedé feliz con el procedimiento, en todo momento fueron profesionales, jamás me dolió. Sin duda lo recomiendo, los resultados me encantaron.',
    autor: 'Tere Garza',
    sucursal: 'Cire Coapa',
    avatarSrc: '/avatars/tere-garza.jpg',
  },
  {
    texto:
      'Es mi primera experiencia en un proceso de depilación láser y la recomiendo ampliamente 🤩, ves resultados desde la sesión uno. El procedimiento es muy efectivo, el personal que te atiende es muy amable y te hacen sentir en confianza. Sin duda seguiré acudiendo para terminar mi proceso de depilación. ¡Muchas gracias CIRE Coapa! 💜',
    autor: 'Adriana Montiel',
    // Única reseña de las 16 que nombra su sucursal en el propio texto — se usa
    // ese dato real en vez del reparto a criterio (ver nota arriba del archivo).
    sucursal: 'Cire Coapa',
    avatarSrc: '/avatars/adriana-montiel.jpg',
  },
  {
    texto:
      'Apenas contraté mi paquete de depilación y estoy muy contenta con el servicio y los resultados que he ido observando. El personal es muy amable y muy bien capacitadas. Me encanta y lo súper recomiendo.',
    autor: 'Marisol Serrano',
    sucursal: 'Cire Metepec',
    avatarSrc: '/avatars/marisol-serrano.jpg',
  },
]

export const TESTIMONIOS_LASER_BIKINI: Testimonio[] = [
  {
    texto:
      'La atención es increíble y te resuelven todas las dudas. Llevo apenas 2 sesiones y noté resultados desde la primera ✨!! Además, si tienes piel súper sensible como yo, te ayudan con tips y cuidados especiales 💖. ¡100% recomendado! 🙌',
    autor: 'Brenda Villalpando',
    sucursal: 'Cire Polanco',
    avatarSrc: '/avatars/brenda-villalpando.jpg',
  },
]

export const TESTIMONIOS_LASER_ZONAS: Testimonio[] = [
  {
    texto:
      'Excelente servicio. Fui a hacerme servicio de depilación y quedé satisfecha con los resultados. La atención de las chicas siempre fue muy amable 💗, las recomiendo. Precio increíble para labio superior y axilas.',
    autor: 'Lidia Cruz',
    sucursal: 'Cire Del Valle',
    avatarSrc: '/avatars/lidia-cruz.jpg',
  },
]

export const TESTIMONIOS_HIFU: Testimonio[] = [
  {
    texto: 'Me encantó el servicio, son súper lindas las chicas, me dio muy buenos resultados el tratamiento 🤍.',
    autor: 'Viviana Vazquez',
    sucursal: 'Cire Coapa',
    avatarSrc: '/avatars/viviana-vazquez.jpg',
  },
]

export const TESTIMONIOS_OTROS_SERVICIOS: Testimonio[] = [
  {
    texto:
      'Excelente servicio, la atención de todas las chicas es increíble. Siempre son atentas ante cualquier situación, si vas tarde y avisas siempre tienes tiempo de tolerancia y buscan una solución para brindarte el o los servicios que tienes. Los masajes, depilación, faciales es el mejor lugar donde me han atendido. Gracias chicas Cire.',
    autor: 'Lourdes Carrasco Ortiz',
    sucursal: 'Cire Oriente',
    avatarSrc: '/avatars/lourdes-carrasco-ortiz.jpg',
  },
  {
    texto:
      'Excelente! Super recomendable desde la primer sesión note cambios en mis piernas, el vello crece más lento y delgado. Además son super amables las chicas.',
    autor: 'Daniela Tenorio Hernandez',
    sucursal: 'Cire Metepec',
    avatarSrc: '/avatars/daniela-tenorio-hernandez.jpg',
  },
  {
    texto: 'Excelente servicio, atención y precios súper razonables. Evelyn es muy profesional en su trabajo.',
    autor: 'Rubí Ruiz',
    sucursal: 'Cire Polanco',
    avatarSrc: '/avatars/rubi-ruiz.jpg',
  },
]
