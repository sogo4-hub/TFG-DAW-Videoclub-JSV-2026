package es.daw.backend.dto.tmdb;

import lombok.Data;

@Data
public class TmdbCrewDTO {
    private String name;
    private String job; // Aquí buscaremos la palabra "Director"
}
