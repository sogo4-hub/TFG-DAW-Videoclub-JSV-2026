package es.daw.backend.service;

import es.daw.backend.dto.PeliculaRequest;
import es.daw.backend.dto.PeliculaResponse;
import es.daw.backend.entity.Pelicula;
import es.daw.backend.mapper.PeliculaMapper;
import es.daw.backend.repository.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final PeliculaMapper peliculaMapper;
    private final MediaService mediaService;

    public List<PeliculaResponse> listarTodas() {
        return peliculaRepository.findAll().stream()
                .map(peliculaMapper::toResponseDTO)
                .toList();
    }

    public PeliculaResponse guardar(PeliculaRequest request) {
        Pelicula pelicula = peliculaMapper.toEntity(request);
        Pelicula guardada = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(guardada);
    }

    public void eliminar(Long id) {
        // 1. Buscamos la película antes de borrarla para obtener la URL de la imagen
        peliculaRepository.findById(id).ifPresent(pelicula -> {

            String url = pelicula.getUrlImagen();

            // 2. Comprobamos si la URL apunta a nuestro servicio de medios (/api/media/...)
            if (url != null && url.startsWith("/api/media/")) {
                // Extraemos el ID de MongoDB (la parte final de la cadena)
                String mongoId = url.replace("/api/media/", "");

                // 3. Borramos el archivo físico en MongoDB
                mediaService.eliminarArchivo(mongoId);
            }

            // 4. Borramos el registro en la base de datos SQL (H2)
            peliculaRepository.deleteById(id);
        });
    }

    public PeliculaResponse guardarConImagen(PeliculaRequest request, MultipartFile archivo) throws java.io.IOException {
        // 1. Guardamos la imagen en MongoDB y obtenemos su ID
        String mongoId = mediaService.guardarArchivo(archivo);

        // 2. Mapeamos el DTO a la entidad Pelicula
        Pelicula pelicula = peliculaMapper.toEntity(request);

        // 3. Guardamos la "URL" (que ahora es el ID de MongoDB) en SQL
        pelicula.setUrlImagen("/api/media/" + mongoId);

        Pelicula guardada = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(guardada);
    }
}
