package es.daw.backend.repository;

import es.daw.backend.entity.Calificacion;
import es.daw.backend.entity.CalificacionId;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, CalificacionId> {

    @Query("SELECT AVG(c.nota) FROM Calificacion c WHERE c.id.peliculaId = :peliculaId")
    Double getNotaMediaByPeliculaId(Long peliculaId);

    @Query("SELECT COUNT(c) FROM Calificacion c WHERE c.id.peliculaId = :peliculaId")
    Long countByPeliculaId(Long peliculaId);

    boolean existsById(CalificacionId id);

    List<Calificacion> findByIdUsuarioId(Long usuarioId);
}