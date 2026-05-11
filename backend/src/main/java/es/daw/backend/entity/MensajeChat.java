package es.daw.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_chat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensajeChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String texto;

    @Column(name = "fecha_envio", nullable = false)
    private LocalDateTime fechaEnvio;

    //true es admin; false es user
    @Column(name = "es_admin", nullable = false)
    private boolean esAdmin;

    @Column(name = "leido", nullable = false)
    @Builder.Default
    private boolean leido = false;

    //cada user tirene su conversación
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}