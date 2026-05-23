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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // public List<PeliculaResponse> listarTodas() {
    // return peliculaRepository.findAll().stream()
    // .map(peliculaMapper::toResponseDTO)
    // .toList();
    // }

    public Page<PeliculaResponse> listarPaginadas(String search, String genero, Pageable pageable) {
        String tituloFiltro = (search == null) ? "" : search.trim();
        String generoFiltro = (genero == null) ? "" : genero.trim();

        return peliculaRepository
                .findByTituloContainingIgnoreCaseAndGeneroContainingIgnoreCase(
                        tituloFiltro,
                        generoFiltro,
                        pageable)
                .map(peliculaMapper::toResponseDTO);
    }

    // Para el dashboard del admin — devuelve todas sin límite de paginación
    public List<PeliculaResponse> listarTodasSinPaginar() {
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
        peliculaRepository.findById(id).ifPresent(pelicula -> {
            // Antes de borrar la película en H2, eliminamos los recursos multimedia
            // asociados en MongoDB/GridFS, si pertenecen a nuestro servicio interno.
            eliminarMediaSiEsDeMongo(pelicula.getUrlImagen());
            eliminarMediaSiEsDeMongo(pelicula.getUrlVideo());
            // Finalmente eliminamos el registro relacional de la película.
            peliculaRepository.deleteById(id);
        });
    }

    /**
    * Elimina de MongoDB/GridFS un recurso multimedia asociado a una película.
    *
    * Solo actúa sobre URLs internas que empiezan por "/api/media/".
    * Esto evita intentar borrar recursos externos, como imágenes de TMDB.
    *
    * Funciona tanto para:
    * - Imágenes: /api/media/{mongoId}
    * - Vídeos:   /api/media/stream/{mongoId}
    *
    * En ambos casos se extrae el último segmento de la URL, que corresponde
    * al ObjectId del archivo almacenado en GridFS.
    */

    private void eliminarMediaSiEsDeMongo(String url) {
        if (url == null || !url.startsWith("/api/media/")) {
            return;
        }

        String mongoId = url.substring(url.lastIndexOf("/") + 1);
        mediaService.eliminarArchivo(mongoId);
    }

    public PeliculaResponse guardarConImagen(PeliculaRequest request, MultipartFile archivo)
            throws java.io.IOException {
        // 1. Guardamos la imagen en MongoDB y obtenemos su ID
        String mongoId = mediaService.guardarArchivo(archivo);

        // 2. Mapeamos el DTO a la entidad Pelicula
        Pelicula pelicula = peliculaMapper.toEntity(request);

        // 3. Guardamos la "URL" (que ahora es el ID de MongoDB) en SQL
        pelicula.setUrlImagen("/api/media/" + mongoId);

        Pelicula guardada = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(guardada);
    }

    public PeliculaResponse guardarConMultimedia(PeliculaRequest request, MultipartFile imagen, MultipartFile video)
            throws java.io.IOException {
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

        // extraer año (Los primeros 4 caracteres de '2010-07-15')
        if (tmdbData.getReleaseDate() != null && tmdbData.getReleaseDate().length() >= 4) {
            pelicula.setAnio(Integer.parseInt(tmdbData.getReleaseDate().substring(0, 4)));
        }

        // extraer géneros (Concatenados por comas: "Acción, Ciencia Ficción")
        if (tmdbData.getGenres() != null && !tmdbData.getGenres().isEmpty()) {
            String generosFormateados = tmdbData.getGenres().stream()
                    .map(TmdbGenreDTO::getName)
                    .reduce((g1, g2) -> g1 + ", " + g2)
                    .orElse("Desconocido");
            pelicula.setGenero(generosFormateados);
        }

        // extraer el director (Filtrando el equipo técnico)
        if (tmdbData.getCredits() != null && tmdbData.getCredits().getCrew() != null) {
            String director = tmdbData.getCredits().getCrew().stream()
                    .filter(crewMember -> "Director".equals(crewMember.getJob()))
                    .map(TmdbCrewDTO::getName)
                    .findFirst() // Nos quedamos con el primero que encuentre
                    .orElse("Desconocido");
            pelicula.setDirector(director);
        }

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
            // 2. Subimos el archivo a mongo de atlas mediante mediaservice
            String gridFsId = mediaService.uploadFile(file);

            // 3. Creamos la url estandarizada para consumirla en React
            pelicula.setUrlVideo("/api/media/stream/" + gridFsId);

            // 5. Guardamos los cambios y devolvemos el DTO actualizado
            return peliculaMapper.toResponseDTO(peliculaRepository.save(pelicula));

        } catch (Exception e) {
            throw new RuntimeException("Error crítico al subir el archivo a MongoDB Atlas: " + e.getMessage());
        }
    }

    @Transactional
    public PeliculaResponse importarPeliculaConVideo(Long tmdbId, MultipartFile videoFile) throws java.io.IOException {

        if (peliculaRepository.existsByTmdbId(tmdbId)) {
            throw new PeliculaAlreadyExistsException("La película ya existe en nuestro catálogo local.");
        }

        //----traemos datos de tmdb
        TmdbMovieDTO tmdbData = tmdbService.getMovieDetails(tmdbId)
                .orElseThrow(() -> new RuntimeException("Película no encontrada en TMDB."));

        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(tmdbData.getTitle());
        pelicula.setSinopsis(tmdbData.getOverview());
        pelicula.setUrlImagen(tmdbData.getPosterPath());
        pelicula.setTmdbId(tmdbId);
        pelicula.setBackdropPath(tmdbData.getBackdropPath());
        pelicula.setVoteAverage(tmdbData.getVoteAverage());

        if (tmdbData.getReleaseDate() != null && tmdbData.getReleaseDate().length() >= 4) {
            pelicula.setAnio(Integer.parseInt(tmdbData.getReleaseDate().substring(0, 4)));
        }

        if (tmdbData.getGenres() != null && !tmdbData.getGenres().isEmpty()) {
            String generosFormateados = tmdbData.getGenres().stream()
                    .map(TmdbGenreDTO::getName)
                    .reduce((g1, g2) -> g1 + ", " + g2)
                    .orElse("Desconocido");
            pelicula.setGenero(generosFormateados);
        }

        if (tmdbData.getCredits() != null && tmdbData.getCredits().getCrew() != null) {
            String director = tmdbData.getCredits().getCrew().stream()
                    .filter(crewMember -> "Director".equals(crewMember.getJob()))
                    .map(TmdbCrewDTO::getName)
                    .findFirst()
                    .orElse("Desconocido");
            pelicula.setDirector(director);
        }

        // 2. PROCESAR EL VIDEO
        if (videoFile != null && !videoFile.isEmpty()) {
            String gridFsId = mediaService.uploadFile(videoFile);
            pelicula.setUrlVideo("/api/media/stream/" + gridFsId);
        }

        // 3. Guardar todo el conjunto en H2
        Pelicula guardada = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(guardada);
    }
}
