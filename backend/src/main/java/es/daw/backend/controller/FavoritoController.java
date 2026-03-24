package es.daw.backend.controller;

import es.daw.backend.entity.Pelicula;
import es.daw.backend.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    @GetMapping
    public ResponseEntity<List<Pelicula>> listar() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(favoritoService.listarFavoritos(email));
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> toggle(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(favoritoService.toggleFavorito(email, id));
    }
}