package es.daw.backend.dto;
//Para el formulario de registro
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String nombre; // <--- NUEVO
    private String email;
    private String password;
    private Boolean noticias; // <--- NUEVO: Lo capturamos (aunque no lo guardemos en BD de momento)
    private String recaptchaToken; // <--- NUEVO: Lo capturamos para evitar errores
}
