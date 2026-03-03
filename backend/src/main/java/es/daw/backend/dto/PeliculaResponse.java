package es.daw.backend.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
//(Para mostrar al usuario)
public class PeliculaResponse {
    private Long id;
    private String titulo;
    private String sinopsis;
    private String director;
    private int anio;
    private String genero;
    private String urlImagen;
}
