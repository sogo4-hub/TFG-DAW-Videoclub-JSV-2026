package es.daw.backend.service;

import es.daw.backend.dto.PeliculaStatsDTO;
import es.daw.backend.repository.PeliculaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EstadisticasService {

    @Autowired
    private PeliculaRepository peliculaRepository;

    @Transactional(readOnly = true)
    public List<PeliculaStatsDTO> obtenerRendimientoCatalogo() {
        return peliculaRepository.obtenerEstadisticasPeliculas();
    }
}