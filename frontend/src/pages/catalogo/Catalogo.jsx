import { useEffect, useState } from 'react';
import usePeliculas from '../../hooks/usePeliculas';
import PeliculaCard from '../../components/peliculaCard/PeliculaCard';
import { getMisAlquileres } from '../../api/alquileresApi';
import { getFavoritos } from '../../api/favoritosApi';
import { useAuth } from '../../context/AuthContext';
import './Catalogo.css';

const Catalogo = () => {
  const { loading, error, peliculas, page, setPage, totalPages, totalElements } = usePeliculas();
  const { token } = useAuth();
  const isLogged = !!token;

  const [alquiladas, setAlquiladas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);

  const handleAlquilarExito = (peliculaId) => {
    setAlquiladas(prev => [...prev, peliculaId]);
  };



  useEffect(() => {
    if (!isLogged) return;

    const fetchDatos = async () => {
      try {
        const alquileres = await getMisAlquileres();
        const favs = await getFavoritos();

        const idsAlquiladas = alquileres.map(a => a.pelicula?.id ?? a.id);
        const idsFavoritas = favs.map(f => f.id);

        setAlquiladas(idsAlquiladas);
        setFavoritas(idsFavoritas);
      } catch (err) {
        console.log('Error al cargar los datos del usuario.....', err);
      }
    };

    fetchDatos();
  }, [isLogged]);

  if (loading) return <p className="catalogo-loading">Cargando catálogo...</p>;

  if (error) {
    return (
      <div className="catalogo-error">
        <p>Error al cargar el catálogo ;V</p>
      </div>
    );
  }

  return (
    <div className="catalogo-container">
      <h1 className="catalogo-titulo">Catálogo de películas</h1>

      {peliculas.length === 0 ? (
        <p className="catalogo-vacio">
          No se encontraron películas con esos filtros.
        </p>
      ) : (
        <div className="catalogo-grid">
          {peliculas.map((pelicula) => (
            <PeliculaCard
              key={`${pelicula.id}-${favoritas.includes(pelicula.id)}-${alquiladas.includes(pelicula.id)}`}
              pelicula={pelicula}
              isLogged={isLogged}
              yaAlquilada={alquiladas.includes(pelicula.id)}
              initialFavorito={favoritas.includes(pelicula.id)}
              onAlquilar={handleAlquilarExito}
            />
          ))}
        </div>
      )}

      <div className="catalogo-paginacion">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Anterior
        </button>

        <span>
          Página {totalPages === 0 ? 0 : page + 1} de {totalPages} · {totalElements} resultados
        </span>

        <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Catalogo;