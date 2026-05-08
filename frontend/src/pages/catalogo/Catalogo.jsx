import { useEffect, useState } from 'react';
import usePeliculas from '../../hooks/usePeliculas';
import PeliculaCard from '../../components/peliculaCard/PeliculaCard';
import { getMisAlquileres } from '../../api/alquileresApi';
import { getFavoritos } from '../../api/favoritosApi';
import { useAuth } from '../../context/AuthContext';
import useFiltrarPeliculas from '../../hooks/useFiltrarPeliculas';
import './Catalogo.css';

const Catalogo = () => {
  const { loading, error, peliculas } = usePeliculas();
  const { peliculasFiltradas, searchQuery, generoActivo } = useFiltrarPeliculas(peliculas);
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
        const idsAlquiladas = alquileres.map(a => a.id);
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
  if (error) return (
    <div className="catalogo-error">
      <p>Error al cargar el catálogo ;V</p>
    </div>
  );

    const sinResultadosDeGenero = generoActivo && peliculasFiltradas.length === 0;
  const peliculasAMostrar = sinResultadosDeGenero ? peliculas : peliculasFiltradas;


  return (
    <div className="catalogo-container">
      <h1 className="catalogo-titulo">Catálogo de películas</h1>
      {searchQuery && (
        <p className="catalogo-buscando">
          Resultados para: <strong>{searchQuery}</strong>
          {peliculasFiltradas.length === 0 && ' — No se encontraron resultados'}
        </p>
      )}

       {sinResultadosDeGenero && (
        <p className="catalogo-sin-genero">
          Wups no hay películas de <strong>{generoActivo}</strong> en el catálogo ahora mismo :v
        </p>
      )}

      
      
      <div className="catalogo-grid">
        {peliculasAMostrar.map((pelicula) => (
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
    </div>
  );
};

export default Catalogo;