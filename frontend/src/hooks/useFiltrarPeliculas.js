import { useLocation } from 'react-router-dom'

const useFiltrarPeliculas = (peliculas) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search') || ''

  const peliculasFiltradas = peliculas.filter(p =>
    p.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return { peliculasFiltradas, searchQuery }
}

export default useFiltrarPeliculas