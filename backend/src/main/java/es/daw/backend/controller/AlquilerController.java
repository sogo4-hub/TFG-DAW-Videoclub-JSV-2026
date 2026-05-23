package es.daw.backend.controller;

import es.daw.backend.dto.AlquilerResponseDTO;
import es.daw.backend.entity.Pelicula;
import es.daw.backend.service.AlquilerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alquileres")
@RequiredArgsConstructor
public class AlquilerController {

    private final AlquilerService alquilerService;

    @GetMapping
    public ResponseEntity<List<AlquilerResponseDTO>> misAlquileres() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(alquilerService.listarAlquileresActivos(email));
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> alquilar(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(alquilerService.alquilar(email, id));
    }

    @DeleteMapping("/{peliculaId}")
    public ResponseEntity<Map<String, String>> cancelarAlquiler(
            @PathVariable Long peliculaId,
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName(); //--extraer email del token jwt
        alquilerService.cancelarAlquiler(email, peliculaId);

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Alquiler cancelado correctamente");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{peliculaId}/reproducir")
    public ResponseEntity<Void> marcarReproducida(@PathVariable Long peliculaId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        alquilerService.marcarComoReproducida(email, peliculaId);
        return ResponseEntity.ok().build();
    }
}
