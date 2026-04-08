package es.daw.backend.dto.tmdb;

import lombok.Data;
import java.util.List;

@Data
public class TmdbCreditsDTO {
    private List<TmdbCrewDTO> crew;
}
