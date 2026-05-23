package es.daw.backend.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
@Embeddable
public class CalificacionId implements Serializable {

    private Long usuarioId;
    private Long peliculaId;

    public CalificacionId() {}

    public CalificacionId(Long usuarioId, Long peliculaId) {
        this.usuarioId = usuarioId;
        this.peliculaId = peliculaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getPeliculaId() {
        return peliculaId;
    }

    public void setPeliculaId(Long peliculaId) {
        this.peliculaId = peliculaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CalificacionId)) return false;

        CalificacionId that = (CalificacionId) o;

        return Objects.equals(usuarioId, that.usuarioId)
                && Objects.equals(peliculaId, that.peliculaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, peliculaId);
    }
}