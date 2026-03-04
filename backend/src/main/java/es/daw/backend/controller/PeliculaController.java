package es.daw.backend.controller;

import es.daw.backend.dto.PeliculaRequest;
import es.daw.backend.dto.PeliculaResponse;
import es.daw.backend.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService peliculaService;

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
}
