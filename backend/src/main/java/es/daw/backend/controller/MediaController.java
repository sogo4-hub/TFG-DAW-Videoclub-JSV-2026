package es.daw.backend.controller;

import es.daw.backend.entity.Pelicula;
import es.daw.backend.exception.PeliculaNoAlquiladaException;
import es.daw.backend.repository.PeliculaRepository;
import es.daw.backend.service.AlquilerService;
import es.daw.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;
    private final AlquilerService alquilerService;
    private final PeliculaRepository peliculaRepository;

    // ✅ SOPORTA AMBAS RUTAS: La nueva para streaming y la antigua/pública para imágenes
    @GetMapping({"/stream/{id}", "/{id}"})
    public ResponseEntity<Resource> getMedia(@PathVariable String id) {
        // 1. Identificar al usuario desde el Token
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Determinar si el recurso es un vídeo buscando en el catálogo SQL
        Optional<Pelicula> peliculaOpt = peliculaRepository.findAll().stream()
                .filter(p -> p.getUrlVideo() != null && p.getUrlVideo().endsWith("/" + id))
                .findFirst();

        // 3. Si es un vídeo, aplicar el filtro de seguridad de alquileres
        if (peliculaOpt.isPresent()) {
            Pelicula pelicula = peliculaOpt.get();
        // --- COMENTAR ESTE BLOQUE TEMPORALMENTE PARA DESABILITAR LA COMPROBACIÓN DE ALQUILERES ---
            if (email.equals("anonymousUser") || !alquilerService.esAlquilerValido(email, pelicula.getId())) {
                // Lanzamos la excepción con un mensaje descriptivo
                throw new PeliculaNoAlquiladaException("No tienes un alquiler activo para la película: " + pelicula.getTitulo());
            }
        // --------------------------------------------------------

            // Si el código llega aquí, es un vídeo y tiene permiso
            Resource resource = mediaService.descargarArchivo(id);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("video/mp4"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(resource);
        }

        // 4. Si no se encontró en 'url_video', asumimos que es una imagen (cartel)
        // Las imágenes son públicas para que el catálogo se vea bonito siempre
        Resource resource = mediaService.descargarArchivo(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}