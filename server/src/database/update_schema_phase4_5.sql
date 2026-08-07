-- =============================================
-- FASE 4 & 5: Tablas de Casos y Movimientos
-- =============================================

USE `alianza_salud`;

-- ---------------------------------------------
-- Tabla: cases
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS `cases` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_code` VARCHAR(50) NOT NULL UNIQUE,
  `verification_code` VARCHAR(8) NOT NULL UNIQUE,
  `client_name` VARCHAR(150) NOT NULL,
  `client_email` VARCHAR(120) NOT NULL,
  `client_phone` VARCHAR(30) NULL,
  `user_id` INT NULL,
  `service_slug` VARCHAR(100) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('pending', 'in_progress', 'closed') NOT NULL DEFAULT 'pending',
  `stage` VARCHAR(100) NOT NULL DEFAULT 'Evaluación Inicial',
  `assigned_lawyer_name` VARCHAR(150) NULL DEFAULT 'Equipo Jurídico Alianza Salud',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Tabla: case_updates (Novedades / Movimientos)
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS `case_updates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `created_by_name` VARCHAR(150) NOT NULL DEFAULT 'Administración',
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `stage_name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
