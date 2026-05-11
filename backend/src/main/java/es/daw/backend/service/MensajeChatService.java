package es.daw.backend.service;

import es.daw.backend.dto.MensajeChatDTO;
import es.daw.backend.entity.MensajeChat;
import es.daw.backend.entity.Usuario;
import es.daw.backend.repository.MensajeChatRepository;
import es.daw.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MensajeChatService {

    /*
     * guardarMensajeUsuario → guarda un mensaje del usuario en H2
     * guardarRespuestaAdmin → guarda la respuesta del admin
     * obtenerHistorial → devuelve todos los mensajes de una conversación ordenados
     * por fecha
     * obtenerTodasLasConversaciones → para el admin, devuelve todas las
     * conversaciones agrupadas por usuario
     * marcarComoLeidos → cuando el admin abre una conversación, marca los mensajes
     * como leídos
     */

    private final MensajeChatRepository mensajeChatRepository;
    private final UsuarioRepository usuarioRepository;

    private MensajeChatDTO toDTO(MensajeChat m) {
        return MensajeChatDTO.builder()
                .id(m.getId())
                .texto(m.getTexto())
                .fechaEnvio(m.getFechaEnvio())
                .esAdmin(m.isEsAdmin())
                .leido(m.isLeido())
                .nombreUsuario(m.getUsuario().getNombre())
                .emailUsuario(m.getUsuario().getEmail())
                .build();
    }

    // Guarda un mensaje del usuario
    @Transactional
    public MensajeChatDTO guardarMensajeUsuario(String email, String texto) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();

        MensajeChat mensaje = MensajeChat.builder()
                .texto(texto)
                .fechaEnvio(LocalDateTime.now())
                .esAdmin(false)
                .leido(false)
                .usuario(usuario)
                .build();

        return toDTO(mensajeChatRepository.save(mensaje));
    }

    // Guarda una respuesta del admin a un usuario concreto
    @Transactional
    public MensajeChatDTO guardarRespuestaAdmin(String emailUsuario, String texto) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario).orElseThrow();

        MensajeChat mensaje = MensajeChat.builder()
                .texto(texto)
                .fechaEnvio(LocalDateTime.now())
                .esAdmin(true)
                .leido(true) // Los mensajes del admin se marcan como leídos directamente
                .usuario(usuario)
                .build();

        return toDTO(mensajeChatRepository.save(mensaje));
    }

    // Obtiene el historial de mensajes de un usuario
    public List<MensajeChatDTO> obtenerHistorial(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return mensajeChatRepository.findByUsuarioOrderByFechaEnvioAsc(usuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Para el admin: obtiene todas las conversaciones agrupadas por usuario
    public Map<String, List<MensajeChatDTO>> obtenerTodasLasConversaciones() {
        return mensajeChatRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.groupingBy(MensajeChatDTO::getEmailUsuario));
    }

    // Marca los mensajes de un usuario como leídos cuando el admin abre la conversación
    @Transactional
    public void marcarComoLeidos(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario).orElseThrow();
        List<MensajeChat> mensajes = mensajeChatRepository.findByUsuarioOrderByFechaEnvioAsc(usuario);
        mensajes.forEach(m -> m.setLeido(true));
        mensajeChatRepository.saveAll(mensajes);
    }
}