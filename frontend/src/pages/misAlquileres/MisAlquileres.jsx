import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../../api/peliculasApi';
import { getMisAlquileres, cancelarAlquiler, marcarReproducida } from '../../api/alquileresApi';
import { useAuth } from '../../context/AuthContext.jsx';
import './MisAlquileres.css';

const MisAlquileres = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authData = useAuth();

  const [peliculaAValorar, setPeliculaAValorar] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [calificacionesLocales, setCalificacionesLocales] = useState({});
  const [hoverCalificacion, setHoverCalificacion] = useState(0.0);

  const valoresEstrellas = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

  useEffect(() => {
    const cargarMisValoraciones = async () => {
      try {
        let token = authData?.token || localStorage.getItem('token');
        if (token && token.startsWith('"')) token = token.slice(1, -1);

        const response = await fetch('http://localhost:8080/api/calificaciones/mis-valoraciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          
          console.log("VALORACIONES:");
          console.log(JSON.stringify(data, null, 2));
          
          const objetoValoraciones = {};

          data.forEach(item => {
objetoValoraciones[item.id.peliculaId] = item.nota;
          });

          setCalificacionesLocales(objetoValoraciones);
        }
      } catch (err) {
        console.error("No se pudieron cargar las valoraciones previas", err);
      }
    };
    console.log("TOKEN:", authData?.token);
if (authData?.token || localStorage.getItem('token')) {
  cargarMisValoraciones();
}  }, [authData]);

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        setLoading(true);
        const data = await getMisAlquileres();
        const aplanados = data.map(item => ({
          ...item.pelicula,
          reproducida: item.reproducida,
        }));
        setAlquileres(aplanados);
      } catch (err) {
        setError(err.message || 'Error al cargar tus alquileres');
      } finally {
        setLoading(false);
      }
    };
    fetchAlquileres();
  }, []);

  const handleCancelar = async (alquiler) => {
    try {
      await cancelarAlquiler(alquiler.id);
      setAlquileres(prev => prev.filter(a => a.id !== alquiler.id));
    } catch (err) {
      alert('Error al cancelar el alquiler: ' + err.message);
    }
  };

  const handleVerPelicula = async (alquiler) => {
    try {
      await marcarReproducida(alquiler.id);
      setAlquileres(prev => prev.map(a => a.id === alquiler.id ? { ...a, reproducida: true } : a));
    } catch (err) {
      console.error('Error al marcar como reproducida:', err);
    }
    navigate(`/pelicula/${alquiler.id}`, { state: { pelicula: alquiler } });
  };

  const handleGuardarCalificacion = async (peliculaId, valorNota) => {
    let token = authData?.token || localStorage.getItem('token');
    if (token && token.startsWith('"')) token = token.slice(1, -1);

    const payload = { peliculaId: Number(peliculaId), nota: Number(valorNota) };

    try {
      const response = await fetch('http://localhost:8080/api/calificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setCalificacionesLocales(prev => ({ ...prev, [peliculaId]: valorNota }));
        setPeliculaAValorar(null);
        alert('¡Gracias por calificar la película!');
      } else {
        alert('Error al guardar: ' + await response.text());
      }
    } catch (error) {
      alert('Error de red al intentar guardar.');
    }
  };

  if (loading) return <p className="cargandoAlquileres">Cargando tus alquileres...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!alquileres.length) return <p className="sinAlquileres">Aún no has alquilado nada</p>;

  return (
    <div className="alquileres-container">
      <h1 className="alquileres-title">Mis alquileres</h1>
      <div className="peliculas-grid">
        {alquileres.map((alquiler) => {
          const isDesplegado = peliculaAValorar === alquiler.id;
          const valoracionActual = calificacionesLocales[alquiler.id];
          const yaValorado = Number(valoracionActual) > 0;
          return (
            <div key={alquiler.id} className="alquiler-card">
              <img src={getMediaUrl(alquiler.urlImagen, 'w500')} className="alquiler-imagen" alt={alquiler.titulo} />
              <h3 className="alquiler-titulo">{alquiler.titulo}</h3>
              <p className="alquiler-meta">{alquiler.director} · {alquiler.anio}</p>
              <p className="alquiler-genero">{alquiler.genero}</p>

              <button type="button" className="alquiler-boton" onClick={() => handleVerPelicula(alquiler)} disabled={!alquiler.urlVideo}>
                {alquiler.urlVideo ? 'Ver película' : 'Vídeo no disponible'}
              </button>

              {/* BOTÓN VALORAR SOLO SI YA LA VIO */}
              {alquiler.reproducida && (
                <button
                  type="button"
                  className="alquiler-boton btn-valorar-toggle"
                  onClick={() => {
                    if (yaValorado) {
                      if (modoEdicion === alquiler.id) {
                        // cancelar edición
                        setModoEdicion(null);
                        setPeliculaAValorar(null);
                      } else {
                        // activar edición
                        setModoEdicion(alquiler.id);
                        setPeliculaAValorar(alquiler.id);
                      }
                    } else {
                      // primera valoración
                      setPeliculaAValorar(
                        isDesplegado ? null : alquiler.id
                      );
                    }
                  }}
                  style={{
                    backgroundColor: isDesplegado ? '#dc3545' : '#28a745',
                    marginTop: '6px'
                  }}
                >
                  {yaValorado
                    ? (modoEdicion === alquiler.id
                      ? 'Cancelar edición'
                      : 'Editar valoración')
                    : (isDesplegado
                      ? 'Cancelar voto'
                      : 'Valorar película')}
                </button>
              )}

              {/* SECCIÓN ESTRELLAS */}
              {isDesplegado && (!yaValorado || modoEdicion === alquiler.id) && (<div
                className="seccion-calificar-directa"
                style={{ marginTop: '10px', textAlign: 'center' }}
              >
                <div
                  className="stars-react"
                  onMouseLeave={() => {
                    if (!yaValorado || modoEdicion === alquiler.id) {
                      setHoverCalificacion(0.0);
                    }
                  }}                  >
                  {valoresEstrellas.map((valor, index) => {
                    const activa =
                      hoverCalificacion >= valor ||
                      (!hoverCalificacion && valoracionActual >= valor);

                    return (
                      <span
                        key={valor}
                        className={`star-half-react ${index % 2 === 0 ? 'left' : 'right'
                          } ${activa ? 'active' : ''}`}
                        onMouseEnter={() => {
                          if (!yaValorado || modoEdicion === alquiler.id) {
                            setHoverCalificacion(valor);
                          }
                        }}
                        onClick={() => {
                          if (!yaValorado || modoEdicion === alquiler.id) {
                            handleGuardarCalificacion(alquiler.id, valor);
                            setModoEdicion(null);
                          }
                        }}
                      ></span>
                    );
                  })}
                </div>

                <span
                  className="nota-numerica-directa"
                  style={{ display: 'block', color: '#ffc107' }}
                >
                  {(hoverCalificacion || valoracionActual || 0).toFixed(1)} / 5.0
                </span>
              </div>
              )}
              {yaValorado && (
                <p style={{ color: '#ffc107', marginTop: '5px' }}>
                  Tu valoración:
                  <strong> {valoracionActual} / 5.0</strong>
                </p>
              )}

              {!alquiler.reproducida && (
                <button type="button" className="alquiler-boton-cancelar" onClick={() => handleCancelar(alquiler)}>Cancelar alquiler</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MisAlquileres;