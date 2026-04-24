import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const useSearch = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (query.trim()) {
        navigate(`/catalogo?search=${encodeURIComponent(query.trim())}`)
      } else {
        //búsqueda vacía, muestra todo el catálogo
        navigate('/catalogo')
      }
    }
  }

  return { query, setQuery, handleSearch }
}

export default useSearch