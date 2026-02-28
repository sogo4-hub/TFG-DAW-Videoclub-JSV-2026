package es.daw.backend.dto;
//Para el formulario de registro
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String rol; // Por defecto será "USER"
}
