package es.daw.backend.repository;

import es.daw.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);

@Query("SELECT u FROM Usuario u")
    List<Usuario> obtenerTodosLosUsuariosParaDashboard();
}