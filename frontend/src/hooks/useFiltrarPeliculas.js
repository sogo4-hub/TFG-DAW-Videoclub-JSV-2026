import { useLocation } from 'react-router-dom'

const useFiltrarPeliculas = (peliculas) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search') || ''
  const generoActivo = searchParams.get('genre') || ''

  const peliculasFiltradas = peliculas.filter(p => {

    const coincideTitulo = p.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    const coincideGenero = generoActivo
      ? p.genero?.toLowerCase().includes(generoActivo.toLowerCase())
      : true
    return coincideTitulo && coincideGenero
  })

  return { peliculasFiltradas, searchQuery, generoActivo }
}

export default useFiltrarPeliculas