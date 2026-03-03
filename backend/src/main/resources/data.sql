-- Usuario Admin (Contraseña: admin123)
INSERT INTO usuarios (email, password, rol)
VALUES ('nuevo_admin@streamflix.es', '$2a$10$tTPdzbYnEcqcwjLsoXqYU.ygPwl4AmqB91.tUn4U1oIdelB1FQw6.', 'ADMIN');

-- Usuario Normal (Contraseña: user123)
INSERT INTO usuarios (email, password, rol)
VALUES ('estudiante_tfg@streamflix.es', '$2a$10$SYsrYhjSfgC5FeucZO4vM.OobcBeuimSVaK8yAwBs3nLF4H82xSHm', 'USER');

-- Película de prueba inicial
INSERT INTO peliculas (titulo, sinopsis, director, anio, genero, url_imagen)
VALUES ('Interstellar',
        'Un equipo de exploradores viaja a través de un agujero de gusano.',
        'Christopher Nolan',
        2014,
        'Ciencia Ficción',
        'https://m.media-amazon.com/images/I/A1JVqNMI7UL._AC_SY679_.jpg');