# Cire — sitio

React + TypeScript + Vite + Tailwind, con React Router.

**El sitio es una landing de precalentamiento, no un e-commerce.** La meta no es
vender desde acá: es que la persona llegue a WhatsApp ya decidida, con el precio
y el paquete claros, para que la conversación cierre más rápido. Por eso el
copy del sitio es profesional y frío — la calidez y el cierre pasan en
WhatsApp — y por eso **no hay formularios**: todo botón lleva a un chat.

## Correr en local

```bash
npm install
cp .env.example .env.local   # ver "Variables de entorno"
npm run dev
```

```bash
npm run build    # tsc -b && vite build
npm run lint     # oxlint
npm run preview  # sirve dist/ como en producción
```

## Variables de entorno

Ninguna es secreta: todo lo que empieza con `VITE_` se inlinea en el bundle y se
ve desde el navegador. **No pongas acá el token de la Conversions API.**

| Variable              | Default                  | Para qué |
| --------------------- | ------------------------ | -------- |
| `VITE_META_PIXEL_ID`  | `706257346536151`        | Sobrescribí solo para apuntar a un pixel de prueba. |
| `VITE_WHATSAPP_PHONE` | — (**hay que cargarla**) | Un solo número para las cinco sucursales. Sin esto los links van a `wa.me/` sin número y no abren nada. |
| `VITE_GA4_ID`         | — (opcional)             | ID de medición de GA4 (`G-XXXXXXXXXX`). Sin esto no se manda nada a GA4; el pixel sigue funcionando igual. |

`VITE_WHATSAPP_PHONE` va como lada de país + número: para México `52` + 10
dígitos → `525512345678`. Se puede pegar con `+`, espacios o guiones, el código
los limpia. Si el link abre "el número no está en WhatsApp", probá sin el `1`
viejo del `521`.

El diferenciador de sucursal **no va en el número**: va en el texto del mensaje
prellenado (ver "Mensaje de WhatsApp" más abajo).

## Estructura de rutas

| Ruta | Archivo | Prioridad |
| ---- | ------- | --------- |
| `/` | `pages/Home.tsx` | Hero a pantalla completa |
| `/laser` | `pages/Laser.tsx` | Hub — resumen y los tres combos destacados |
| `/laser/zonas` | `pages/LaserZonas.tsx` | Precio por zona + tabla de combos |
| `/laser/bikini` | `pages/LaserBikini.tsx` | Los 4 niveles |
| `/laser/cuerpo-completo` | `pages/LaserCuerpoCompleto.tsx` | **Full Body — la página de mayor prioridad de conversión** |
| `/cera` | `pages/Cera.tsx` | Secundario |
| `/hifu` | `pages/Hifu.tsx` | Secundario |
| `/otros-servicios` | `pages/OtrosServicios.tsx` | Terciario — post-operatorio, Cire Sculpt, moldeo corporal |
| `/ubicaciones` | `pages/Ubicaciones.tsx` | Hub de las 5 sucursales |
| `/ubicaciones/:slug` | `pages/Sucursal.tsx` | Una plantilla para las 5 (`polanco`, `del-valle`, `coapa`, `oriente`, `metepec`) |
| `/aviso-de-privacidad` | `pages/AvisoPrivacidad.tsx` | Legal |

Blog: fase 2, no entra en este lanzamiento.

### Redirects de la versión anterior

Una iteración previa de este sitio usaba `/paquetes` y `/paquetes/:slug` como
rutas canónicas. Esa estructura quedó reemplazada por la de arriba, así que
`App.tsx` redirige:

- `/paquetes` → `/laser`
- `/paquetes/<slug-viejo>` → la página nueva que corresponde (mapa completo en
  `src/pages/PaqueteRedirect.tsx`)
- `/ubicacion` (singular) → `/ubicaciones`

No son visitas orgánicas todavía —el sitio no está publicado— pero si alguien
guardó un link de esa etapa, no tiene sentido devolverle un 404.

## Capa de datos — cómo actualizar precios

**Ningún precio vive en el JSX de una página.** Los precios cambian
~mensualmente y hay promos estacionales (Buen Fin, Hot Sale, Aniversario Cire,
Hot Summer), así que todos salen de `src/data/precios.ts`. Actualizar tarifas
es editar ese archivo — el diseño de las páginas no se toca.

| Archivo | Qué contiene |
| ------- | ------------ |
| `src/data/precios.ts` | Zonas, niveles de bikini, combos, Full Body, cera, HIFU, otros servicios, MSI y la promo estacional activa |
| `src/data/sucursales.ts` | Las 5 sucursales: dirección, link de Maps, foto, horario |
| `src/data/marca.ts` | Claims de posicionamiento y la línea de COFEPRIS |

