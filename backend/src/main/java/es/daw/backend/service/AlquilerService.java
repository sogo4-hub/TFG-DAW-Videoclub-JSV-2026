package es.daw.backend.service;

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

    public List<Pelicula> listarAlquileresActivos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        // Devolvemos solo los alquileres cuya fecha_fin sea mayor a "ahora"
        return alquilerRepository.findByUsuario(usuario)
                .stream()
                .filter(a -> a.getFechaFin().isAfter(LocalDateTime.now()))
                .map(Alquiler::getPelicula)
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
                .fechaFin(LocalDateTime.now().plusHours(48)) // Asignamos 48 horas de alquiler
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
            Alquiler alquiler = activo.get();
            // 2. MAGIA DE ARQUITECTURA: En vez de borrar, "caducamos" el alquiler instantáneamente
            alquiler.setFechaFin(LocalDateTime.now());
            alquilerRepository.save(alquiler);
        } else {
            // ✅ USAMOS NUESTRA EXCEPCIÓN PERSONALIZADA
            throw new AlquilerNoActivoException("No tienes un alquiler activo para esta película.");
        }
    }

}
