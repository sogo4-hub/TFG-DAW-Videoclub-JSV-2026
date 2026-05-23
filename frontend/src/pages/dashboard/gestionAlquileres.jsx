import React, { useEffect, useState } from 'react';
import "./dashboard.css";

function GestionAlquileres() {
    const [alquileres, setAlquileres] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState({
        campo: null,
        direccion: null
    });

    useEffect(() => {
        const savedAuth = sessionStorage.getItem('auth');
        const authObj = savedAuth ? JSON.parse(savedAuth) : null;
        const token = authObj ? authObj.token : null;

        if (!token) {
            setError(" No se encontró el token de autenticación. Inicia sesión de nuevo.");
            setLoading(false);
            return;
        }

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
    const obtenerIndicadorOrden = (campo) => {

        if (orden.campo !== campo) {
            return "";
        }

        if (orden.direccion === "asc") {
            return "▲";
        }

        if (orden.direccion === "desc") {
            return "▼";
        }

        return "";
    };

    const handleOrden = (campo) => {

        setOrden((prev) => {

            // Ascendente
            if (prev.campo !== campo) {
                return {
                    campo,
                    direccion: "asc"
                };
            }

            // Descendente
            if (prev.direccion === "asc") {
                return {
                    campo,
                    direccion: "desc"
                };
            }

            // Reset
            return {
                campo: null,
                direccion: null
            };
        });
    };

    const estiloOrdenable = {
        cursor: "pointer",
        userSelect: "none"
    };

    const calcularEstado = (fechaFin) => {
        if (!fechaFin) return 'Devuelto';

        const ahora = new Date();
        const vencimiento = new Date(fechaFin);

        return vencimiento > ahora ? 'Activo' : 'Caducado';
    };

    // Color dependiendo del estado del alquiler
    const obtenerEstiloEstado = (estado) => {
        switch (estado) {
            case 'Activo': return { color: '#00ffcc', backgroundColor: 'rgba(0, 255, 204, 0.1)', padding: '4px 8px', borderRadius: '4px' };
            case 'Devuelto': return { color: '#aaa', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '4px 8px', borderRadius: '4px' };
            case 'Caducado': return { color: '#ff4b5c', backgroundColor: 'rgba(255, 75, 92, 0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' };
            default: return {};
        }
    };

    const alquileresFiltrados = [...alquileres]
        .filter((item) => {
            const texto = busqueda.toLowerCase();

            return (
                item.id?.toString().includes(texto) ||
                item.usuarioNombre?.toLowerCase().includes(texto) ||
                item.usuarioEmail?.toLowerCase().includes(texto) ||
                item.peliculaTitulo?.toLowerCase().includes(texto) ||
                calcularEstado(item.fechaFin).toLowerCase().includes(texto)
            );
        })
        .sort((a, b) => {

            if (!orden.campo || !orden.direccion) {
                return 0;
            }

            // Estados calculados
            const valorA =
                orden.campo === "estado"
                    ? calcularEstado(a.fechaFin)
                    : a[orden.campo] ?? "";

            const valorB =
                orden.campo === "estado"
                    ? calcularEstado(b.fechaFin)
                    : b[orden.campo] ?? "";

            // Orden personalizado de los estados
            if (orden.campo === "estado") {

                const ordenEstados = {
                    Activo: 1,
                    Caducado: 2,
                    Devuelto: 3
                };

                return orden.direccion === "asc"
                    ? ordenEstados[valorA] - ordenEstados[valorB]
                    : ordenEstados[valorB] - ordenEstados[valorA];
            }

            // Fechas
            if (
                orden.campo === "fechaInicio" ||
                orden.campo === "fechaFin"
            ) {

                const fechaA = new Date(valorA);
                const fechaB = new Date(valorB);

                return orden.direccion === "asc"
                    ? fechaA - fechaB
                    : fechaB - fechaA;
            }

            const esNumero =
                !isNaN(valorA) &&
                !isNaN(valorB);

            // Texto
            if (!esNumero) {

                if (orden.direccion === "asc") {
                    return valorA.toString().localeCompare(
                        valorB.toString(),
                        "es",
                        { sensitivity: "base" }
                    );
                }

                return valorB.toString().localeCompare(
                    valorA.toString(),
                    "es",
                    { sensitivity: "base" }
                );
            }

            // Números
            const numA = Number(valorA);
            const numB = Number(valorB);

            return orden.direccion === "asc"
                ? numA - numB
                : numB - numA;
        });

    if (loading) return <div style={{ color: '#fff', padding: '20px', textAlign:'center' }}>⏳ Cargando historial de alquileres...</div>;
    if (error) return <div style={{ color: '#ff4b5c', padding: '20px', fontWeight: 'bold', textAlign:'center' }}>{error}</div>;

    return (
        <div style={{ padding: '20px', color: '#fff', background: 'rgba(0,0,0,0.6)' }}>
            <h2>Control de Alquileres Activos e Historial Real</h2>
            <p className='subtitle'>Monitorea las transacciones en tiempo real de la base de datos.</p>
            <input
                type="text"
                placeholder="Buscar por usuario, email, película o estado..."
                className="btn-search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ marginTop: '20px' }}
            />
            {alquileresFiltrados.length === 0 ? (
                <p style={{ color: '#aaa', marginTop: '20px', textAlign: 'center' }}>No se encontraron alquileres.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #fff', color: '#ccc' }}>

                            <th
                                onClick={() => handleOrden("id")}
                                style={{ padding: '12px', ...estiloOrdenable }}
                            >
                                ID {obtenerIndicadorOrden("id")}
                            </th>

                            <th
                                onClick={() => handleOrden("usuarioNombre")}
                                style={{ padding: '12px', ...estiloOrdenable }}
                            >
                                Usuario {obtenerIndicadorOrden("usuarioNombre")}
                            </th>

                            <th
                                onClick={() => handleOrden("usuarioEmail")}
                                style={{ padding: '12px', ...estiloOrdenable }}
                            >
                                Email {obtenerIndicadorOrden("usuarioEmail")}
                            </th>

                            <th
                                onClick={() => handleOrden("peliculaTitulo")}
                                style={{ padding: '12px', ...estiloOrdenable }}
                            >
                                Película {obtenerIndicadorOrden("peliculaTitulo")}
                            </th>

                            <th
                                onClick={() => handleOrden("fechaInicio")}
                                style={{ padding: '12px', ...estiloOrdenable }}
                            >
                                Fecha Alquiler {obtenerIndicadorOrden("fechaInicio")}
                            </th>

                            <th
                                onClick={() => handleOrden("fechaFin")}
                                style={{ padding: '12px', ...estiloOrdenable }}
                            >
                                Fecha Vencimiento {obtenerIndicadorOrden("fechaFin")}
                            </th>

                            <th
                                onClick={() => handleOrden("estado")}
                                style={{ padding: '12px', ...estiloOrdenable }}
                            >
                                Estado {obtenerIndicadorOrden("estado")}
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {alquileresFiltrados.map((item) => {
                            const estadoActual = calcularEstado(item.fechaFin);
                            const fInicio = item.fechaInicio ? item.fechaInicio.replace('T', ' ').substring(0, 16) : '---';
                            const fFin = item.fechaFin ? item.fechaFin.replace('T', ' ').substring(0, 16) : '---';

                            return (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '12px', color: '#aaa', fontFamily: 'monospace' }}>{item.id}</td>
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