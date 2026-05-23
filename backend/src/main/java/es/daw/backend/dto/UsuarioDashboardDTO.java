package es.daw.backend.dto;

import java.time.LocalDateTime;

public class UsuarioDashboardDTO {

    private Long id;
    private String nombre;
    private String email;
    private LocalDateTime  fechaRegistro;
    private Long totalAlquileres;

    // 1. Constructor vacío (Obligatorio para que Jackson pueda transformarlo a JSON sin quejas)
    public UsuarioDashboardDTO() {
    }

    // 2. Constructor completo (El que mapea en orden los campos de la query JPQL)
    public UsuarioDashboardDTO(Long id, String nombre, String email, LocalDateTime  fechaRegistro, Long totalAlquileres) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.fechaRegistro = fechaRegistro;
        this.totalAlquileres = totalAlquileres;
    }

    // 3. Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime  fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Long getTotalAlquileres() {
        return totalAlquileres;
    }

    public void setTotalAlquileres(Long totalAlquileres) {
        this.totalAlquileres = totalAlquileres;
    }
}