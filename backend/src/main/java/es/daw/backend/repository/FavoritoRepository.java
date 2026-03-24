package es.daw.backend.repository;

import es.daw.backend.entity.Favorito;
import es.daw.backend.entity.Pelicula;
import es.daw.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuario(Usuario usuario);
    Optional<Favorito> findByUsuarioAndPelicula(Usuario usuario, Pelicula pelicula);
}
