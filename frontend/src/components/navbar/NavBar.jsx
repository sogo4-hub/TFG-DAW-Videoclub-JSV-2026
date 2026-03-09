import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './NavBar.css'

const NavBar = () => {
  const { token, rol, nombre, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }
  //-----

  return (
    <nav className="navbar">


      <div className="navbar-links">
        {/*pags públicass */}
        {!token && (
          <>
            <Link to="/">Inicio</Link>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/registro">Registro</Link>
          </>
        )}

        {/*users*/}
        {token && (
          <>
            <Link to="/">Inicio</Link>

            <Link to="/catalogo">Catálogo</Link>
            <Link to="/mis-alquileres">Mis Alquileres</Link>
            <Link to="/favoritos">Favoritos</Link>
          </>
        )}

        {/*admins ---tmb tienen lo de users*/}
        {token && rol === 'ADMIN' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/catalogo">Gestión de catálogo</Link>
            <Link to="/admin/usuarios">Gestión de usuarios</Link>
            <Link to="/admin/estadisticas">Estadísticas</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        {/*el user logueado*/}
        {token &&(
          <div className="user-menu">
            <span>{nombre || rol}</span>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar
