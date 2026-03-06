package es.daw.backend.mapper;

import es.daw.backend.dto.UsuarioRequest;
import es.daw.backend.dto.UsuarioResponse;
import es.daw.backend.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponse toResponseDTO(Usuario usuario) {
        if (usuario == null) return null;
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre()) // <--- OPCIONAL: Puedes añadirlo al response también si quieres
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build();
    }

    public Usuario toEntity(UsuarioRequest dto) {
        if (dto == null) return null;
        return Usuario.builder()
                .nombre(dto.getNombre()) // <--- NUEVO: Mapeamos el nombr
                .email(dto.getEmail())
                .password(dto.getPassword())
                .rol(dto.getRol())
                .build();
    }
}
