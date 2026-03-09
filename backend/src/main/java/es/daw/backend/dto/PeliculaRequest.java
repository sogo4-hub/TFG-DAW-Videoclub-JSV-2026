package es.daw.backend.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
//(Para crear/editar)
public class PeliculaRequest {
    private String titulo;
    private String sinopsis;
    private String director;
    private int anio;
    private String genero;
    private String urlImagen;
    private String urlVideo;
}
