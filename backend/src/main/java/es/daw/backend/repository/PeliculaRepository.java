package es.daw.backend.repository;

import es.daw.backend.dto.PeliculaStatsDTO;
import es.daw.backend.entity.Pelicula;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {

    // 1. Necesario para la paginación y filtros de búsqueda del catálogo
    Page<Pelicula> findByTituloContainingIgnoreCaseAndGeneroContainingIgnoreCase(
            String titulo, String genero, Pageable pageable);

    // 2. Necesario para comprobar duplicados antes de importar de TMDB
    boolean existsByTmdbId(Long tmdbId);

    // 3. Tu consulta del Dashboard de administración (Sintaxis compatible con
    // Hibernate 6 y tu clase DTO)
    @Query("SELECT new es.daw.backend.dto.PeliculaStatsDTO(" +
            "p.id, STR(p.tmdbId), p.titulo, " +
            "(SELECT COUNT(f) FROM Favorito f WHERE f.pelicula.id = p.id), " +
            "(SELECT COUNT(a) FROM Alquiler a WHERE a.pelicula.id = p.id)) " +
            "FROM Pelicula p")
    List<PeliculaStatsDTO> obtenerEstadisticasPeliculas();
}