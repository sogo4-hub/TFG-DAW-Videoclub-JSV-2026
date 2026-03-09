-- Usuario Admin (Contraseña: admin123)
-- AÑADIMOS 'nombre' a la lista de columnas (antes faltaba)
INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Admin Principal', 'nuevo_admin@streamflix.es', '$2a$10$tTPdzbYnEcqcwjLsoXqYU.ygPwl4AmqB91.tUn4U1oIdelB1FQw6.', 'ADMIN');

-- Usuario Normal (Contraseña: user123)
-- AÑADIMOS 'nombre' a la lista de columnas (antes faltaba)
INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Estudiante TFG', 'estudiante_tfg@streamflix.es', '$2a$10$SYsrYhjSfgC5FeucZO4vM.OobcBeuimSVaK8yAwBs3nLF4H82xSHm', 'USER');