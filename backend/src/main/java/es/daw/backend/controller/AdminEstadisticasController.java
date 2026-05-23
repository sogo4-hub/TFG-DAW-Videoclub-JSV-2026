package es.daw.backend.controller;

import es.daw.backend.dto.PeliculaStatsDTO;
import es.daw.backend.service.EstadisticasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")

public class AdminEstadisticasController {

    @Autowired
    private EstadisticasService estadisticasService;

    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PeliculaStatsDTO>> getEstadisticasPeliculas() {
        List<PeliculaStatsDTO> stats = estadisticasService.obtenerRendimientoCatalogo();
        return ResponseEntity.ok(stats);
    }
}