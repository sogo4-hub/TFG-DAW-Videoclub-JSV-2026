//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Registro from './pages/registro/Registro.jsx'
import Login from './pages/login/Login.jsx'
import NavBar from './components/NavBar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Registro />} />

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