Un precio en `null` significa "pendiente de cargar" y la página lo muestra
así, en vez de inventar un número. `formatPrecio()` centraliza el formato
(`$4,500` estilo MXN); ninguna página escribe el símbolo de pesos a mano.

**Para lanzar o apagar una promo**, es una sola línea:
`PROMO_ACTIVA` en `precios.ts`, `null` la apaga.

### Lo que decidieron NO mostrar en el sitio (no es un olvido)

- El **5% de descuento en efectivo** de los 7 combos de láser: exclusivo de
  WhatsApp, no está en ninguna tabla del sitio.
- La regla de **sesiones cada 8 semanas de Del Valle**: se comunica en
  WhatsApp al confirmar sucursal, no en `/ubicaciones/del-valle`.
- **No hay calculadora de "quitar una zona" de un combo.** El precio del
  combo es fijo.
- El **documento COFEPRIS**: existe pero no se publica por confidencialidad.
  En su lugar va la línea genérica de `MARCA.cofepris`, ya cargada en
  `/aviso-de-privacidad`.

## Mensaje de WhatsApp

Todo pasa por `src/lib/whatsapp.ts`. El mensaje prellenado varía según de
dónde viene el clic:

- Página de servicio: *"Hola, quiero información del Full Body (ref: ...)"*
- Página de sucursal: *"Hola, quiero agendar en la sucursal Coapa (ref: ...)"*
- **Combinado**, cuando la persona ya visitó una sucursal en esta visita y
  después escribe desde una página de servicio: *"Hola, quiero información
  del Combo Piernas y estoy cerca de Coapa (ref: ...)"*

Esto último funciona con `sessionStorage` (`src/lib/sucursal-context.ts`):
cada página de sucursal llama a `useRememberSucursal(slug)`, que guarda "la
última sucursal vista" en la visita. Cuando el botón de WhatsApp arma el
mensaje, si no hay una sucursal explícita en el contexto (como si la hay en
`/ubicaciones/:slug`), busca la última vista y la agrega.

Es `sessionStorage` y no `localStorage` a propósito: la intención pertenece a
la visita, no al dispositivo. Con `localStorage`, alguien que miró Coapa hace
tres meses seguiría apareciendo "cerca de Coapa" hoy.

> Nota para cuando se edite este sitio con Claude en artifacts: esa
> restricción (nunca usar `localStorage`/`sessionStorage`) es una regla del
> entorno de artifacts de Claude.ai, no de este sitio. Acá, en el repo real
> desplegado en Vercel, `sessionStorage` es la elección correcta y ya está
> implementada así.

## Tracking

Todo pasa por `src/lib/analytics.ts` — ninguna página llama a `fbq` o `gtag`
por su cuenta. Un solo lugar para cambiar nombres de evento o parámetros, y no
se puede agregar un CTA que se olvide de mandar el contexto.

### Meta Pixel (`706257346536151`)

| Evento | Dónde | Qué manda |
| ------ | ----- | --------- |
| `PageView` | `useMetaPixel` en el `Layout`, en cada cambio de ruta | — |
| `ViewContent` | cada página de servicio (`/laser/cuerpo-completo`, `/cera`, `/hifu`, `/otros-servicios`) | `content_name`, `content_category`, `content_ids` |
| `Contact` | clic en cualquier botón de WhatsApp | servicio, placement, ruta, sucursal, campaña |
| `WhatsAppClick` | idem, custom | igual que `Contact`, mismo `eventID` |
| `Lead` | **sin usar todavía** — listo para el día que haya formulario | igual, más la ruta de origen |

`content_category` se deriva de la categoría real del servicio
(`Depilacion Laser`, `Depilacion con Cera`, `HIFU`, `Corporal`) y no queda fijo
en un solo valor: etiquetar un HIFU como depilación láser ensucia el desglose
justo del lado donde se decide dónde poner presupuesto.

`Lead` está tree-shakeado del bundle hasta que algo lo importe. Llamarlo en el
**submit exitoso** de un futuro formulario, no en el click del botón, o se
cuentan intentos fallidos como leads.

### Google Analytics 4

`src/lib/ga4.ts` corre gtag.js en paralelo al pixel, sin interferir: son dos
scripts independientes. Es gratis y, como los precios son abiertos para SEO,
GA4 dice qué páginas de zona o de sucursal traen tráfico **orgánico** — un dato
que Meta Ads Manager no puede dar porque solo ve tráfico pagado.

| Evento GA4 | Cuándo |
| ---------- | ------ |
| `page_view` | mismo momento que el `PageView` de Meta |
| `view_item` | mismo momento que el `ViewContent` de Meta |
| `generate_lead` + `whatsapp_click` | mismo momento que el `Contact` de Meta |

