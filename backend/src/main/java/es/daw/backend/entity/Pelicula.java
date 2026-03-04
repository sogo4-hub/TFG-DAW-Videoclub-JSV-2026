package es.daw.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "peliculas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 1000)
    private String sinopsis;

    private String director;

    private int anio;

    private String genero;

    private String urlImagen;

    private String urlVideo;
}
