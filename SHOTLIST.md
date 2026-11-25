# SHOTLIST: fotos del sitio de CIRE Depilación

Brief para la sesión de fotos (o para generar imágenes con IA) del rediseño "La cabina CIRE", noviembre de 2026.

**Cómo se sube una foto:** se guarda con el nombre exacto de la tabla en `public/images/` (por ejemplo `public/images/zonas/axilas.jpg`) y se hace push. El sitio la detecta sola, genera las versiones AVIF/WebP y reemplaza la tarjeta "Imagen pendiente". No hay que tocar código.

**Formato de entrega:** JPG en sRGB, mínimo 1600 px de lado largo y en la proporción indicada. No hace falta comprimir: el sitio lo hace solo. **Sin texto, sin precios, sin logos sobrepuestos ni stickers.** La promoción la pone el sitio como cupón, nunca dentro de la foto.

---

## Reglas comunes de toda la sesión

| | |
|---|---|
| **Escenario** | Nuestras propias cabinas: muros de mármol blanco, persianas blancas y camilla con sábana rosa. Nada de stock ni de locaciones ajenas. |
| **Vestuario** | Clienta con **bata de satín rosa** y **gafas de protección láser**. Especialista con **uniforme rosa** y **guantes azules**. |
| **Equipo** | Pieza de mano del Láser Expert 8® con la **luz violeta** visible siempre que se pueda. |
| **Luz** | Suave y difusa desde un lado (ventana o softbox grande), con sombras ligeras. El tono de piel tiene que ser real: sin la dominante magenta de los LED. Si los LED del equipo aparecen, que sean un acento y no la luz principal. |
| **Edición** | La misma en toda la serie: saturación moderada, blancos limpios y contraste medio. Las fotos de zonas y paquetes tienen que verse como de **una sola sesión**. |
| **Diversidad** | Varios tonos de piel y tipos de cuerpo. Mayoría de mujeres; incluir algunos hombres en las zonas donde aplique (espalda, pecho, hombros). |

### Regla de la serie de zonas y paquetes

1. La zona va en **primer plano**, con la pieza de mano **tocando la piel**.
2. **Fondo liso de color** (papel o tela sin arrugas) con el color asignado en la tabla. Los colores rotan para que la rejilla se vea como un mosaico:
   - Rosa satinado `#FDEAF0`
   - Lila `#ECD3E8`
   - Ciruela `#4B1839`
3. **El tercio superior de la foto queda limpio**, solo fondo: ahí el sitio escribe el nombre de la zona. En fondo rosa o lila va en ciruela; en fondo ciruela va en blanco.
4. Mismo encuadre, misma distancia y misma luz en toda la serie. Lente de 50 a 85 mm, cámara a la altura de la zona.

---

## 1. Hero

| Archivo | Proporción | Sección |
|---|---|---|
| `hero/sesion.jpg` | 4:5 vertical | Hero del inicio, la imagen principal del sitio |

- **Qué debe verse:** clienta en bata de satín rosa con gafas de protección, **cara visible y relajada** (no tensa ni posando). Especialista con uniforme rosa y guantes azules aplicando la pieza de mano. Luz violeta del equipo visible.
- **Encuadre:** plano medio. La cara de la clienta en el tercio superior y la pieza de mano en el centro.
  - En celular la foto se recorta a 5:4 desde arriba, así que **nada importante en el 20 % inferior**.
- **Fondo:** cabina real (mármol, persiana), desenfocada.
- **Luz:** la de las reglas comunes. Es la foto que más tiene que transmitir calidez.
- **Hoy:** se muestra el video de cabina recortado.

## 2. Zonas: "Elige la zona" (4:5 vertical)

Las 8 primeras salen en el inicio y tienen que funcionar juntas: el reparto de fondos evita que se repita color en fila o en columna. Las 10 restantes son para `/laser/zonas`.

| Archivo | Fondo | Qué debe verse (pieza de mano tocando…) |
|---|---|---|
| `zonas/rostro-completo.jpg` | Rosa satinado | la mejilla; rostro de perfil con gafas |
| `zonas/bigote.jpg` | Lila | el área del bozo; perfil con gafas |
| `zonas/axilas.jpg` | Ciruela | la axila; brazo levantado detrás de la cabeza |
| `zonas/brazos-completos.jpg` | Rosa satinado | el brazo extendido, de hombro a muñeca en cuadro |
| `zonas/espalda-completa.jpg` | Lila | la espalda (persona de espaldas); se ve el destello del láser |
| `zonas/bikini.jpg` | Ciruela | la línea del bikini, con ropa interior desechable; encuadre discreto, de cadera |
| `zonas/medias-piernas.jpg` | Rosa satinado | la pantorrilla, de rodilla a tobillo |
| `zonas/piernas-completas.jpg` | Lila | el muslo, con la pierna completa en cuadro |
| `zonas/medio-rostro.jpg` | Ciruela | el mentón y la parte baja de la mejilla |
| `zonas/medios-brazos.jpg` | Rosa satinado | el antebrazo |
| `zonas/manos.jpg` | Lila | el dorso de la mano |
| `zonas/hombros.jpg` | Ciruela | el hombro (bien con hombre) |
| `zonas/media-espalda.jpg` | Rosa satinado | la espalda baja |
| `zonas/pecho.jpg` | Lila | el pecho (hombre) |
| `zonas/pezones.jpg` | Ciruela | el área de la areola; encuadre discreto (hombre) |
| `zonas/abdomen.jpg` | Rosa satinado | el abdomen bajo |
| `zonas/gluteos.jpg` | Lila | el glúteo, con ropa interior desechable; encuadre discreto |
| `zonas/pies.jpg` | Ciruela | el empeine |

