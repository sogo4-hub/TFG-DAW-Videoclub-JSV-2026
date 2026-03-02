package es.daw.backend.dto;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String email;
    private String password;
    private String rol;
}
