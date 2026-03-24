package es.daw.backend.repository;

import es.daw.backend.entity.Alquiler;
import es.daw.backend.entity.Pelicula;
import es.daw.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {
    List<Alquiler> findByUsuario(Usuario usuario);

    // Magia de Spring Boot: Busca si hay un alquiler de este usuario para esta peli que aún no haya caducado
    Optional<Alquiler> findByUsuarioAndPeliculaAndFechaFinAfter(Usuario usuario, Pelicula pelicula, LocalDateTime fechaActual);
}
