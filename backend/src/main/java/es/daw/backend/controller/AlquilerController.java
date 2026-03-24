package es.daw.backend.controller;

import es.daw.backend.entity.Pelicula;
import es.daw.backend.service.AlquilerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alquileres")
@RequiredArgsConstructor
public class AlquilerController {

    private final AlquilerService alquilerService;

    @GetMapping
    public ResponseEntity<List<Pelicula>> misAlquileres() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(alquilerService.listarAlquileresActivos(email));
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> alquilar(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(alquilerService.alquilar(email, id));
    }
}
