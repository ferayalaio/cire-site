import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AvisoPrivacidad } from './pages/AvisoPrivacidad'
import { Cera } from './pages/Cera'
import { Hifu } from './pages/Hifu'
import { Home } from './pages/Home'
import { Laser } from './pages/Laser'
import { LaserBikini } from './pages/LaserBikini'
import { LaserCuerpoCompleto } from './pages/LaserCuerpoCompleto'
import { LaserZonas } from './pages/LaserZonas'
import { NotFound } from './pages/NotFound'
import { OtrosServicios } from './pages/OtrosServicios'
import { OtrosServiciosCireSculpt } from './pages/OtrosServiciosCireSculpt'
import { OtrosServiciosMoldeoCorporal } from './pages/OtrosServiciosMoldeoCorporal'
import { OtrosServiciosPostOperatorio } from './pages/OtrosServiciosPostOperatorio'
import { PaqueteRedirect } from './pages/PaqueteRedirect'
import { Sucursal } from './pages/Sucursal'
import { Ubicaciones } from './pages/Ubicaciones'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          {/* Núcleo del negocio: tres páginas propias de láser. */}
          <Route path="laser">
            <Route index element={<Laser />} />
            <Route path="zonas" element={<LaserZonas />} />
            <Route path="bikini" element={<LaserBikini />} />
            <Route path="cuerpo-completo" element={<LaserCuerpoCompleto />} />
          </Route>

          <Route path="cera" element={<Cera />} />
          <Route path="hifu" element={<Hifu />} />

          {/* Mismo patrón que /laser: un hub que enlaza a un catálogo propio por ruta. */}
          <Route path="otros-servicios">
            <Route index element={<OtrosServicios />} />
            <Route path="moldeo-corporal" element={<OtrosServiciosMoldeoCorporal />} />
            <Route path="cire-sculpt-anticelulitico" element={<OtrosServiciosCireSculpt />} />
            <Route path="post-operatorio" element={<OtrosServiciosPostOperatorio />} />
          </Route>

          <Route path="ubicaciones">
            <Route index element={<Ubicaciones />} />
            {/* Una sola ruta paramétrica cubre las cinco sucursales; el slug se
                valida dentro del componente. */}
            <Route path=":slug" element={<Sucursal />} />
          </Route>

          <Route path="aviso-de-privacidad" element={<AvisoPrivacidad />} />

          {/*
            Redirects de la estructura anterior (/paquetes, /paquetes/:slug,
            /ubicacion). No son visitas orgánicas todavía —el sitio no está
            publicado— pero si alguien probó la versión previa o guardó un link
            de esa etapa, no tiene sentido devolverle un 404.
          */}
          <Route path="paquetes">
            <Route index element={<Navigate to="/laser" replace />} />
            <Route path=":slug" element={<PaqueteRedirect />} />
          </Route>
          <Route path="ubicacion" element={<Navigate to="/ubicaciones" replace />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
