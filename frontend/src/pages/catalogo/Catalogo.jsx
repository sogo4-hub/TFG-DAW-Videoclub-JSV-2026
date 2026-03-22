import { useEffect, useState } from 'react';
import usePeliculas from '../../hooks/usePeliculas';
import PeliculaCard from '../../components/peliculaCard/PeliculaCard';
import { getMisAlquileres } from '../../api/alquileresApi';
import { getFavoritos } from '../../api/favoritosApi';
import { useAuth } from '../../context/AuthContext';
import './Catalogo.css';

const Catalogo = () => {
  const { loading, error, peliculas } = usePeliculas();
  const { token } = useAuth();
  const isLogged = !!token;
  const [alquiladas, setAlquiladas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);

  useEffect(() => {
    if (!isLogged) return;

    const fetchDatos = async () => {
      try {
        const alquileres = await getMisAlquileres();
        const favs = await getFavoritos();

        const idsAlquiladas = alquileres.map(a => a.pelicula?.id || a.id);
        const idsFavoritas = favs.map(f => f.pelicula?.id || f.id);

        setAlquiladas(idsAlquiladas);
        setFavoritas(idsFavoritas);

      } catch (err) {
        console.log('Error al cargar los datos del usuario.....', err);
      }
    };
    fetchDatos();
  }, [isLogged]);


  if (loading) return <p className="catalogo-loading">Cargando catálogo...</p>;

  if (error)
    return (
      <div className="catalogo-error">
        <p>Error al cargar el catálogo ;V</p>
      </div>
    );

  return (
    <div className="catalogo-container">
      <h1 className="catalogo-titulo">Catálogo de películas</h1>
      <div className="catalogo-grid">
        {peliculas.map((pelicula) => (
          <PeliculaCard
            key={pelicula.id}
            pelicula={pelicula}
            isLogged={isLogged}
            yaAlquilada={alquiladas.includes(pelicula.id)}
            initialFavorito={favoritas.includes(pelicula.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Catalogo;