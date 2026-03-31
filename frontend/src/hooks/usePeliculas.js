import { useState, useEffect } from 'react';
import { getPeliculas } from '../api/peliculasApi';

const usePeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPeliculas();
        setPeliculas(data);
      } catch (err) {
        setError(err.message || 'Error desconocido al cargar las películas ;v');
      } finally {
        setLoading(false);
      }
    };

    fetchPeliculas();
  }, []);

  return { peliculas, loading, error };
};

export default usePeliculas;