package es.daw.backend.service;

import es.daw.backend.dto.AlquilerResponseDTO;
import es.daw.backend.entity.Alquiler;
import es.daw.backend.entity.Pelicula;
import es.daw.backend.entity.Usuario;
import es.daw.backend.exception.AlquilerNoActivoException;
import es.daw.backend.repository.AlquilerRepository;
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
public class AlquilerService {

    private final AlquilerRepository alquilerRepository;
    private final UsuarioRepository usuarioRepository;
    private final PeliculaRepository peliculaRepository;

    public List<AlquilerResponseDTO> listarAlquileresActivos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return alquilerRepository.findByUsuario(usuario).stream()
                .filter(a -> a.getFechaFin().isAfter(LocalDateTime.now()))
                .map(a -> AlquilerResponseDTO.builder()
                        .pelicula(a.getPelicula())
                        .reproducida(a.isReproducida())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public String alquilar(String email, Long idPelicula) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Pelicula pelicula = peliculaRepository.findById(idPelicula).orElseThrow();

        // Comprobar si ya tiene un alquiler activo para evitar cobrar dos veces
        Optional<Alquiler> activo = alquilerRepository.findByUsuarioAndPeliculaAndFechaFinAfter(
                usuario, pelicula, LocalDateTime.now());

        if (activo.isPresent()) {
            return "La película ya está alquilada y activa.";
        }

        Alquiler nuevoAlquiler = Alquiler.builder()
                .usuario(usuario)
                .pelicula(pelicula)
                .fechaInicio(LocalDateTime.now())
                .fechaFin(LocalDateTime.now().plusHours(48)) // asignamos 48 horas de alquiler
                .build();

        alquilerRepository.save(nuevoAlquiler);
        return "Película alquilada con éxito por 48 horas.";
    }

    // Método que usaremos más adelante en el MediaController para bloquear el vídeo si no está alquilado
    public boolean esAlquilerValido(String email, Long idPelicula) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Pelicula pelicula = peliculaRepository.findById(idPelicula).orElseThrow();

        Optional<Alquiler> activo = alquilerRepository.findByUsuarioAndPeliculaAndFechaFinAfter(
                usuario, pelicula, LocalDateTime.now());
        return activo.isPresent();
    }

    @Transactional
    public void cancelarAlquiler(String email, Long idPelicula) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Pelicula pelicula = peliculaRepository.findById(idPelicula).orElseThrow();

        // 1. Buscamos si existe un alquiler ACTIVO en este momento
        Optional<Alquiler> activo = alquilerRepository.findByUsuarioAndPeliculaAndFechaFinAfter(
                usuario, pelicula, LocalDateTime.now());

        if (activo.isPresent()) {
            if (activo.get().isReproducida()) {
                throw new AlquilerNoActivoException("No puedes cancelar una película que ya has empezado a ver.");
            }
            Alquiler alquiler = activo.get();
            // En vez de borrar, caducamos el alquiler instantáneamente
            alquiler.setFechaFin(LocalDateTime.now());
            alquilerRepository.save(alquiler);
        } else {
            throw new AlquilerNoActivoException("No tienes un alquiler activo para esta película.");
        }
    }

    @Transactional
    public void marcarComoReproducida(String email, Long idPelicula) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Pelicula pelicula = peliculaRepository.findById(idPelicula).orElseThrow();

        Optional<Alquiler> activo = alquilerRepository.findByUsuarioAndPeliculaAndFechaFinAfter(
                usuario, pelicula, LocalDateTime.now());

        if (activo.isPresent()) {
            Alquiler alquiler = activo.get();
            alquiler.setReproducida(true);
            alquilerRepository.save(alquiler);
        }
    }

}
