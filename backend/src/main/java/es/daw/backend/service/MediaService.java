package es.daw.backend.service;

import org.bson.types.ObjectId;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;

import java.io.IOException;

@Service
@RequiredArgsConstructor
// Este servicio se encargará exclusivamente de hablar con MongoDB
// para guardar y recuperar los archivos binarios.
public class MediaService {

    private final GridFsTemplate gridFsTemplate;

    // Guarda el archivo en MongoDB y devuelve su ID único
    public String guardarArchivo(MultipartFile archivo) throws IOException {
        Object fileId = gridFsTemplate.store(
                archivo.getInputStream(),
                archivo.getOriginalFilename(),
                archivo.getContentType());
        return fileId.toString();
    }

    // Recupera el archivo de MongoDB usando su ID
    public GridFsResource descargarArchivo(String id) {
        GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        return gridFsTemplate.getResource(file);
    }

    // NUEVO MÉTODO: Elimina el archivo de MongoDB


    public void eliminarArchivo(String id) {

        // 2. SOLUCIÓN: Convertir el String plano a un ObjectId de MongoDB
        ObjectId objectId = new ObjectId(id);

        // 3. Ejecutar el borrado utilizando el tipo de dato correcto
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(objectId)));
    }

    /**
     * Sube un archivo a MongoDB Atlas (GridFS) y devuelve el ID generado.
     */
    public String uploadFile(MultipartFile file) {
        try {
            // Guardamos el flujo de bytes en GridFS pasándole el nombre y el tipo
            ObjectId objectId = gridFsTemplate.store(
                    file.getInputStream(),
                    file.getOriginalFilename(),
                    file.getContentType());

            // Retornamos el ID generado por MongoDB convertido a String
            return objectId.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error crítico al subir el archivo a MongoDB Atlas: " + e.getMessage());
        }
    }
}
