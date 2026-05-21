import { useState } from 'react';
import { getMediaUrl } from '../../api/peliculasApi';
import { toggleFavorito } from '../../api/favoritosApi';
import { crearAlquiler } from '../../api/alquileresApi';
import './PeliculaCard.css';

const PeliculaCard = ({ pelicula, isLogged, rol, initialFavorito = false, yaAlquilada = false, onAlquilar }) => {
  const [isFavorito, setIsFavorito] = useState(initialFavorito);
  const [loading, setLoading] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);

  const [verMas, setVerMas] = useState(false);

  const [datosTarjeta, setDatosTarjeta] = useState({
    nombre: '',
    numero: '',
    fecha: '',
    cvv: '',
  });
  const [errorPago, setErrorPago] = useState('');

  const precioAlquiler = pelicula?.precio ?? 2.99;
  const precioFormateado = `${Number(precioAlquiler).toFixed(2).replace('.', ',')} €`;

  const esAdmin = rol === 'ADMIN'; // <-- NUEVO

  const handleToggleFavorito = async (e) => {
    e.stopPropagation();
    if (loading) return;
    try {
      setLoading(true);
      await toggleFavorito(pelicula.id);
      setIsFavorito(prev => !prev);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
      alert('Error al cambiar favorito');
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirFormulario = (e) => {
    e.stopPropagation();
    if (loading || yaAlquilada) return;

    setErrorPago('');
    setDatosTarjeta({
      nombre: '',
      numero: '',
      fecha: '',
      cvv: '',
    });
    setMostrarPago(true);
  };

  const handleConfirmarPago = async (e) => {
    e.preventDefault();

    if (!datosTarjeta.nombre.trim()) {
      setErrorPago('Introduce el nombre del titular.');
      return;
    }

    if (datosTarjeta.numero.replace(/\s/g, '').length !== 16) {
      setErrorPago('El número de tarjeta debe tener 16 dígitos.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(datosTarjeta.fecha)) {
      setErrorPago('Formato de fecha inválido (MM/AA).');
      return;
    }

    if (datosTarjeta.cvv.length !== 3) {
      setErrorPago('El CVV debe tener 3 dígitos.');
      return;
    }

    try {
      setLoading(true);
      await crearAlquiler(pelicula.id);
      setMostrarPago(false);
      alert(`'${pelicula.titulo}' alquilada correctamente por ${precioFormateado}. ¡Disfrútala durante 48 horas!`);
      onAlquilar?.(pelicula.id);
    } catch (error) {
      console.error('Error al alquilar:', error);
      setErrorPago('Error al procesar el alquiler. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNumeroTarjeta = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formateado = valor.match(/.{1,4}/g)?.join(' ') || '';

    setDatosTarjeta(prev => ({
      ...prev,
      numero: formateado,
    }));
  };

  const handleFechaCaducidad = (e) => {
    const valor = e.target.value.replace(/\D/g, '').slice(0, 4);

    let formateado = valor;
    if (valor.length >= 3) {
      formateado = `${valor.slice(0, 2)}/${valor.slice(2)}`;
    }

    setDatosTarjeta(prev => ({
      ...prev,
      fecha: formateado,
    }));
  };

  // urlImagen puede ser ruta relativa TMDB (/xxx.jpg) o interna (/api/media/...)
  const posterUrl = getMediaUrl(pelicula.urlImagen, 'w500');
  const sinopsisTexto = pelicula.sinopsis || 'Sinopsis no disponible';
  const limiteCaracteres = 110;
  const esTextoLargo = sinopsisTexto.length > limiteCaracteres;

  const textoAMostrar = verMas || !esTextoLargo 
    ? sinopsisTexto 
    : `${sinopsisTexto.slice(0, limiteCaracteres)}...`;

  return (
    <>
      <div className="pelicula-card">
        <img src="/imgs/masking-tape2.jpg" className='tape-film'></img>

        <img
          src={posterUrl}
          alt={pelicula.titulo}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x450/cccccc/666666?text=Sin+imagen';
          }}
          className="pelicula-imagen"
        />

        <h3 className="pelicula-titulo">{pelicula.titulo}</h3>

        <div className="pelicula-info">
          <p className="pelicula-meta">
            <strong>{pelicula.director}</strong> · {pelicula.anio}
          </p>
          <p className="pelicula-genero">{pelicula.genero}</p>
        </div>

        <p className="pelicula-sinopsis">
          {textoAMostrar}
          {esTextoLargo && (
            <button 
              type="button" 
              className="btn-ver-mas" 
              onClick={() => setVerMas(!verMas)}
            >
              {verMas ? ' Ver menos' : ' Ver más'}
            </button>
          )}
        </p>

        {/* Botones solo para usuarios logueados que NO sean ADMIN */}
        {isLogged && !esAdmin && (
          <div className="pelicula-botones">
            <button
              className={`btn-favorito ${isFavorito ? 'btn-favorito-activo' : ''} ${loading ? 'btn-loading' : ''}`}
              onClick={handleToggleFavorito}
              disabled={loading}
            >
              {loading ? '...' : isFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </button>

            <button
              className={`btn-alquilar ${yaAlquilada ? 'btn-alquilada' : ''} ${loading ? 'btn-loading' : ''}`}
              onClick={handleAbrirFormulario}
              disabled={loading || yaAlquilada}
            >
              {yaAlquilada ? 'Ya alquilada' : loading ? 'Alquilando...' : `Alquilar (${precioFormateado})`}
            </button>
          </div>
        )}

        {/* Aviso solo para visitantes sin sesión */}
        {!isLogged && (
          <div className="pelicula-no-logged">
            <p>Inicie sesión para alquilar.</p>
          </div>
        )}
      </div>

      {mostrarPago && (
        <div className="pago-overlay" onClick={() => setMostrarPago(false)}>
          <div className="pago-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pago-cerrar" onClick={() => setMostrarPago(false)}>✕</button>

            <h2 className="pago-titulo">Pago seguro</h2>
            <p className="pago-subtitulo">
              Alquilando: <strong>{pelicula.titulo}</strong>
            </p>
            <p className="pago-precio">
              Precio: <strong>{precioFormateado}</strong> · 48 horas de acceso
            </p>

            <form className="pago-form" onSubmit={handleConfirmarPago}>
              <div className="pago-campo">
                <label>Titular de la tarjeta</label>
                <input
                  type="text"
                  placeholder="Nombre Apellido"
                  value={datosTarjeta.nombre}
                  onChange={(e) =>
                    setDatosTarjeta(prev => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="pago-campo">
                <label>Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={datosTarjeta.numero}
                  onChange={handleNumeroTarjeta}
                  maxLength={19}
                />
              </div>

              <div className="pago-fila">
                <div className="pago-campo">
                  <label>Fecha de caducidad</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={datosTarjeta.fecha}
                    maxLength={5}
                    onChange={handleFechaCaducidad}
                  />
                </div>

                <div className="pago-campo">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={datosTarjeta.cvv}
                    maxLength={3}
                    onChange={(e) =>
                      setDatosTarjeta(prev => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                  />
                </div>
              </div>

              {errorPago && <p className="pago-error">{errorPago}</p>}

              <button
                type="submit"
                className="pago-btn-confirmar"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar pago'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PeliculaCard;