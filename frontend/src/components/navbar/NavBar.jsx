import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './NavBar.css'
import useSearchBar from '../../hooks/useSearchBar'

const GENEROS = [
  'Drama', 'Romance', 'Aventura', 'Ciencia ficción',
  'Acción', 'Comedia', 'Terror', 'Suspense', 'Misterio', 'Western', 'Historia', 'Fantasía'
]

const ORDENACION = [
  { label: 'Título A-Z', value: 'titulo,asc' },
  { label: 'Título Z-A', value: 'titulo,desc' },
  { label: 'Año más reciente', value: 'anio,desc' },
  { label: 'Año más antiguo', value: 'anio,asc' },
]

const NavBar = () => {
  const { token, rol, nombre, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { query, setQuery, handleSearch } = useSearchBar()
  const [desplegableAbierto, setDesplegableAbierto] = useState(false)
  const [ordenAbierto, setOrdenAbierto] = useState(false)
  const desplegableRef = useRef(null)
  const ordenRef = useRef(null)

  const searchParams = new URLSearchParams(location.search)
  const generoActivo = searchParams.get('genre') || ''
  const sortActivo = searchParams.get('sort') || ''

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const handleGenero = (genero) => {
    const params = new URLSearchParams(location.search)
    if (generoActivo === genero) {
      params.delete('genre')
    } else {
      params.set('genre', genero)
    }
    params.set('page', '0')
    setDesplegableAbierto(false)
    navigate(`/catalogo?${params.toString()}`)
  }

  const handleOrden = (valor) => {
    const params = new URLSearchParams(location.search)
    if (sortActivo === valor) {
      params.delete('sort')
    } else {
      params.set('sort', valor)
    }
    params.set('page', '0')
    setOrdenAbierto(false)
    navigate(`/catalogo?${params.toString()}`)
  }

  const labelOrdenActivo = ORDENACION.find(o => o.value === sortActivo)?.label || 'Ordenar'

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (desplegableRef.current && !desplegableRef.current.contains(e.target)) {
        setDesplegableAbierto(false)
      }
      if (ordenRef.current && !ordenRef.current.contains(e.target)) {
        setOrdenAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const enCatalogo = location.pathname === '/catalogo'

  return (
    <>
      <nav className="navbar">

        {/* 1. IZQUIERDA: LOGO + TEXTO */}
        <div className="navbar-left">
          <img src="/imgs/logo.png" alt="StreamFlix Logo" className="navbar-logo" />
          <h3 className="navbar-title">StreamFlix</h3>
        </div>

        {/* 2. ENLACES DE NAVEGACIÓN PRINCIPALES */}
        <div className="navbar-links">
          {!token && (
            <>
              <Link to="/">Inicio</Link>
              <Link to="/catalogo">Catálogo</Link>
            </>
          )}

          {token && (
            <>
              <Link to="/">Inicio</Link>
              <Link to="/catalogo">Catálogo</Link>
              {rol !== 'ADMIN' && <Link to="/mis-alquileres">Mis Alquileres</Link>}
              {rol !== 'ADMIN' && <Link to="/favoritos">Favoritos</Link>}
            </>
          )}

          {token && rol === 'ADMIN' && (
            <Link to="/dashboard">Dashboard</Link>
          )}
        </div>

        {/* 3. BUSCADOR (Separado de los links para poder moverlo dinámicamente) */}
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

        {/* 4. FILTROS (Filtro + Ordenar - Agrupados en una sola caja) */}
        {enCatalogo && (
          <div className="navbar-filtros-container">
            {/* FILTRO DE GÉNEROS */}
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

            {/* ORDENAR */}
            <div className="navbar-filtro" ref={ordenRef}>
              <button
                className={`filtro-btn ${sortActivo ? 'filtro-btn-activo' : ''}`}
                onClick={() => setOrdenAbierto(prev => !prev)}
              >
                {labelOrdenActivo}
                <i className={`fa-solid fa-chevron-${ordenAbierto ? 'up' : 'down'}`}></i>
              </button>

              {ordenAbierto && (
                <div className="filtro-desplegable">
                  {sortActivo && (
                    <button
                      className="filtro-opcion filtro-opcion-limpiar"
                      onClick={() => handleOrden(sortActivo)}
                    >
                      ✕ Quitar orden
                    </button>
                  )}
                  {ORDENACION.map(opcion => (
                    <button
                      key={opcion.value}
                      className={`filtro-opcion ${sortActivo === opcion.value ? 'filtro-opcion-activa' : ''}`}
                      onClick={() => handleOrden(opcion.value)}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. DERECHA: LOGIN / REGISTRO / CERRAR SESIÓN */}
        <div className="navbar-user">
          {!token && (
            <>
              <Link to="/login" className="navbar-auth-btn">Iniciar Sesión</Link>
              <Link to="/registro" className="navbar-auth-btn">Registro</Link>
            </>
          )}

          {token && (
            <div className="user-menu">
              <span>
                {/* {nombre || rol} */}
                {rol === 'ADMIN' ? 'ADMIN' : nombre}
              </span>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>

      </nav>
    </>
  )
}

export default NavBar;