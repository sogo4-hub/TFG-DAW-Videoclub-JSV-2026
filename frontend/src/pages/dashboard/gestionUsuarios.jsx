import React, { useEffect, useState } from 'react';

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 1. Buscamos el token en el almacenamiento del navegador
        const savedAuth = sessionStorage.getItem('auth');
        const authObj = savedAuth ? JSON.parse(savedAuth) : null;
        const token = authObj ? authObj.token : null;

        if (!token) {
            setError("No se encontró el token de autenticación. Inicia sesión de nuevo.");
            return;
        }

        // 2. Enviamos el token en la cabecera 'Authorization' que espera Spring Security
        fetch('http://localhost:8080/api/admin/dashboard-usuarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // aquí viaja tu pase de seguridad JWT
            }
        })
            .then(res => {
                if (res.status === 403) {
                    throw new Error("No tienes rol de ADMIN para acceder a este panel.");
                }
                if (!res.ok) {
                    throw new Error("Error en la respuesta del servidor.");
                }
                return res.json(); // Ahora sí llegará un json limpio
            })
            .then(data => {
                console.log("Usuario ejemplo:", data[0]);

                setUsuarios(data);
            })
            .catch(err => {
                console.error(err);
                setError(err.message || "No se pudieron cargar los usuarios.");
            });
    }, []);

    return (
        <div style={{ padding: '20px', color: '#fff', background: 'rgba(0,0,0,0.6)', borderRadius: '8px' }}>
            <h2>GESTIÓN DE USUARIOS REGISTRADOS</h2>
            <p>Lista completa de clientes de la aplicación y su actividad de alquiler (Datos reales de H2 mediante JWT).</p>

            {error && (
                <div style={{ padding: '10px', background: 'rgba(255, 0, 0, 0.2)', border: '1px solid red', borderRadius: '4px', marginBottom: '15px', color: '#ff9999' }}>
                    ⚠️ {error}
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #fff', color: '#ccc' }}>
                        <th style={{ padding: '12px' }}>ID Usuario</th>
                        <th style={{ padding: '12px' }}>Nombre / Nickname</th>
                        <th style={{ padding: '12px' }}>Correo Electrónico</th>
                        <th style={{ padding: '12px' }}>Fecha Registro</th>
                        <th style={{ padding: '12px' }}>Películas Alquiladas</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length === 0 && !error ? (
                        <tr>
                            <td colSpan="5" style={{ padding: '12px', textAlign: 'center', color: '#aaa' }}>
                                Cargando usuarios desde la base de datos...
                            </td>
                        </tr>
                    ) : (
                        usuarios.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <td style={{ padding: '12px' }}>{user.id}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.nombre}</td>
                                <td style={{ padding: '12px' }}>{user.email}</td>
                                <td style={{ padding: '12px' }}>{user.fechaRegistro ? user.fechaRegistro.substring(0, 10) : 'No disponible'}</td>
                                <td style={{ padding: '12px', color: '#00ffcc', fontWeight: 'bold' }}>
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