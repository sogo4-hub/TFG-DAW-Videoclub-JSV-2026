package es.daw.backend.dto.tmdb;

import lombok.Data;

@Data
public class TmdbCrewDTO {
    private String name;
    private String job; // aquí buscaremos la palabra Director
}
