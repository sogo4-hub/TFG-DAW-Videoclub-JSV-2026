import { useState, useEffect } from "react";
import { getPeliculas, deletePelicula } from "../../api/peliculasApi"; 
import "./dashboard.css"; // Reutilizamos estilos o crea uno nuevo

export default function GestionPeliculas() {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar películas al montar el componente
    useEffect(() => {
        cargarPeliculas();
    }, []);

const cargarPeliculas = async () => {
    try {
        const data = await getPeliculas();
        // Intentamos sacar los datos de .content si existe, si no, usamos data
        const listaPeliculas = data.content ? data.content : data;
        setPeliculas(Array.isArray(listaPeliculas) ? listaPeliculas : []);
    } catch (error) {
        console.error("Error al obtener películas:", error);
    } finally {
        setLoading(false);
    }
};
    // 2. Función para eliminar
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta película?")) {
            try {
                await deletePelicula(id);
                // Filtramos el estado para quitar la borrada sin recargar la página
                setPeliculas(peliculas.filter(p => p.id !== id));
            } catch (error) {
                alert("No se pudo eliminar la película");
            }
        }
    };

    if (loading) return <p>Cargando catálogo...</p>;

    return (
        <div className="gestion-container">
            <h2>Gestión de Catálogo</h2>
            <button className="btn-add">Añadir Nueva Película</button>
            
            <table className="gestion-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Género</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {peliculas.map((pelicula) => (
                        <tr key={pelicula.id}>
                            <td>{pelicula.id}</td>
                            <td>{pelicula.titulo}</td>
                            <td>{pelicula.genero}</td>
                            <td>
                                <button onClick={() => console.log("Editar", pelicula.id)}>
                                    Editar
                                </button>
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