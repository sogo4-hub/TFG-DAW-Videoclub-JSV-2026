package es.daw.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

//dto para enviar o recibir mensajes del chat
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MensajeChatDTO {
    private Long id;
    private String texto;
    private LocalDateTime fechaEnvio;
    private boolean esAdmin;
    private boolean leido;
    private String nombreUsuario; //pa q el admin sepa quién escribió
    private String emailUsuario;  //pa q vea a qn responder
}