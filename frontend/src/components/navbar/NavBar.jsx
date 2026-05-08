import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './NavBar.css'
import useSearchBar from '../../hooks/useSearchBar'

const GENEROS = [
  'Drama', 'Romance', 'Aventura', 'Ciencia ficción',
  'Acción', 'Comedia', 'Terror', 'Suspense', 'Misterio', 'Western', 'Historia'
]

const NavBar = () => {
  const { token, rol, nombre, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { query, setQuery, handleSearch } = useSearchBar()
  const [desplegableAbierto, setDesplegableAbierto] = useState(false)
  const desplegableRef = useRef(null)

  const searchParams = new URLSearchParams(location.search)
  const generoActivo = searchParams.get('genre') || ''

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const handleGenero = (genero) => {
    const params = new URLSearchParams(location.search)
    if (generoActivo === genero) {
      // Si ya está activo, lo deselecciona
      params.delete('genre')
    } else {
      params.set('genre', genero)
    }
    setDesplegableAbierto(false)
    navigate(`/catalogo?${params.toString()}`)
  }

  // Cierra el desplegable si se hace clic fuera
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (desplegableRef.current && !desplegableRef.current.contains(e.target)) {
        setDesplegableAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const enCatalogo = location.pathname === '/catalogo'
  //-----

  return (
    <>
      <nav className="navbar">

        {/* IZQUIERDA: LOGO + TEXTO */}
        <div className="navbar-left">
          <img src="/imgs/logo.png" alt="StreamFlix Logo" className="navbar-logo" />
          <h3 className="navbar-title">StreamFlix</h3>
        </div>

        {/* CENTRO: LINKS + BUSCADOR + FILTRO */}
        <div className="navbar-links">
          {/*pags públicas */}
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

          {/* BUSCADOR ---público*/}
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Buscar en catálogo..."
              aria-label="Buscar en StreamFlix"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          {/* FILTRO DE GÉNEROS — solo visible en el catálogo */}
          {enCatalogo && (
            <div className="navbar-filtro" ref={desplegableRef}>
              <button
                className={`filtro-btn ${generoActivo ? 'filtro-btn-activo' : ''}`}
                onClick={() => setDesplegableAbierto(prev => !prev)}
              >
                {generoActivo || 'Filtrar'}
                <i className={`fa-solid fa-chevron-${desplegableAbierto ? 'up' : 'down'}`}></i>
              </button>

              {desplegableAbierto && (
                <div className="filtro-desplegable">
                  {/* Opción para quitar el filtro */}
                  {generoActivo && (
                    <button
                      className="filtro-opcion filtro-opcion-limpiar"
                      onClick={() => handleGenero(generoActivo)}
                    >
                      ✕ Quitar filtro
                    </button>
                  )}
                  {GENEROS.map(genero => (
                    <button
                      key={genero}
                      className={`filtro-opcion ${generoActivo === genero ? 'filtro-opcion-activa' : ''}`}
                      onClick={() => handleGenero(genero)}
                    >
                      {genero}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* DERECHA: LOGIN / REGISTRO / CERRAR SESIÓN — pegado a la derecha */}
        <div className="navbar-user">
          {/*pags públicas */}
          {!token && (
            <>
              <Link to="/login" className="navbar-auth-btn">Iniciar Sesión</Link>
              <Link to="/registro" className="navbar-auth-btn">Registro</Link>
            </>
          )}

          {/*el user logueado*/}
          {token && (
            <div className="user-menu">
              <span>{nombre || rol}</span>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>

      </nav>
      <img src="/imgs/masking-tape.png" className='tape-navbar'></img>
    </>
  )
}

export default NavBar