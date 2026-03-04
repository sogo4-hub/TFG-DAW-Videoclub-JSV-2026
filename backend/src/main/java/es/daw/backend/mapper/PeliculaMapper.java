package es.daw.backend.mapper;

import es.daw.backend.dto.PeliculaRequest;
import es.daw.backend.dto.PeliculaResponse;
import es.daw.backend.entity.Pelicula;
import org.springframework.stereotype.Component;

@Component
public class PeliculaMapper {

    public PeliculaResponse toResponseDTO(Pelicula pelicula) {
        if (pelicula == null) return null;
        return PeliculaResponse.builder()
                .id(pelicula.getId())
                .titulo(pelicula.getTitulo())
                .sinopsis(pelicula.getSinopsis())
                .director(pelicula.getDirector())
                .anio(pelicula.getAnio())
                .genero(pelicula.getGenero())
                .urlImagen(pelicula.getUrlImagen())
                .urlVideo(pelicula.getUrlVideo()) // <--- NUEVO: Añadimos el vídeo a la respuesta
                .build();
    }

    public Pelicula toEntity(PeliculaRequest dto) {
        if (dto == null) return null;
        return Pelicula.builder()
                .titulo(dto.getTitulo())
                .sinopsis(dto.getSinopsis())
                .director(dto.getDirector())
                .anio(dto.getAnio())
                .genero(dto.getGenero())
                .urlImagen(dto.getUrlImagen())
                .urlVideo(dto.getUrlVideo()) // <--- NUEVO: Añadimos el vídeo a la entidad
                .build();
    }
}