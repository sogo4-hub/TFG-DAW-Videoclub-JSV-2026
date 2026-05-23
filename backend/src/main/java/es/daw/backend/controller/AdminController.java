package es.daw.backend.controller;

import es.daw.backend.dto.PeliculaStatsDTO;
import es.daw.backend.dto.UsuarioDashboardDTO;
import es.daw.backend.entity.Alquiler;
import es.daw.backend.repository.AlquilerRepository;
import es.daw.backend.repository.PeliculaRepository;
import es.daw.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PeliculaRepository peliculaRepository;

    @Autowired
    private AlquilerRepository alquilerRepository;

    @GetMapping("/dashboard-usuarios")
    public ResponseEntity<List<UsuarioDashboardDTO>> getUsuariosDashboard() {
        // 1. Traemos la lista de usuarios reales de la base de datos
        List<es.daw.backend.entity.Usuario> usuarios = usuarioRepository.obtenerTodosLosUsuariosParaDashboard();

        // 2. Los transformamos a tu objeto UsuarioDashboardDTO usando streams de Java
        List<UsuarioDashboardDTO> dtos = usuarios.stream().map(u -> {
            // Buscamos cuántos alquileres tiene este usuario concreto en el historial
            long totalAlquileres = alquilerRepository.findAll().stream()
                    .filter(alquiler -> alquiler.getUsuario().getId().equals(u.getId()))
                    .count();

            LocalDateTime fechaSimulada = LocalDateTime.now();

            return new UsuarioDashboardDTO(
                    u.getId(),
                    u.getNombre(),
                    u.getEmail(),
                    fechaSimulada,
                    totalAlquileres);
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/alquileres")
    public ResponseEntity<List<es.daw.backend.dto.AlquilerDashboardDTO>> obtenerTodosLosAlquileres() {
        // 1. Traemos las entidades de la base de datos de forma limpia
        List<Alquiler> alquileres = alquilerRepository.findAll();

        // 2. Mapeamos manualmente a un dto plano y seguro para transferir por HTTP
        List<es.daw.backend.dto.AlquilerDashboardDTO> dtos = alquileres.stream().map(a -> {
            String nombre = (a.getUsuario() != null) ? a.getUsuario().getNombre() : "Usuario Eliminado";
            String email = (a.getUsuario() != null) ? a.getUsuario().getEmail() : "---";
            String titulo = (a.getPelicula() != null) ? a.getPelicula().getTitulo() : "Película Eliminada";

            String inicioStr = (a.getFechaInicio() != null) ? a.getFechaInicio().toString() : "";
            String finStr = (a.getFechaFin() != null) ? a.getFechaFin().toString() : "";

            return new es.daw.backend.dto.AlquilerDashboardDTO(
                    a.getId(),
                    nombre,
                    email,
                    titulo,
                    inicioStr,
                    finStr);
        }).toList();

        return ResponseEntity.ok(dtos);
    }
}