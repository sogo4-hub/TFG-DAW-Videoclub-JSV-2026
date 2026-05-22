import React, { useEffect, useState } from 'react';

function EstadisticasPeliculas() {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Recuperamos el token de forma segura desde el sessionStorage
        const savedAuth = sessionStorage.getItem('auth');
        const authObj = savedAuth ? JSON.parse(savedAuth) : null;
        const token = authObj ? authObj.token : null;

        if (!token) {
            setError("No se encontró el token de autenticación. Inicia sesión de nuevo.");
            setLoading(false);
            return;
        }


        fetch('http://localhost:8080/api/admin/estadisticas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error en el servidor: ${res.status} (¿Eres ADMIN?)`);
                }
                return res.json();
            })
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                setError(`Error de conexión: ${err.message}`);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Cargando estadísticas del catálogo...</div>;
    if (error) return <div style={{ color: '#ff4b5c', padding: '20px', fontWeight: 'bold' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', color: '#fff', background: 'rgba(0,0,0,0.6)', borderRadius: '8px' }}>
            <h2>Rendimiento del Catálogo</h2>
            <p style={{ textAlign: 'center' }}>Métricas de uso cruzando tu Base de Datos H2 y la API de TMDB.</p>

            {stats.length === 0 ? (
                <p style={{ color: '#aaa', marginTop: '20px', textAlign: 'center' }}>No hay datos estadísticos disponibles en este momento.</p>
            ) : (

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #fff', color: '#ccc' }}>
                            <th style={{ padding: '12px' }}>ID H2 (Local)</th>
                            <th style={{ padding: '12px' }}>ID TMDB (Externo)</th>
                            <th style={{ padding: '12px' }}>Película</th>
                            <th style={{ padding: '12px' }}>En Favoritos</th>
                            <th style={{ padding: '12px' }}>Veces Alquilada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((movie) => (
                            <tr key={movie.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <td style={{ padding: '12px', color: '#aaa' }}>{movie.id}</td>
                                <td style={{ padding: '12px', color: '#ff3b3b' }}>{movie.tmdbId}</td>
                                <td style={{ padding: '12px' }}>{movie.titulo}</td>
                                <td style={{ padding: '12px', color: '#7b1fa2' }}>{movie.totalFavoritos} veces</td>
                                <td style={{ padding: '12px', color: '#28a745' }}>{movie.totalAlquileres} alquileres</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default EstadisticasPeliculas;