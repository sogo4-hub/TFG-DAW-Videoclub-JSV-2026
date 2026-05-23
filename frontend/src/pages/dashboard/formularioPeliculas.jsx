import React, { useState } from "react";
import { importarDesdeTmdb, subirVideoPelicula } from "../../api/peliculasApi";
//-------- cambio el código para poner el env en la raíz
//así el back llama al tmdb pa q se importe la peli desde ahí
//dejo comentado el código antiguo
import './formularioPeliculas.css';
const FormularioPelicula = ({ alFinalizar }) => {

    // const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';
    // const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    // const FormularioPelicula = ({ alFinalizar }) => {

    const [tmdbId, setTmdbId] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            alert("Por favor, selecciona un archivo de video.");
            return;
        }
        setLoading(true);

        try {
            console.log("Iniciando Paso 1: Importando de TMDB...");
            const peliculaCreada = await importarDesdeTmdb(tmdbId);

            const idInternoH2 = peliculaCreada.id;
            console.log(`Paso 1 Completado. ID Interno generado en H2: ${idInternoH2}`);

            console.log(`Iniciando Paso 2: Subiendo video para la película ${idInternoH2}...`);

            const formData = new FormData();
            formData.append("file", videoFile);

            const peliculaFinal = await subirVideoPelicula(idInternoH2, formData);
            console.log("Paso 2 Completado. Video asociado:", peliculaFinal.urlVideo);

            alert(`¡Criterio de éxito completado!\nPelícula: "${peliculaFinal.titulo}"\nID H2: ${peliculaFinal.id}\nStreaming: ${peliculaFinal.urlVideo}`);
            //#region 
            // // Obtener película
            // const peliculaResponse = await axios.get(
            //     `https://api.themoviedb.org/3/movie/${tmdbId}`,
            //     {
            //         params: {
            //             api_key: API_KEY,
            //             language: "es-ES"
            //         }
            //     }
            // );

            // // Obtener créditos
            // const creditosResponse = await axios.get(
            //     `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
            //     {
            //         params: {
            //             api_key: API_KEY
            //         }
            //     }
            // );

            // const peliculaTMDB = peliculaResponse.data;

            // const director = creditosResponse.data.crew.find(
            //     persona => persona.job === "Director"
            // );

            // const pelicula = {
            //     tmdbId: peliculaTMDB.id,
            //     titulo: peliculaTMDB.title,
            //     genero: peliculaTMDB.genres
            //         .map(g => g.name)
            //         .join(", "),
            //     director: director?.name || "Desconocido",
            //     anio: peliculaTMDB.release_date
            //         ? new Date(
            //             peliculaTMDB.release_date
            //         ).getFullYear()
            //         : null,
            //     sinopsis: peliculaTMDB.overview,
            //     posterPath: peliculaTMDB.poster_path,
            //     backdropPath: peliculaTMDB.backdrop_path,
            //     fechaEstreno: peliculaTMDB.release_date
            // };
            //#endregion

            alFinalizar(); // Refresca y cierra

        } catch (error) {
            console.error("ERROR COMPLETO:", error);
            if (error.response && error.response.data) {
                console.log("=== DETALLE DEL ERROR DEL BACKEND ===");
                console.log(error.response.data);
                console.log("=====================================");
            }
            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Error importando película o la subida del vídeo."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-card">
                <h3>Importar Película desde TMDB</h3>

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>ID de TMDB</label>
                        <input
                            type="number"
                            value={tmdbId}
                            onChange={(e) => setTmdbId(e.target.value)}
                            placeholder="Ej: 1662094"
                            required
                        />
                    </div>
                    <div>
                        <p className="buscarId">Buscar <a href="https://www.themoviedb.org/?language=es" target="_blank" rel="noopener noreferrer">ID</a>.</p>                    </div>
                    <div className="field">
                        <label>Archivo de Video Local</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading ? "Importando..." : "Importar Película"}
                        </button>

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={alFinalizar}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioPelicula;