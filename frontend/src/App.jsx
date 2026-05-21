import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/home/Home.jsx";
import Registro from "./pages/registro/Registro.jsx";
import Login from "./pages/login/Login.jsx";
import Catalogo from "./pages/catalogo/Catalogo.jsx";
import DetallePelicula from "./pages/detallePelicula/DetallePelicula.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import PrivateAdminRoute from "./components/PrivateAdminRoute.jsx";
import Favoritos from './pages/favoritos/Favoritos';
import MisAlquileres from './pages/misAlquileres/MisAlquileres';
import GestionPeliculas from "./pages/dashboard/GestionPeliculas.jsx";

import ClickSpark from './components/ClickSpark';
import LightRays from './components/LightRays.jsx';

import Chat from './pages/chat/Chat.jsx';
import ChatAdmin from './pages/dashboard/ChatAdmin.jsx';

import GestionUsuarios from "./pages/dashboard/GestionUsuarios.jsx";
import EstadisticasPeliculas from "./pages/dashboard/EstadisticasPeliculas.jsx";

import GestionAlquileres from "./pages/dashboard/GestionAlquileres.jsx";

function App() {
  return (
    <>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />

        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>

          <ClickSpark
            sparkColor="#ffffff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            < AuthProvider >
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Registro />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="/pelicula/:id" element={<DetallePelicula />} />

                  <Route path="/favoritos" element={<Favoritos />} />
                  <Route path="/mis-alquileres" element={<MisAlquileres />} />

                  <Route path="/ayuda" element={<Chat />} />

                  {/*Rutas protegidas para el admin*/}

                  {/* El Menú Principal del Dashboard */}
                  <Route path="/dashboard" element={
                    <PrivateAdminRoute>
                      <Dashboard />
                    </PrivateAdminRoute>
                  } />

                  {/* Panel para gestionar películas */}
                  <Route path="/dashboard/peliculas" element={
                    <PrivateAdminRoute>
                      <GestionPeliculas />
                    </PrivateAdminRoute>
                  } />

                  {/*-------panel de chat */}
                  <Route path="/dashboard/chat" element={
                    <PrivateAdminRoute>
                      <ChatAdmin />
                    </PrivateAdminRoute>
                  } />

                  <Route path="/dashboard/usuarios" element={
                    <PrivateAdminRoute>
                      <GestionUsuarios />
                    </PrivateAdminRoute>
                  } />

                  <Route path="/dashboard/alquileres" element={<PrivateAdminRoute>
                    <GestionAlquileres />
                  </PrivateAdminRoute>
                  } />

                  <Route path="/dashboard/estadisticas" element={<PrivateAdminRoute>
                    <EstadisticasPeliculas />
                  </PrivateAdminRoute>
                  } />
                </Routes>
              </Layout>
            </AuthProvider >
          </ClickSpark >
        </div>
      </div>
    </>
  );
}

export default App;
