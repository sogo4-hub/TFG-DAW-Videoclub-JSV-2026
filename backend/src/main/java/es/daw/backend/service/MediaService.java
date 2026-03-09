package es.daw.backend.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
//Este servicio se encargará exclusivamente de hablar con MongoDB
// para guardar y recuperar los archivos binarios.
public class MediaService {

    private final GridFsTemplate gridFsTemplate;

    // Guarda el archivo en MongoDB y devuelve su ID único
    public String guardarArchivo(MultipartFile archivo) throws IOException {
        Object fileId = gridFsTemplate.store(
                archivo.getInputStream(),
                archivo.getOriginalFilename(),
                archivo.getContentType()
        );
        return fileId.toString();
    }

    // Recupera el archivo de MongoDB usando su ID
    public GridFsResource descargarArchivo(String id) {
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        return gridFsTemplate.getResource(file);
    }

    // NUEVO MÉTODO: Elimina el archivo de MongoDB
    public void eliminarArchivo(String id) {
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(id)));
    }
}
