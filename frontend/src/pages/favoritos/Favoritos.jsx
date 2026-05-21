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
  const { token } = useAuth(); //---del context q guarda el estado del user
  const isLogged = !!token; //---se pasa a booleano

  const handleAlquilarExito = (peliculaId) => {
    setAlquiladas(prev => [...prev, peliculaId]);
  };

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        setLoading(true);
        const data = await getFavoritos();
        const alquileres = await getMisAlquileres(); //----añadido para q se carguen los alquileres
        setPeliculas(data);
        // El id de la pelicula esta en a.pelicula.id por la estructura del AlquilerResponseDTO
        const idsAlquiladas = alquileres.map(a => a.pelicula?.id ?? a.id); //--pilla los ids
        setAlquiladas(idsAlquiladas);//--guardar los ids
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
            initialFavorito={true}
            yaAlquilada={alquiladas.includes(pelicula.id)} //----bug arrelagito de comprobar si está alquilada
            onAlquilar={handleAlquilarExito}//--cambiar si esta alquilada o no
          />
        ))}
      </div>
    </div>
  );
};

export default Favoritos;