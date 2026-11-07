package es.daw.backend.service;

import es.daw.backend.entity.Calificacion;
import es.daw.backend.entity.CalificacionId;
import es.daw.backend.dto.CalificacionDTO;
import es.daw.backend.dto.CalificacionesResponse;
import es.daw.backend.repository.AlquilerRepository;
import es.daw.backend.repository.CalificacionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Service
public class CalificacionService {

    private final CalificacionRepository repository;
    private final AlquilerRepository alquilerRepository;

    public CalificacionService(CalificacionRepository repository, AlquilerRepository alquilerRepository) {
        this.repository = repository;
        this.alquilerRepository = alquilerRepository;
    }

    public void guardarOActualizar(CalificacionDTO dto) {
        // 1. Seguridad en Backend: Validar que el usuario realmente tiene derecho a
        // votar
        if (!usuarioHaVistoPelicula(dto.getUsuarioId(), dto.getPeliculaId())) {
            throw new IllegalArgumentException("No puedes calificar una película que no has alquilado o visto.");
        }

        // 2. Validar paso de 0.5 (Multiplicar por 2 no debe dejar decimales)
        if ((dto.getNota() * 2) % 1 != 0) {
            throw new IllegalArgumentException("La calificación debe ser en pasos de 0.5 (ej: 4.0, 4.5)");
        }

        CalificacionId id = new CalificacionId(dto.getUsuarioId(), dto.getPeliculaId());

        // Si ya existe, actualizamos la nota y la fecha
        Calificacion calificacion = repository.findById(id)
                .orElseGet(() -> {
                    Calificacion nueva = new Calificacion();
                    nueva.setId(id);
                    return nueva;
                });

        calificacion.setNota(dto.getNota());
        calificacion.setFechaCalificacion(LocalDateTime.now());

        repository.save(calificacion);
    }

    public CalificacionesResponse getResumenPelicula(Long peliculaId) {
        Double media = repository.getNotaMediaByPeliculaId(peliculaId);
        Long total = repository.countByPeliculaId(peliculaId);
        return new CalificacionesResponse(peliculaId, media, total);
    }

    // Comprueba si un usuario ha visto/alquilado una película.
    public boolean usuarioHaVistoPelicula(Long usuarioId, Long peliculaId) {
        System.out.println("DEBUG: Validando usuarioID: " + usuarioId + " y peliculaID: " + peliculaId);

        boolean existe = alquilerRepository.usuarioPuedeValorar(usuarioId, peliculaId);

        System.out.println("DEBUG: ¿Se encontró alquiler? " + existe);
        return existe;
    }

    public List<Calificacion> obtenerValoracionesUsuario(Long usuarioId) {
        return repository.findByIdUsuarioId(usuarioId);
    }
}