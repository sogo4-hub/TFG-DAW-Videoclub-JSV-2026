package es.daw.backend.controller;

import es.daw.backend.dto.UsuarioResponse;
import es.daw.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios") // ✅ Nueva ruta base para usuarios normales
@RequiredArgsConstructor
public class UserProfileController {

    private final UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> obtenerPerfil(Authentication authentication) {
        // authentication.getName() extrae automáticamente el email del Token JWT
        String email = authentication.getName();
        return ResponseEntity.ok(usuarioService.obtenerPorEmail(email));
    }
}
