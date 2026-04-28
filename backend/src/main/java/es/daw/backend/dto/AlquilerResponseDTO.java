package es.daw.backend.dto;

import es.daw.backend.entity.Pelicula;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AlquilerResponseDTO {
    private Pelicula pelicula;
    private boolean reproducida;
}
