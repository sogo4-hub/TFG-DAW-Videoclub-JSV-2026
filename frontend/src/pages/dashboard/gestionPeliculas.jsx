import { useState, useEffect } from "react";
import { getPeliculasTodas, deletePelicula } from "../../api/peliculasApi";
import "./dashboard.css";
import FormularioPelicula from './formularioPeliculas.jsx';

export default function GestionPeliculas() {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [orden, setOrden] = useState({
        campo: null,
        direccion: null
    });

    //Cargar películas al montar el componente
    useEffect(() => {
        cargarPeliculas();
    }, []);
    const cargarPeliculas = async () => {

        try {
            const listaPeliculas = await getPeliculasTodas();
            setPeliculas(listaPeliculas);
        } catch (error) {
            console.error("Error al obtener películas:", error);
        } finally {
            setLoading(false);
        }

    };
    //Eliminar
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta película?")) {
            try {
                await deletePelicula(id);
                const nuevasPeliculas = peliculas.filter(p => p.id !== id);
                setPeliculas(nuevasPeliculas);
            } catch (error) {
                alert("No se pudo eliminar la película" + error);
            }
        }
    };

    const handlePeliculaAnadida = () => {
        setMostrarFormulario(false);
        cargarPeliculas();
    };

    //Filtrar peliculas
    const peliculasFiltradas = [...peliculas]
        .filter((pelicula) => {
            const texto = busqueda.toLowerCase();

            return (
                pelicula.titulo?.toLowerCase().includes(texto) ||
                pelicula.genero?.toLowerCase().includes(texto) ||
                pelicula.id?.toString().includes(texto) ||
                pelicula.tmdbId?.toString().includes(texto)
            );
        })
        .sort((a, b) => {

            if (!orden.campo || !orden.direccion) {
                return 0;
            }

            const valorA = a[orden.campo] ?? "";
            const valorB = b[orden.campo] ?? "";

            if (typeof valorA === "string") {

                if (orden.direccion === "asc") {
                    return valorA.localeCompare(valorB, "es", {
                        sensitivity: "base"
                    });
                }

                return valorB.localeCompare(valorA, "es", {
                    sensitivity: "base"
                });
            }

            if (orden.direccion === "asc") {
                return valorA - valorB;
            }

            return valorB - valorA;
        });

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

            // Sin orden / Reset
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


    if (loading) return <p>Cargando catálogo...</p>;

    return (
        <div className="gestion-container">
            <h2 className="gestionPeliculas">Gestión de Catálogo</h2>
            <button className="btn-add" onClick={() => setMostrarFormulario(!mostrarFormulario)} >
                {mostrarFormulario ? "Cerrar Formulario" : "Añadir Nueva Película"}
            </button>
            <input
                type="text"
                placeholder="Buscar por título, ID, TMDB o género..."
                className="btn-search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />
            {mostrarFormulario && (
                <div className="formulario-wrapper">
                    <FormularioPelicula alFinalizar={handlePeliculaAnadida} />
                </div>
            )}
            <table className="gestion-table">
                <thead>
                    <tr>
                        <th onClick={() => handleOrden("id")} style={estiloOrdenable}>
                            ID {obtenerIndicadorOrden("id")}
                        </th>
                        <th onClick={() => handleOrden("tmdbId")} style={estiloOrdenable}>
                            ID TMDB {obtenerIndicadorOrden("tmdbId")}
                        </th>

                        <th onClick={() => handleOrden("titulo")} style={estiloOrdenable}>
                            Título {obtenerIndicadorOrden("titulo")}
                        </th>

                        <th onClick={() => handleOrden("genero")} style={estiloOrdenable}>
                            Género {obtenerIndicadorOrden("genero")}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {peliculasFiltradas.map((pelicula) => (
                        <tr key={pelicula.id}>
                            <td>{pelicula.id}</td>
                            <td style={{ color: '#888', fontSize: '0.9em' }}>
                                {pelicula.tmdbId}
                            </td>
                            <td>{pelicula.titulo}</td>
                            <td>{pelicula.genero}</td>
                            <td>

                                <button
                                    className="btn-delete"
                                    onClick={() => handleEliminar(pelicula.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}