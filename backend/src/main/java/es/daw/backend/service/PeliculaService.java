package es.daw.backend.service;

import es.daw.backend.dto.PeliculaRequest;
import es.daw.backend.dto.PeliculaResponse;
import es.daw.backend.dto.tmdb.TmdbCrewDTO;
import es.daw.backend.dto.tmdb.TmdbGenreDTO;
import es.daw.backend.dto.tmdb.TmdbMovieDTO;
import es.daw.backend.entity.Pelicula;
import es.daw.backend.exception.PeliculaAlreadyExistsException;
import es.daw.backend.mapper.PeliculaMapper;
import es.daw.backend.repository.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final TmdbService tmdbService;
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

    public PeliculaResponse guardarConMultimedia(PeliculaRequest request, MultipartFile imagen, MultipartFile video) throws java.io.IOException {
        // 1. Guardamos la imagen en MongoDB
        String imgId = mediaService.guardarArchivo(imagen);

        // 2. Guardamos el vídeo en MongoDB
        String videoId = mediaService.guardarArchivo(video);

        // 3. Mapeamos y asignamos las "URLs" lógicas
        Pelicula pelicula = peliculaMapper.toEntity(request);
        pelicula.setUrlImagen("/api/media/" + imgId);
        pelicula.setUrlVideo("/api/media/" + videoId);

        Pelicula guardada = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(guardada);
    }

    @Transactional
    public PeliculaResponse importarPeliculaTmdb(Long tmdbId) {
        // 1. Validar que no exista previamente
        if (peliculaRepository.existsByTmdbId(tmdbId)) {
            throw new PeliculaAlreadyExistsException("La película ya existe en nuestro catálogo local.");
        }

        // 2. Traer datos de TMDB
        TmdbMovieDTO tmdbData = tmdbService.getMovieDetails(tmdbId)
                .orElseThrow(() -> new RuntimeException("Película no encontrada en TMDB."));

        // 3. Mapear a tu entidad Pelicula local
        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(tmdbData.getTitle());
        pelicula.setSinopsis(tmdbData.getOverview());
        pelicula.setUrlImagen(tmdbData.getPosterPath());
        pelicula.setTmdbId(tmdbId);
        pelicula.setBackdropPath(tmdbData.getBackdropPath());
        pelicula.setVoteAverage(tmdbData.getVoteAverage());

        // 🔥 EXTRAER EL AÑO (Los primeros 4 caracteres de '2010-07-15')
        if (tmdbData.getReleaseDate() != null && tmdbData.getReleaseDate().length() >= 4) {
            pelicula.setAnio(Integer.parseInt(tmdbData.getReleaseDate().substring(0, 4)));
        }

        // 🔥 EXTRAER LOS GÉNEROS (Concatenados por comas: "Acción, Ciencia Ficción")
        if (tmdbData.getGenres() != null && !tmdbData.getGenres().isEmpty()) {
            String generosFormateados = tmdbData.getGenres().stream()
                    .map(TmdbGenreDTO::getName)
                    .reduce((g1, g2) -> g1 + ", " + g2)
                    .orElse("Desconocido");
            pelicula.setGenero(generosFormateados);
        }

        // 🔥 EXTRAER EL DIRECTOR (Filtrando el equipo técnico)
        if (tmdbData.getCredits() != null && tmdbData.getCredits().getCrew() != null) {
            String director = tmdbData.getCredits().getCrew().stream()
                    .filter(crewMember -> "Director".equals(crewMember.getJob()))
                    .map(TmdbCrewDTO::getName)
                    .findFirst() // Nos quedamos con el primero que encuentre
                    .orElse("Desconocido");
            pelicula.setDirector(director);
        }

        // OJO: El GridFsId (el vídeo en mongo) estará nulo/vacío hasta que lo subas desde un panel de admin.
        // pelicula.setGridFsId(null);

        // 4. Guardar en H2 y retornar DTO
        Pelicula saved = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(saved);// Convierte a tu DTO de respuesta para el frontend
    }

    @Transactional
    public PeliculaResponse subirVideo(Long peliculaId, MultipartFile file) {
        // 1. Buscamos la película en la base de datos relacional (H2)
        Pelicula pelicula = peliculaRepository.findById(peliculaId)
                .orElseThrow(() -> new RuntimeException("Película no encontrada con ID: " + peliculaId));

        try {
            // 2. Subimos el archivo a MongoDB Atlas mediante tu MediaService
            // NOTA: Asumo que en tu MediaService tienes un método llamado 'uploadFile'
            // o 'guardarVideo'. Si se llama distinto, ajusta este nombre.
            String gridFsId = mediaService.uploadFile(file);

            // 3. Creamos la URL estandarizada para que Sara la consuma en React
            pelicula.setUrlVideo("/api/media/stream/" + gridFsId);

            // 5. Guardamos los cambios y devolvemos el DTO actualizado
            return peliculaMapper.toResponseDTO(peliculaRepository.save(pelicula));

        } catch (Exception e) {
            throw new RuntimeException("Error crítico al subir el archivo a MongoDB Atlas: " + e.getMessage());
        }
    }
}
