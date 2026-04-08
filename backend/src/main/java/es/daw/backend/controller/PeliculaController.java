package es.daw.backend.controller;

import es.daw.backend.dto.PeliculaRequest;
import es.daw.backend.dto.PeliculaResponse;
import es.daw.backend.dto.tmdb.TmdbMovieDTO;
import es.daw.backend.service.PeliculaService;
import es.daw.backend.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService peliculaService;
    private final TmdbService tmdbService;

    @GetMapping
    public ResponseEntity<List<PeliculaResponse>> listarTodas() {
        return ResponseEntity.ok(peliculaService.listarTodas());
    }

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PeliculaResponse> crear(
            @RequestPart("datos") PeliculaRequest request, // El JSON de la película
            @RequestPart("archivo") MultipartFile archivo,  // La imagen real
            @RequestPart("video") MultipartFile video // ARCHIVO DE VIDEO
    ) throws java.io.IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                // Usamos el método nuevo pasándole imagen y vídeo
                .body(peliculaService.guardarConMultimedia(request, archivo, video));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        peliculaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para que el Admin busque películas en TMDB
    @GetMapping("/tmdb/search")
    public ResponseEntity<List<TmdbMovieDTO>> searchInTmdb(@RequestParam String query) {
        return ResponseEntity.ok(tmdbService.searchMovies(query));
    }

    // Endpoint para importar la película de TMDB a tu Base de Datos local H2
    @PostMapping("/tmdb/import/{tmdbId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Usa hasAuthority en lugar de hasRole
    public ResponseEntity<PeliculaResponse> importFromTmdb(@PathVariable Long tmdbId) {
        return ResponseEntity.ok(peliculaService.importarPeliculaTmdb(tmdbId));
    }

    @PatchMapping(value = "/{id}/upload-video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PeliculaResponse> uploadVideo(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request si no hay archivo
        }

        return ResponseEntity.ok(peliculaService.subirVideo(id, file));
    }





}
