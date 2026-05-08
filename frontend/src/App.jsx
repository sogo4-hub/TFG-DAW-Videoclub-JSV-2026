import { Routes, Route } from "react-router-dom";
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



function App() {
  return (
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

            <Route path="/usuarios" element={<div>Panel de Gestión de Usuarios</div>} />
            <Route path="/stats" element={<div>Panel de Estadísticas</div>} />

          </Routes>
        </Layout>
      </AuthProvider >
    </ClickSpark >

  );
}

export default App;
