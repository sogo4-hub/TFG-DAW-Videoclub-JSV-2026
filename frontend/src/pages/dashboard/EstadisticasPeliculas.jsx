import React, { useEffect, useState } from 'react';

function EstadisticasPeliculas() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        // Aquí conectarás con tu API de estadísticas de la base de datos H2
        setStats([
            { h2Id: 101, tmdbId: 550, titulo: "Fight Club", favoritos: 45, alquilada: 120 },
            { h2Id: 102, tmdbId: 27205, titulo: "Inception", favoritos: 89, alquilada: 340 }
        ]);
    }, []);

    return (
        <div style={{ padding: '20px', color: '#fff', background: 'rgba(0,0,0,0.6)', borderRadius: '8px' }}>
            <h2>Rendimiento del Catálogo</h2>
            <p>Métricas de uso cruzando tu Base de Datos H2 y la API de TMDB.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #fff', color: '#ccc' }}>
                        <th style={{ padding: '12px' }}>ID H2 (Local)</th>
                        <th style={{ padding: '12px' }}>ID TMDB (Externo)</th>
                        <th style={{ padding: '12px' }}>Película</th>
                        <th style={{ padding: '12px' }}>❤️ En Favoritos</th>
                        <th style={{ padding: '12px' }}>🍿 Veces Alquilada</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((movie) => (
                        <tr key={movie.h2Id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '12px', color: '#aaa' }}>{movie.h2Id}</td>
                            <td style={{ padding: '12px', color: '#ff9900' }}>{movie.tmdbId}</td>
                            <td style={{ padding: '12px' }}>{movie.titulo}</td>
                            <td style={{ padding: '12px', color: '#ff4b5c' }}>{movie.favoritos} veces</td>
                            <td style={{ padding: '12px', color: '#00ffcc' }}>{movie.alquilada} alquileres</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EstadisticasPeliculas;