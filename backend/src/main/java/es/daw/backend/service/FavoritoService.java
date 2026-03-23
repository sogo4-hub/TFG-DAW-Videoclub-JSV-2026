package es.daw.backend.service;

import es.daw.backend.entity.Favorito;
import es.daw.backend.entity.Pelicula;
import es.daw.backend.entity.Usuario;
import es.daw.backend.repository.FavoritoRepository;
import es.daw.backend.repository.PeliculaRepository;
import es.daw.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PeliculaRepository peliculaRepository;

    public List<Pelicula> listarFavoritos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return favoritoRepository.findByUsuario(usuario)
                .stream()
                .map(Favorito::getPelicula)
                .collect(Collectors.toList());
    }

    @Transactional
    public String toggleFavorito(String email, Long idPelicula) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Pelicula pelicula = peliculaRepository.findById(idPelicula).orElseThrow();

        Optional<Favorito> existente = favoritoRepository.findByUsuarioAndPelicula(usuario, pelicula);

        if (existente.isPresent()) {
            favoritoRepository.delete(existente.get());
            return "Eliminado de favoritos";
        } else {
            Favorito nuevo = Favorito.builder()
                    .usuario(usuario)
                    .pelicula(pelicula)
                    .fechaAgregado(LocalDateTime.now())
                    .build();
            favoritoRepository.save(nuevo);
            return "Añadido a favoritos";
        }
    }
}