Si `VITE_GA4_ID` no está configurado, el módulo entero queda inerte —de hecho,
el bundle lo elimina por dead-code-elimination— y el pixel sigue funcionando
sin ningún cambio.

### eventID y Conversions API

Cada evento de Meta sale con un `eventID` con formato
`<prefijo>_<timestamp>_<random>` (`wa_`, `vc_`, `lead_`). `trackWhatsAppClick`
y `trackLead` lo **devuelven**, y además queda accesible con
`getLastWhatsAppEventId()`.

Sirve para cuando se implemente Conversions API del lado servidor: si el
server manda el mismo `Contact` con ese `event_id`, Meta lo deduplica contra el
que salió del navegador en lugar de contar dos.

### SEO

`src/hooks/useDocumentMeta.ts` le pone a cada ruta su `<title>`, su
`description`, sus `og:*` y su `<link rel=canonical>`. **Toda página nueva
tiene que llamarlo.**

Como los precios son abiertos y viven en HTML real (nunca en una imagen o un
video), cada zona/sucursal es una página indexable con su propio título — es
la base de lo que después va a mostrar Google Search Console.

**Límite conocido:** Googlebot ejecuta JS y lee lo que escribe el hook, pero
los scrapers de preview de links (el de WhatsApp entre ellos) **no**. Una
página de servicio compartida por chat muestra el título del `index.html`, no
el suyo. Arreglarlo requiere prerender o SSR — decisión aparte, no está hecho.

---

## Desplegar en Vercel

`vercel.json` ya está en el repo con el rewrite que manda todas las rutas a
`index.html`. **Sin eso, entrar directo a `/laser/cuerpo-completo` (o recargar
ahí) da 404**, porque Vercel busca un archivo en esa carpeta y no existe — el
router es del lado del cliente.

### Opción A — desde el dashboard (recomendada)

1. Subí el proyecto a un repo de GitHub. **Ojo:** este directorio todavía no es
   un repo git — hay que `git init`, commit y push. `.gitignore` ya cubre
   `node_modules` y `.env.local`.
