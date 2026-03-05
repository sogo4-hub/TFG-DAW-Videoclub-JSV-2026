-- Borramos la tabla si ya existe para evitar errores al reiniciar
DROP TABLE IF EXISTS usuarios, peliculas;

-- Creación de la tabla usuarios basada en la entidad Usuario.java
CREATE TABLE usuarios (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
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