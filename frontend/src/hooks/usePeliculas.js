import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPeliculas } from '../api/peliculasApi';

const usePeliculas = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || '';
  const pageFromUrl = parseInt(searchParams.get('page') || '0', 10);
  const page = Number.isNaN(pageFromUrl) ? 0 : pageFromUrl;

  const [peliculas, setPeliculas] = useState([]);
  const [size] = useState(16);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setPage = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', String(newPage));
    navigate(`/catalogo?${params.toString()}`);
  };

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPeliculas(page, size, search, genre);

        setPeliculas(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        setError(err.message || 'Error desconocido al cargar las películas ;v');
      } finally {
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, [page, size, search, genre]);

  return {
    peliculas,
    loading,
    error,
    page,
    setPage,
    size,
    totalPages,
    totalElements,
    search,
    genre
  };
};

export default usePeliculas;