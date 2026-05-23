import React, { useEffect, useState } from "react";
import "./dashboard.css";

function EstadisticasPeliculas() {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState({
        campo: null,
        direccion: null,
    });

    const statsFiltradas = [...stats]
        .filter((movie) => {
            const texto = busqueda.toLowerCase();

            return (
                movie.id?.toString().includes(texto) ||
                movie.tmdbId?.toString().includes(texto) ||
                movie.titulo?.toLowerCase().includes(texto) ||
                movie.totalFavoritos?.toString().includes(texto) ||
                movie.totalAlquileres?.toString().includes(texto) ||
                movie.notaMedia?.toString().includes(texto)
            );
        })
        .sort((a, b) => {
            if (!orden.campo || !orden.direccion) {
                return 0;
            }

            const valorA = a[orden.campo] ?? "";
            const valorB = b[orden.campo] ?? "";

            const esNumero = !isNaN(valorA) && !isNaN(valorB);

            if (!esNumero) {
                if (orden.direccion === "asc") {
                    return valorA
                        .toString()
                        .localeCompare(valorB.toString(), "es", { sensitivity: "base" });
                }

                return valorB
                    .toString()
                    .localeCompare(valorA.toString(), "es", { sensitivity: "base" });
            }

            const numA = Number(valorA);
            const numB = Number(valorB);

            return orden.direccion === "asc" ? numA - numB : numB - numA;
        });

    useEffect(() => {

        const savedAuth = sessionStorage.getItem("auth");
        const authObj = savedAuth ? JSON.parse(savedAuth) : null;
        const token = authObj ? authObj.token : null;

        if (!token) {
            setError(
                "No se encontró el token de autenticación. Inicia sesión de nuevo.",
            );
            setLoading(false);
            return;
        }

        fetch("http://localhost:8080/api/admin/estadisticas", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error en el servidor: ${res.status} (¿Eres ADMIN?)`);
                }
                return res.json();
            })
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
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
                    direccion: "asc",
                };
            }
            // Descendente
            if (prev.direccion === "asc") {
                return {
                    campo,
                    direccion: "desc",
                };
            }
            // Reset
            return {
                campo: null,
                direccion: null,
            };
        });
    };

    const estiloOrdenable = {
        cursor: "pointer",
        userSelect: "none",
    };

    if (loading)
        return (
            <div style={{ color: "#fff", padding: "20px" }}>
                Cargando estadísticas del catálogo...
            </div>
        );
    if (error)
        return (
            <div style={{ color: "#ff4b5c", padding: "20px", fontWeight: "bold" }}>
                {error}
            </div>
        );

    return (
        <div
            style={{ padding: "20px", color: "#fff", background: "rgba(0,0,0,0.6)" }}
        >
            <h2>Rendimiento del Catálogo</h2>
            <p style={{ textAlign: "center" }}>
                Métricas de uso cruzando tu Base de Datos H2 y la API de TMDB.
            </p>
            <input
                type="text"
                placeholder="Buscar por ID, título, TMDB, favoritos o nota..."
                className="btn-search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
            {statsFiltradas.length === 0 ? (
                <p style={{ color: "#aaa", marginTop: "20px", textAlign: "center" }}>
                    No se encontraron estadísticas que coincidan con la búsqueda.
                </p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                        textAlign: "left",
                    }}
                >
                    <thead>
                        <tr style={{ borderBottom: "2px solid #fff", color: "#ccc" }}>
                            <th
                                onClick={() => handleOrden("id")}
                                style={{ padding: "12px", ...estiloOrdenable }}
                            >
                                ID H2 (Local) {obtenerIndicadorOrden("id")}
                            </th>

                            <th
                                onClick={() => handleOrden("tmdbId")}
                                style={{ padding: "12px", ...estiloOrdenable }}
                            >
                                ID TMDB (Externo) {obtenerIndicadorOrden("tmdbId")}
                            </th>

                            <th
                                onClick={() => handleOrden("titulo")}
                                style={{ padding: "12px", ...estiloOrdenable }}
                            >
                                Película {obtenerIndicadorOrden("titulo")}
                            </th>

                            <th
                                onClick={() => handleOrden("totalFavoritos")}
                                style={{ padding: "12px", ...estiloOrdenable }}
                            >
                                En Favoritos {obtenerIndicadorOrden("totalFavoritos")}
                            </th>

                            <th
                                onClick={() => handleOrden("totalAlquileres")}
                                style={{ padding: "12px", ...estiloOrdenable }}
                            >
                                Veces Alquilada {obtenerIndicadorOrden("totalAlquileres")}
                            </th>

                            <th
                                onClick={() => handleOrden("notaMedia")}
                                style={{ padding: "12px", ...estiloOrdenable }}
                            >
                                Nota Media {obtenerIndicadorOrden("notaMedia")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {statsFiltradas.map((movie) => (
                            <tr
                                key={movie.id}
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                            >
                                <td style={{ padding: "12px", color: "#aaa" }}>{movie.id}</td>
                                <td style={{ padding: "12px", color: "#ff3b3b" }}>
                                    {movie.tmdbId}
                                </td>
                                <td style={{ padding: "12px" }}>{movie.titulo}</td>
                                <td style={{ padding: "12px", color: "#7b1fa2" }}>
                                    {movie.totalFavoritos} veces
                                </td>
                                <td style={{ padding: "12px", color: "#28a745" }}>
                                    {movie.totalAlquileres} alquileres
                                </td>
                                <td style={{ padding: "12px", color: "#ffc107" }}>
                                    {movie.notaMedia !== null && movie.notaMedia !== undefined
                                        ? `${movie.notaMedia} / 5`
                                        : "Sin votos"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default EstadisticasPeliculas;
