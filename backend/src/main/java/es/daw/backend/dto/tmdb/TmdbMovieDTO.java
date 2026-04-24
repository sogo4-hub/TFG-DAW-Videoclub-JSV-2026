package es.daw.backend.dto.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class TmdbMovieDTO {
    private Long id; // ID interno de TMDB
    private String title;
    private String overview;

    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("backdrop_path")
    private String backdropPath;

    @JsonProperty("release_date")
    private String releaseDate;

    @JsonProperty("vote_average")
    private Double voteAverage;

    // 🔥 NUEVOS CAMPOS:
    private List<TmdbGenreDTO> genres;
    private TmdbCreditsDTO credits;
}
