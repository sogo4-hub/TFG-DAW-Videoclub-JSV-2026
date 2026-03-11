import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './NavBar.css'

const NavBar = () => {
  const { token, rol, nombre, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() //---para ver en qué link está

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const getHomeLink = () => ({
    to: '/',
    isActive: location.pathname === '/'
  })

  const isAdmin = token && rol === 'ADMIN'
  const isAdminInDashboardArea = location.pathname.startsWith('/adminnavbar')

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* users públicos: */}
        {/* clic a logo o inicio, va a / (home.jsx, y se muestra siempre el navbar.jsx*/}
        <Link
          to={getHomeLink().to}
          className={`navbar-logo-link ${getHomeLink().isActive ? 'active' : ''}`}
        >
          <img src="../public/imgs/logo.png" className="navbar-logo" />
        </Link>

        <Link
          to={getHomeLink().to}
          className={`nav-link ${getHomeLink().isActive ? 'active' : ''}`}
        >
          Inicio
        </Link>

        <Link to="/catalogo" className={`nav-link ${location.pathname === '/catalogo' ? 'active' : ''}`}>
          Catálogo
        </Link>

        {/* users logueados: */}
        {token && (
          <>
            <Link to="/mis-alquileres" className={`nav-link ${location.pathname === '/mis-alquileres' ? 'active' : ''}`}>
              Mis Alquileres
            </Link>
            <Link to="/favoritos" className={`nav-link ${location.pathname === '/favoritos' ? 'active' : ''}`}>
              Favoritos
            </Link>
          </>
        )}

        {/* Dashboard --solo para admin */}
        {isAdmin && (
          <Link
            to="/adminnavbar"
            className={`nav-link ${isAdminInDashboardArea ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        )}

        <div className="navbar-spacer"></div>

        {token && (
          <div className="navbar-user">
            {/* por si le pasamos nombre.......*/}
            <span className="user-name">{nombre || rol}</span>
            <button onClick={handleLogout} className="nav-logout">
              Cerrar Sesión
            </button>
          </div>
        )}

        {!token && (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              Iniciar Sesión
            </Link>
            <Link to="/registro" className={`nav-link ${location.pathname === '/registro' ? 'active' : ''}`}>
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}


export default NavBar
