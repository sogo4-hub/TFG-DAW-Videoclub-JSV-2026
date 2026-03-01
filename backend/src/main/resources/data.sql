-- Usuario Admin (Contraseña: admin123)
INSERT INTO usuarios (email, password, rol)
VALUES ('admin@streamflix.es', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGzP1e2h9rPqwS5i2dJq', 'ADMIN');

-- Usuario Normal (Contraseña: user123)
INSERT INTO usuarios (email, password, rol)
VALUES ('victor@streamflix.es', '$2a$10$7XyH0m/FzQOa.R6d/9i10.eZ9LzN7t5Z/2X9e6B8J8y5A7V0V7/Vq', 'USER');