2. En [vercel.com/new](https://vercel.com/new), importá el repo.
3. Vercel detecta Vite solo. Confirmá que quede:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. En **Environment Variables**, agregá `VITE_WHATSAPP_PHONE` (obligatoria) y
   `VITE_GA4_ID` (si ya hay una propiedad de GA4 creada), marcadas para
   Production, Preview y Development. `VITE_META_PIXEL_ID` no hace falta: el
   default ya es el pixel de Cire.
5. **Deploy.**
6. En **Settings → Domains**, agregá el dominio de Cire y seguí las
   instrucciones de DNS que da Vercel.

Cada push a la rama principal redespliega. Cada PR recibe una URL de preview.

> Las variables `VITE_` se inlinean **en build time**. Si cambiás una en
> Vercel, hay que **redesplegar** para que el sitio la tome.

### Opción B — desde la terminal

```bash
npm i -g vercel
vercel login
vercel                                  # primer deploy, hace las preguntas de config
vercel env add VITE_WHATSAPP_PHONE
vercel env add VITE_GA4_ID              # opcional
vercel --prod
```

### Después de cada deploy, revisar

- [ ] Entrar **directo** a `https://<dominio>/laser/cuerpo-completo` y
      recargar. Tiene que cargar, no un 404.
- [ ] Que el botón flotante abra WhatsApp con el número correcto y el mensaje
      prellenado correcto.
- [ ] Visitar una sucursal y después una página de servicio: el mensaje tiene
      que incluir "...y estoy cerca de \<sucursal\>".
- [ ] Que cada página tenga su propio título en la pestaña.

---

## Checklist manual en Meta Events Manager

Esto **no se hace desde el código**. Hay que entrar a
[Events Manager](https://business.facebook.com/events_manager2) con el pixel
`706257346536151`.

### 1. Verificación de dominio

Sin esto no funciona Aggregated Event Measurement y las conversiones en iOS
llegan incompletas.

- [ ] **Business Settings → Brand Safety → Domains → Add.** Cargá el dominio
      de Cire.
- [ ] Elegí un método:
      - **Meta-tag**: Meta da un
        `<meta name="facebook-domain-verification" content="...">` para el
        `<head>` de `index.html`. Pasámelo y lo agrego.
      - **DNS TXT**: en el proveedor del dominio, no toca el código.
      - **Subir un HTML**: el archivo va en `public/`.
- [ ] Volvé y dale **Verify**. Puede tardar hasta 72 h si fue por DNS.

### 2. Eventos priorizados (AEM)

- [ ] **Events Manager → Aggregated Event Measurement → Configure Web Events.**
- [ ] `Contact` como evento **#1** de la prioridad.
- [ ] `ViewContent` abajo de `Contact`.

### 3. Test Events

- [ ] **Events Manager → tu pixel → Test Events.** Pegá la URL del sitio ahí
      (funciona igual con `localhost:5173`).
- [ ] Navegá y confirmá:
      - `PageView` en cada cambio de ruta, incluso sin recargar.
      - `ViewContent` en `/laser/cuerpo-completo`, `/cera`, `/hifu` y
        `/otros-servicios`, con `content_name` igual al H1 en pantalla.
      - `Contact` + `WhatsAppClick` al hacer clic en un botón, con el
        `content_name` correcto.
      - Visitá una sucursal y después un servicio: el `Contact` tiene que
        traer `cire_sucursal` o el mensaje mostrar la sucursal combinada.
- [ ] `ViewContent` llega **una sola vez** por página. Hay un guard para el
      doble-montaje de StrictMode en dev; si ves duplicados en prod, avisá.
- [ ] En dev, la consola loguea cada evento como `[analytics] ...`.

### 4. Diagnóstico y calidad

- [ ] **Events Manager → Diagnostics.** Debería estar vacío.
- [ ] Extensión **Meta Pixel Helper** en Chrome, para ver si algo dispara
      doble o algún parámetro llega mal.
- [ ] En cuanto los precios estén cargados (campo `valor` en `precios.ts`),
      Meta empieza a recibir `value` + `currency: MXN`. Hasta entonces no
      manda ninguno — `value` sin `currency` Meta lo descarta.

### 5. Opcional, cuando haya volumen

- [ ] Conversiones personalizadas a partir de `WhatsAppClick` filtrando por
      `cire_sku`.
- [ ] Públicos de remarketing con `ViewContent` filtrado por `content_name`.
- [ ] Conversions API server-side reusando el `eventID` (ver arriba).

---

## Google Analytics 4 y Search Console

- [ ] Crear la propiedad GA4 (si no existe) y cargar `VITE_GA4_ID` en Vercel.
- [ ] **Google Search Console**: conectar una vez publicado el sitio, con el
      mismo método de verificación de dominio que Meta (DNS TXT sirve para
      ambos a la vez).
- [ ] Después de 3-4 semanas: cruzar qué páginas de zona/sucursal traen tráfico
      orgánico en GA4 + Search Console contra cuáles convierten mejor en Meta
      Ads — es el dato que decide dónde poner el blog de fase 2.

---

## Roadmap

**Fase 1 (este lanzamiento):** todo lo de arriba — Home, las tres páginas de
láser, cera, HIFU, otros servicios, las 5 ubicaciones, aviso de privacidad,
pixel + GA4 funcionando, precios en capa de datos editable.

**Fase 2 (después de medir 3-4 semanas):** blog SEO de cola larga, posible
calculadora de precios interactiva, ajustes según qué páginas convierten mejor
en Meta Ads.

---

## Lo que falta cargar

La estructura y el tracking están completos; **falta el contenido real y
algunos assets de marca**. Los huecos se muestran como bloques punteados
"Pendiente: ..." en lugar de quedar vacíos, para que se note qué falta.

- **`src/data/precios.ts`** — el tarifario completo: zonas, los 4 niveles de
  bikini, los combos (el brief nombra 6 pero dice "los 7 combos" al hablar del
  5% en efectivo — **falta confirmar el séptimo**), Full Body, cera, HIFU y
  otros servicios. Todo en `null` hasta tener el documento de tarifas.
- **`src/data/sucursales.ts`** — dirección exacta y link de Maps de cada
  sucursal, copiados tal cual del listado oficial (no se inventan ni se
  parafrasean). El mapa embebido en cada sucursal no aparece hasta que haya
  dirección cargada.
- **`src/pages/AvisoPrivacidad.tsx`** — el texto legal lo define Cire.
- **Iconos de los 4 niveles de bikini** — van en `public/` y se referencian
  desde `NIVELES_BIKINI` en `precios.ts` (campo `icono`). Mientras no estén, la
  página muestra un número de orden en vez de un icono genérico.
- **Fotos de las 5 sucursales** — van en `public/sucursales/` y se referencian
  desde `SUCURSALES` en `sucursales.ts` (campo `foto`).
- **Fotos de antes/después** — van en `public/antes-despues/`; hoy las tres
  páginas de láser muestran el hueco marcado como pendiente.
- **Reseñas de Google** — decidir si van por widget o por curación manual; no
  está implementado ninguno de los dos todavía.
- **`.env.local` → `VITE_WHATSAPP_PHONE`.** Es lo más urgente: sin el número,
  ningún botón del sitio funciona.
- **`public/fonts/`** — está vacío, pero `src/index.css` declara un
  `@font-face` para `HelveticaNeueRoman.woff2` / `.woff`. Cae al fallback
  (Helvetica Neue del sistema → Arial) hasta que se suban los archivos.
