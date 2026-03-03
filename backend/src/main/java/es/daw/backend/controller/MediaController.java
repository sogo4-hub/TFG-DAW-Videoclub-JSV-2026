package es.daw.backend.controller;

import es.daw.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getMedia(@PathVariable String id) {
        // 1. Llamamos al servicio para recuperar los bytes de MongoDB
        Resource recurso = mediaService.descargarArchivo(id);

        // 2. Lo devolvemos con el tipo de contenido adecuado
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // O MediaType.parseMediaType(recurso.getContentType()) si quieres que sea dinámico
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline") // "inline" para que se vea en el navegador, no se descargue
                .body(recurso);
    }
}
