package es.daw.backend.dto;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombre; // <--- NUEVO: Añadimos el campo nombre
    private String email;
    private String password;
    private String rol;
}
