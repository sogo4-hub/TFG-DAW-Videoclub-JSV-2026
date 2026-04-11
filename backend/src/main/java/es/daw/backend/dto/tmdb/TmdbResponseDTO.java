package es.daw.backend.dto.tmdb;

import lombok.Data;
import java.util.List;

@Data
public class TmdbResponseDTO {
    private List<TmdbMovieDTO> results;
}
