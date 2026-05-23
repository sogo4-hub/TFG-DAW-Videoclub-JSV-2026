package es.daw.backend.controller;

import es.daw.backend.dto.MensajeChatDTO;
import es.daw.backend.service.MensajeChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class MensajeChatController {

    private final MensajeChatService mensajeChatService;

    // el user ve su historial de mensajes
    @GetMapping("/historial")
    public ResponseEntity<List<MensajeChatDTO>> obtenerHistorial() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(mensajeChatService.obtenerHistorial(email));
    }

    // guardar un mensaje
    @PostMapping("/mensaje")
    public ResponseEntity<MensajeChatDTO> guardarMensaje(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String texto = body.get("texto");
        return ResponseEntity.ok(mensajeChatService.guardarMensajeUsuario(email, texto));
    }

    // guardar respuesta admin
    @PostMapping("/respuesta")
    public ResponseEntity<MensajeChatDTO> guardarRespuesta(@RequestBody Map<String, String> body) {
        String emailUsuario = body.get("emailUsuario");
        String texto = body.get("texto");
        return ResponseEntity.ok(mensajeChatService.guardarRespuestaAdmin(emailUsuario, texto));
    }

    // admin ve todas las conversaciones de los users
    @GetMapping("/conversaciones")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, List<MensajeChatDTO>>> obtenerTodasLasConversaciones() {
        return ResponseEntity.ok(mensajeChatService.obtenerTodasLasConversaciones());
    }

    // marcar conversación como leída
    @PatchMapping("/leido/{emailUsuario}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> marcarComoLeidos(@PathVariable String emailUsuario) {
        mensajeChatService.marcarComoLeidos(emailUsuario);
        return ResponseEntity.ok().build();
    }
}