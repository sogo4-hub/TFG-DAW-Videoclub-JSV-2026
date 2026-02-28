package es.daw.backend.dto;
//Lo que el servidor devuelve: el Token
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
}
