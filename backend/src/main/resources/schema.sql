-- Borramos la tabla si ya existe para evitar errores al reiniciar
DROP TABLE IF EXISTS usuarios, peliculas;

-- Creación de la tabla usuarios basada en la entidad Usuario.java
CREATE TABLE usuarios (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          nombre VARCHAR(255) NOT NULL, -- <--- NUEVO CAMPO
                          email VARCHAR(255) NOT NULL UNIQUE,
                          password VARCHAR(255) NOT NULL,
                          rol VARCHAR(50)
);

-- Creación de la tabla peliculas
CREATE TABLE IF NOT EXISTS peliculas (
                                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         titulo VARCHAR(255) NOT NULL,
                                         sinopsis VARCHAR(1000),
                                         director VARCHAR(255),
                                         anio INT,
                                         genero VARCHAR(255),
                                         url_imagen VARCHAR(255),
                                         url_video VARCHAR(255)
);

-- Tabla para Favoritos
CREATE TABLE favoritos (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           usuario_id BIGINT NOT NULL,
                           pelicula_id BIGINT NOT NULL,
                           fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                           FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE,
                           UNIQUE(usuario_id, pelicula_id)
);

-- Tabla para Alquileres
CREATE TABLE alquileres (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            usuario_id BIGINT NOT NULL,
                            pelicula_id BIGINT NOT NULL,
                            fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            fecha_fin TIMESTAMP NOT NULL, -- Por ejemplo: fecha_inicio + 48 horas
                            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                            FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE
);