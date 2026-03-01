-- Borramos la tabla si ya existe para evitar errores al reiniciar
DROP TABLE IF EXISTS usuarios;

-- Creación de la tabla usuarios basada en la entidad Usuario.java
CREATE TABLE usuarios (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          email VARCHAR(255) NOT NULL UNIQUE,
                          password VARCHAR(255) NOT NULL,
                          rol VARCHAR(50)
);