## 3. Paquetes (4:5 vertical, misma regla que las zonas)

| Archivo | Fondo | Qué debe verse | Sección |
|---|---|---|---|
| `paquetes/full-body.jpg` | Ciruela | Cuerpo completo: clienta recostada en bata abierta o ropa interior desechable, con la pieza sobre la pierna. Que se lea "todo el cuerpo". | Precios por paquete, tarjeta Full Body |
| `paquetes/combo-sexy.jpg` | Rosa satinado | Piernas completas + axila: clienta sentada con un brazo arriba y la pieza en el muslo | O mejor, un paquete |
| `paquetes/combo-playa.jpg` | Lila | Medias piernas + axila, ambiente "verano": pieza en la pantorrilla | O mejor, un paquete |
| `paquetes/combo-piernas.jpg` | Ciruela | Piernas completas, de cadera a pie, con la pieza en el muslo | O mejor, un paquete |
| `paquetes/combo-axilas.jpg` | Rosa satinado | Axila + pierna: brazo arriba y pierna en cuadro | O mejor, un paquete |
| `paquetes/combo-bikini.jpg` | Lila | Axila + línea de bikini, encuadre discreto | O mejor, un paquete |

Estas fotos reemplazan los flyers de Buen Fin, que ya no se usan en el sitio.

## 4. Tecnología

| Archivo | Proporción | Fondo | Sección |
|---|---|---|---|
| `tecnologia/punta-zafiro.jpg` | 1:1 cuadrada | Oscuro, casi negro o ciruela | "¿Duele?", la sección oscura del inicio |

- **Qué debe verse:** **macro** de la punta de zafiro apoyada en la piel, con la **luz violeta** encendida y algo de gel brillando.
- **Luz:** baja y lateral. La luz del propio equipo hace el trabajo y el resto queda en penumbra.
- Es la imagen más memorable de la página: nítida, con poca profundidad de campo.

## 5. Otros tratamientos (4:3 horizontal)

Misma luz y edición que la serie de zonas, en cabina real.

| Archivo | Qué debe verse |
|---|---|
| `tratamientos/cera.jpg` | Especialista aplicando cera italiana con espátula sobre la pierna |
| `tratamientos/hifu.jpg` | Sesión de HIFU 4D facial; clienta recostada, aplicador sobre la mejilla |
| `tratamientos/corporales.jpg` | Tratamiento corporal (radiofrecuencia o moldeo) sobre el abdomen |

Hoy se usan las miniaturas anteriores con una corrección de color común.

## 6. Sucursales (3:2 horizontal)

| Archivo | Estado hoy | Qué debe verse |
|---|---|---|
| `sucursales/polanco.jpg` | Collage completo del flyer oficial (fachada + 2 interiores, 892 px, nov/26) | Fachada o recepción real |
| `sucursales/del-valle.jpg` | Collage completo del flyer oficial (fachada + 2 interiores, 892 px, nov/26) | Recepción con el sillón amarillo y el muro con el logo |
| `sucursales/coapa.jpg` | Collage completo del flyer oficial (fachada + 2 interiores, 892 px, nov/26) | Recepción o cabina |
| `sucursales/oriente.jpg` | Collage completo del flyer oficial (fachada + 2 interiores, 892 px, nov/26) | Cabina o recepción |
| `sucursales/metepec.jpg` | Collage completo del flyer oficial (fachada + 2 interiores, 892 px, nov/26) | Cabina o recepción |

- **Luz:** natural, con el lugar ordenado y sin gente o con el equipo de espaldas.
- **Encuadre:** horizontal, a la altura de los ojos, con las líneas rectas (sin gran angular deformado).
- Las cuatro provisionales se ven borrosas en pantallas grandes, así que conviene reemplazarlas.
- **Sección:** "Encuentra tu Cire más cercana", junto al mapa de la sucursal activa.

## 7. Cierre

| Archivo | Proporción | Sección |
|---|---|---|
| `cta/recepcion.jpg` | 3:2 horizontal | Banner final "10% en tu primera sesión o evaluación sin costo" |

- **Qué debe verse:** recepción o cabina de una sucursal, cálida y ordenada. Puede aparecer una especialista recibiendo a una clienta.
- En escritorio la foto ocupa la mitad izquierda del banner y se recorta un poco en altura, así que **el centro es lo importante**.

## 8. Posters de "Así es una sesión" (9:16 vertical)

`sesiones/1-poster.jpg` … `sesiones/6-poster.jpg`: ya están extraídos con ffmpeg de los videos de `public/videos/sesion/`.

| Video | Segundo | Nota |
|---|---|---|
| 1 | 14.97 | Cara limpia; subtítulo "en Cire" sobre el torso |
| 2 | 29.33 | Cara limpia; subtítulo "ese traje" sobre el pecho |
| 3 | 4.47 | Cara limpia; subtítulo "No todos" sobre el torso |
| 4 | 2.33 | Sin subtítulo (queda una sombra tenue de transición) |
| 5 | 5.63 | Sin subtítulo (queda una sombra tenue de transición) |
| 6 | 0.50 | Cara limpia; subtítulo "Si te depilas" sobre el cuerpo |

Los videos 1, 2, 3 y 6 traen el subtítulo quemado en todos los cuadros con cara. **Si existen las versiones originales sin subtítulos**, conviene volver a extraer esos cuatro posters de ahí con el mismo nombre de archivo.

## 9. Íconos de bikini (opcional)

`iconos/bikini/{basico,sexy,french,brazilian}.svg`: los 4 diseños de bikini de la marca (los del video 3). Si se suben con esos nombres, el desplegable "Bikini a elegir" los muestra junto a cada nombre. Mientras no estén, es solo texto.
