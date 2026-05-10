import React, { useState } from "react";
import axios from "axios";
import { savePelicula } from "../../api/peliculasApi";

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const FormularioPelicula = ({ alFinalizar }) => {

    const [tmdbId, setTmdbId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!tmdbId) return;

        try {

            setLoading(true);

            // Obtener película
            const peliculaResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${tmdbId}`,
                {
                    params: {
                        api_key: API_KEY,
                        language: "es-ES"
                    }
                }
            );

            // Obtener créditos
            const creditosResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
                {
                    params: {
                        api_key: API_KEY
                    }
                }
            );

            const peliculaTMDB = peliculaResponse.data;

            const director = creditosResponse.data.crew.find(
                persona => persona.job === "Director"
            );

            const pelicula = {
                tmdbId: peliculaTMDB.id,
                titulo: peliculaTMDB.title,
                genero: peliculaTMDB.genres
                    .map(g => g.name)
                    .join(", "),
                director: director?.name || "Desconocido",
                anio: peliculaTMDB.release_date
                    ? new Date(
                        peliculaTMDB.release_date
                    ).getFullYear()
                    : null,
                sinopsis: peliculaTMDB.overview,
                posterPath: peliculaTMDB.poster_path,
                backdropPath: peliculaTMDB.backdrop_path,
                fechaEstreno: peliculaTMDB.release_date
            };

            await savePelicula(pelicula);
            alert("Película importada desde TMDB");
            alFinalizar();

        } catch (error) {
            console.error("ERROR COMPLETO:", error);
            console.log("Respuesta TMDB:", error?.response?.data);

            alert(
                error?.response?.data?.status_message ||
                error?.message ||
                "Error importando película"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="form-overlay">

            <div className="form-card">

                <h3>Importar desde TMDB</h3>

                <form onSubmit={handleSubmit}>

                    <div className="field">

                        <label>ID de TMDB</label>

                        <input
                            type="number"
                            value={tmdbId}
                            onChange={(e) =>
                                setTmdbId(e.target.value)
                            }
                            placeholder="Ej: 1662094"
                            required
                        />

                    </div>

                    <div className="form-buttons">

                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading
                                ? "Importando..."
                                : "Importar Película"}
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