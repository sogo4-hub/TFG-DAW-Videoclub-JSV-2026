import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import Registro from './pages/registro/Registro.jsx'
import Login from './pages/login/Login.jsx'
import NavBar from './components/navbar/NavBar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Footer from './components/footer/Footer.jsx'
import Catalogo from './pages/catalogo/Catalogo.jsx'
import DetallePelicula from './pages/detallePelicula/DetallePelicula.jsx'

function App() {
  return (
    <AuthProvider>
        <NavBar />
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/pelicula/:id" element={<DetallePelicula />} />
          </Routes>
        </main>
        <Footer />
    </AuthProvider>
  )
}

export default App
