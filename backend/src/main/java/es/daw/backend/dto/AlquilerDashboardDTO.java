package es.daw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlquilerDashboardDTO {
    private Long id;
    private String usuarioNombre;
    private String usuarioEmail;
    private String peliculaTitulo;
    private String fechaInicio;
    private String fechaFin;
}