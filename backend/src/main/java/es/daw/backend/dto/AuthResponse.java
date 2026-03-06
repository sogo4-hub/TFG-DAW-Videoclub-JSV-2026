package es.daw.backend.dto;
//Lo que el servidor devuelve: el Token
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String rol; // <--- NUEVO: Añadimos el rol para que el frontend lo lea
}
