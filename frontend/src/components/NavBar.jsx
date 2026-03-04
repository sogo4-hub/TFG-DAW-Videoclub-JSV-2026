import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NavBar.css'

const NavBar = () => {
  const { token, rol, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">StreamFlix</Link>
      </div>

      <div className="navbar-links">
        {/*pags públicas */}
        {!token && (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/registro">Registro</Link>
          </>
        )}

        {/*login */}
        {token && (
          <>
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/mis-alquileres">Mis Alquileres</Link>
            <Link to="/favoritos">Favoritos</Link>
          </>
        )}

        {/*admins*/}
        {token && rol === 'ADMIN' && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/catalogo">Catálogo Admin</Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        {/*el user logueado*/}
        {token ? (
          <div className="user-menu">
            <span>{rol}</span>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        ) : (
          /*user público*/
          <Link to="/login">Entrar</Link>
        )}
      </div>
    </nav>
  )
}

export default NavBar
