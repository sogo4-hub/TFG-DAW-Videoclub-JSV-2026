package es.daw.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "calificaciones")
public class Calificacion implements Serializable {

    @EmbeddedId
    private CalificacionId id;

    @Column(nullable = false)
    @Min(0)
    @Max(5)
    private Double nota;

    @Column(name = "fecha_calificacion")
    private LocalDateTime fechaCalificacion = LocalDateTime.now();

    public Calificacion() {}

    public Calificacion(CalificacionId id, Double nota) {
        this.id = id;
        this.nota = nota;
    }

    public CalificacionId getId() {
        return id;
    }

    public void setId(CalificacionId id) {
        this.id = id;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public LocalDateTime getFechaCalificacion() {
        return fechaCalificacion;
    }

    public void setFechaCalificacion(LocalDateTime fechaCalificacion) {
        this.fechaCalificacion = fechaCalificacion;
    }
}