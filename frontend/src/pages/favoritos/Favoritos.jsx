import { useEffect, useState } from 'react';
import PeliculaCard from '../../components/peliculaCard/PeliculaCard';
import { getFavoritos } from '../../api/favoritosApi';
import { useAuth } from '../../context/AuthContext';
import './Favoritos.css';

const Favoritos = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); //---del context q guarda el estado del user
  const isLogged = !!token; //---se pasa a booleano

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        setLoading(true);
        const data = await getFavoritos();
        setPeliculas(data);
      } catch (err) {
        setError(err.message || 'Error al cargar favoritos ;(');
      } finally {
        setLoading(false);
      }
    };
    fetchFavoritos();
  }, []);

  if (loading) return <p>Cargando tus favoritos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!peliculas.length) return <p>Aún no tienes nada en favoritos.</p>;

  return (
    <div className="favoritos-container">
      <h1 className="favoritos-title">Mis favoritos</h1>
      <div className="peliculas-grid">
        {peliculas.map((pelicula) => (
          <PeliculaCard
            key={pelicula.id}
            pelicula={pelicula}
            isLogged={isLogged}
            initialFavorito={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Favoritos;