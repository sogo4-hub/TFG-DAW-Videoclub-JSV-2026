import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/home/Home.jsx";
import Registro from "./pages/registro/Registro.jsx";
import Login from "./pages/login/Login.jsx";
import Catalogo from "./pages/catalogo/Catalogo.jsx";
import DetallePelicula from "./pages/detallePelicula/DetallePelicula.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/pelicula/:id" element={<DetallePelicula />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
