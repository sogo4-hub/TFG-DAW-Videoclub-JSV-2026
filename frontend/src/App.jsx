// App.jsx - VERSIÓN SEGURA (copia esto)
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Registro from './pages/registro/Registro.jsx'
import Login from './pages/login/Login.jsx'
import NavBar from './components/navbar/NavBar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
