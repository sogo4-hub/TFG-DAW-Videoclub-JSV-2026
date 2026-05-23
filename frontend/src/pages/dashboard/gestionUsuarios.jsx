import React, { useEffect, useState } from 'react';
import "./dashboard.css";

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [orden, setOrden] = useState({
        campo: null,
        direccion: null
    });

    const usuariosFiltrados = [...usuarios]
        .filter((user) => {
            const texto = busqueda.toLowerCase();

            return (
                user.id?.toString().includes(texto) ||
                user.nombre?.toLowerCase().includes(texto) ||
                user.email?.toLowerCase().includes(texto) ||
                user.totalAlquileres?.toString().includes(texto)
            );
        })
        .sort((a, b) => {

            if (!orden.campo || !orden.direccion) {
                return 0;
            }

            const valorA = a[orden.campo] ?? "";
            const valorB = b[orden.campo] ?? "";

            const esNumero =
                !isNaN(valorA) &&
                !isNaN(valorB);

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

            const numA = Number(valorA);
            const numB = Number(valorB);

            if (orden.direccion === "asc") {
                return numA - numB;
            }

            return numB - numA;
        });

    useEffect(() => {
        const savedAuth = sessionStorage.getItem('auth');
        const authObj = savedAuth ? JSON.parse(savedAuth) : null;
        const token = authObj ? authObj.token : null;

        if (!token) {
            setError("No se encontró el token de autenticación. Inicia sesión de nuevo.");
            setLoading(false);
            return;
        }

        fetch('http://localhost:8080/api/admin/dashboard-usuarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 403) {
                    throw new Error("No tienes rol de ADMIN para acceder a este panel.");
                }
                if (!res.ok) {
                    throw new Error("Error en la respuesta del servidor.");
                }
                return res.json(); 
            })
            .then(data => {
                setUsuarios(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message || "No se pudieron cargar los usuarios.");
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

    return (
        <div style={{ padding: '20px', color: '#fff', background: 'rgba(0,0,0,0.6)' }}>
            <h2>GESTIÓN DE USUARIOS REGISTRADOS</h2>
            <p className='subtitle'>Lista completa de clientes de la aplicación y su actividad de alquiler <br /> (Datos reales de H2 mediante JWT).</p>
            <input
                type="text"
                placeholder="Buscar por ID, nombre, email o alquileres..."
                className="btn-search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
            {error && (
                <div style={{ padding: '10px', background: 'rgba(255, 0, 0, 0.2)', border: '1px solid red', borderRadius: '4px', marginBottom: '15px', color: '#ff9999' }}>
                    {error}
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #fff', color: '#ccc' }}>
                        <th
                            onClick={() => handleOrden("id")}
                            style={{ padding: '12px', ...estiloOrdenable }}
                        >
                            ID Usuario {obtenerIndicadorOrden("id")}
                        </th>
                        <th
                            onClick={() => handleOrden("nombre")}
                            style={{ padding: '12px', ...estiloOrdenable }}
                        >
                            Nombre / Nickname {obtenerIndicadorOrden("nombre")}
                        </th>
                        <th
                            onClick={() => handleOrden("email")}
                            style={{ padding: '12px', ...estiloOrdenable }}
                        >
                            Correo Electrónico {obtenerIndicadorOrden("email")}
                        </th>
                        <th
                            onClick={() => handleOrden("fechaRegistro")}
                            style={{ padding: '12px', ...estiloOrdenable }}
                        >
                            Fecha Registro {obtenerIndicadorOrden("fechaRegistro")}
                        </th>
                        <th
                            onClick={() => handleOrden("totalAlquileres")}
                            style={{ padding: '12px', ...estiloOrdenable }}
                        >
                            Películas Alquiladas {obtenerIndicadorOrden("totalAlquileres")}
                        </th>                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan="5"
                                style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    color: '#aaa'
                                }}
                            >
                                Cargando usuarios...
                            </td>
                        </tr>
                    ) : usuariosFiltrados.length === 0 ? (
                        <tr>
                            <td
                                colSpan="5"
                                style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    color: '#aaa'
                                }}
                            >
                                No se encontraron usuarios.
                            </td>
                        </tr>
                    ) : (
                        usuariosFiltrados.map((user) => (
                            <tr
                                key={user.id}
                                style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <td style={{ padding: '12px' }}>{user.id}</td>

                                <td
                                    style={{
                                        padding: '12px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {user.nombre}
                                </td>

                                <td style={{ padding: '12px' }}>
                                    {user.email}
                                </td>

                                <td style={{ padding: '12px' }}>
                                    {user.fechaRegistro
                                        ? user.fechaRegistro.substring(0, 10)
                                        : 'No disponible'}
                                </td>

                                <td
                                    style={{
                                        padding: '12px',
                                        color: '#00ffcc',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {user.totalAlquileres}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default GestionUsuarios;