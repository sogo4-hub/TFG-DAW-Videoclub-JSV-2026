package es.daw.backend.controller;

import es.daw.backend.dto.CalificacionDTO;
import es.daw.backend.dto.CalificacionesResponse;
import es.daw.backend.entity.Usuario;
import es.daw.backend.service.CalificacionService;
import es.daw.backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import es.daw.backend.entity.Calificacion;

@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {

    private final CalificacionService calificacionService;
    private final UsuarioRepository usuarioRepository;

    public CalificacionController(CalificacionService calificacionService, UsuarioRepository usuarioRepository) {
        this.calificacionService = calificacionService;
        this.usuarioRepository = usuarioRepository;
    }

    // 1. Guardar o modificar una nota
    @PostMapping
    public ResponseEntity<?> guardarCalificacion(@RequestBody CalificacionDTO dto, Principal principal) {
        String email = principal.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        dto.setUsuarioId(usuario.getId());
        calificacionService.guardarOActualizar(dto);

        return ResponseEntity.ok("Calificación guardada");
    }

    // 2. Obtener el promedio y total de una película
    @GetMapping("/pelicula/{peliculaId}")
    public ResponseEntity<CalificacionesResponse> getCalificacionesPelicula(@PathVariable Long peliculaId) {
        return ResponseEntity.ok(calificacionService.getResumenPelicula(peliculaId));
    }

    // 3. Verificar si puede votar
    @GetMapping("/usuario/{usuarioId}/pelicula/{peliculaId}/verificado")
    public ResponseEntity<Boolean> verificarPermisoVoto(
            @PathVariable Long usuarioId,
            @PathVariable Long peliculaId) {

        boolean puedeVotar = calificacionService.usuarioHaVistoPelicula(usuarioId, peliculaId);
        return ResponseEntity.ok(puedeVotar);
    }

    @GetMapping("/mis-valoraciones")
    public ResponseEntity<List<Calificacion>> obtenerMisValoraciones(Principal principal) {
        String email = principal.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Calificacion> valoraciones = calificacionService.obtenerValoracionesUsuario(usuario.getId());

        return ResponseEntity.ok(valoraciones);
    }
}