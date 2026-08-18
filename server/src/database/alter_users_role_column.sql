USE `alianza_salud`;

-- Ampliar la columna role de ENUM a VARCHAR(50) para permitir 'auxiliar_admisiones' y nuevos roles
ALTER TABLE `users` MODIFY COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'client';
