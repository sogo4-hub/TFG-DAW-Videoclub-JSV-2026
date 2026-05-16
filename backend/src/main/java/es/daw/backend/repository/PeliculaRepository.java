package es.daw.backend.repository;

import es.daw.backend.entity.Pelicula;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    boolean existsByTmdbId(Long tmdbId);

    // con paginación hay q pasar los textos del filtrado y busqueda la back, hay q meterle un método---------
    Page<Pelicula> findByTituloContainingIgnoreCaseAndGeneroContainingIgnoreCase(
            String titulo,
            String genero,
            Pageable pageable);
}
