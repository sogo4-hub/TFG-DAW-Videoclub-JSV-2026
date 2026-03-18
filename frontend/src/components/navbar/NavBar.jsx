
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
    <>
      <nav className="navbar">

        {/* IZQUIERDA: LOGO + TEXTO */}
        <div className="navbar-left">
          <img src="/imgs/logo.png" alt="StreamFlix Logo" className="navbar-logo" />
          <h3 className="navbar-title">StreamFlix</h3>
        </div>

        <div className="navbar-links">
          {/*pags públicass */}
          {!token && (
            <>
              <Link to="/">Inicio</Link>
              <Link to="/catalogo">Catálogo</Link>
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
              <Link to="/dashboard">Dashboard</Link>
              {/* <Link to="/admin/catalogo">Gestión de catálogo</Link>
              <Link to="/admin/usuarios">Gestión de usuarios</Link>
              <Link to="/admin/estadisticas">Estadísticas</Link> */}
            </>
          )}



          {/* DERECHA: BUSCADOR ---público*/}
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Buscar..."
              aria-label="Buscar en StreamFlix" />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          {/*pags públicass */}
          {!token && (
            <><Link to="/login">Iniciar Sesión</Link>
              <Link to="/registro">Registro</Link></>
          )}
        </div>



        <div className="navbar-user">
          {/*el user logueado*/}
          {token && (
            <div className="user-menu">
              <span>{nombre || rol}</span>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>



      </nav><img src="/imgs/masking-tape.png" className='tape-navbar'></img></>

  )
}



export default NavBar

