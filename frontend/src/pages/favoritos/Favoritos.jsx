import { useEffect, useState } from 'react';
import PeliculaCard from '../../components/peliculaCard/PeliculaCard';
import { getFavoritos } from '../../api/favoritosApi';
import { getMisAlquileres } from '../../api/alquileresApi';
import { useAuth } from '../../context/AuthContext';
import './Favoritos.css';

const Favoritos = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [alquiladas, setAlquiladas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, rol } = useAuth(); // <-- añadido rol
  const isLogged = !!token;

  const handleAlquilarExito = (peliculaId) => {
    setAlquiladas(prev => [...prev, peliculaId]);
  };

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        setLoading(true);
        const data = await getFavoritos();
        const alquileres = await getMisAlquileres();
        setPeliculas(data);
        const idsAlquiladas = alquileres.map(a => a.pelicula?.id ?? a.id);
        setAlquiladas(idsAlquiladas);
      } catch (err) {
        setError(err.message || 'Error al cargar favoritos ;(');
      } finally {
        setLoading(false);
      }
    };
    fetchFavoritos();
  }, []);

  if (loading) return <p className="cargandoFavoritos">Cargando tus favoritos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!peliculas.length) return <p className="sinFavoritos">Aún no tienes nada en favoritos.</p>;

  return (
    <div className="favoritos-container">
      <h1 className="favoritos-title">Mis favoritos</h1>
      <div className="peliculas-grid">
        {peliculas.map((pelicula) => (
          <PeliculaCard
            key={`${pelicula.id}-${alquiladas.includes(pelicula.id)}`}
            pelicula={pelicula}
            isLogged={isLogged}
            rol={rol}
            initialFavorito={true}
            yaAlquilada={alquiladas.includes(pelicula.id)}
            onAlquilar={handleAlquilarExito}
          />
        ))}
      </div>
    </div>
  );
};

export default Favoritos;