package es.daw.backend.repository;

import es.daw.backend.entity.MensajeChat;
import es.daw.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeChatRepository extends JpaRepository<MensajeChat, Long> {

    //obtiene todos los mensajes de la conversación de un usuario ordenados por fecha
    List<MensajeChat> findByUsuarioOrderByFechaEnvioAsc(Usuario usuario);

    //el service obtiene todos los usuarios que tienen mensajes (para el panel del admin)
}