import React, { useEffect, useState } from 'react';

function GestionAlquileres() {
    const [alquileres, setAlquileres] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Recuperamos el token de forma segura desde el sessionStorage tal y como lo guarda tu AuthContext
        const savedAuth = sessionStorage.getItem('auth');
        const authObj = savedAuth ? JSON.parse(savedAuth) : null;
        const token = authObj ? authObj.token : null;

        if (!token) {
            setError("⚠️ No se encontró el token de autenticación. Inicia sesión de nuevo.");
            setLoading(false);
            return;
        }

        // 2. Realizamos la petición real al endpoint de administración
        fetch('http://localhost:8080/api/admin/alquileres', {
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
                setAlquileres(data);
                setLoading(false);
            })
            .catch(err => {
                setError(`Error de conexión: ${err.message}`);
                setLoading(false);
            });
    }, []);

    // 3. Función inteligente para calcular si un alquiler está Activo o Retrasado
    const calcularEstado = (fechaFin) => {
        if (!fechaFin) return 'Devuelto'; // Por si manejas un estado explícito de devolución

        const ahora = new Date();
        const vencimiento = new Date(fechaFin);

        return vencimiento > ahora ? 'Activo' : 'Retrasado';
    };

    // Función auxiliar para darle color visual al estado del alquiler
    const obtenerEstiloEstado = (estado) => {
        switch (estado) {
            case 'Activo': return { color: '#00ffcc', backgroundColor: 'rgba(0, 255, 204, 0.1)', padding: '4px 8px', borderRadius: '4px' };
            case 'Devuelto': return { color: '#aaa', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '4px 8px', borderRadius: '4px' };
            case 'Retrasado': return { color: '#ff4b5c', backgroundColor: 'rgba(255, 75, 92, 0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            default: return {};
        }
    };

    if (loading) return <div style={{ color: '#fff', padding: '20px' }}>⏳ Cargando historial de alquileres...</div>;
    if (error) return <div style={{ color: '#ff4b5c', padding: '20px', fontWeight: 'bold' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', color: '#fff', background: 'rgba(0,0,0,0.6)', borderRadius: '8px' }}>
            <h2>🍿 Control de Alquileres Activos e Historial Real</h2>
            <p>Monitorea las transacciones en tiempo real de la base de datos.</p>

            {alquileres.length === 0 ? (
                <p style={{ color: '#aaa', marginTop: '20px' }}>No hay ningún alquiler registrado en la plataforma actualmente.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #fff', color: '#ccc' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Usuario</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Película</th>
                            <th style={{ padding: '12px' }}>Fecha Alquiler</th>
                            <th style={{ padding: '12px' }}>Fecha Vencimiento</th>
                            <th style={{ padding: '12px' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alquileres.map((item) => {
                            // Calculamos el estado en función de la fecha de fin que ya viene como String
                            const estadoActual = calcularEstado(item.fechaFin);

                            // Formateamos visualmente los strings de las fechas quitando la 'T'
                            const fInicio = item.fechaInicio ? item.fechaInicio.replace('T', ' ').substring(0, 16) : '---';
                            const fFin = item.fechaFin ? item.fechaFin.replace('T', ' ').substring(0, 16) : '---';

                            return (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '12px', color: '#aaa', fontFamily: 'monospace' }}>{item.id}</td>
                                    {/* Leemos directamente las propiedades planas del DTO sin sub-objetos */}
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.usuarioNombre}</td>
                                    <td style={{ padding: '12px', color: '#aaa' }}>{item.usuarioEmail}</td>
                                    <td style={{ padding: '12px' }}>{item.peliculaTitulo}</td>
                                    <td style={{ padding: '12px' }}>{fInicio}</td>
                                    <td style={{ padding: '12px' }}>{fFin}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={obtenerEstiloEstado(estadoActual)}>
                                            {estadoActual}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GestionAlquileres;