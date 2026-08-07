-- =============================================
-- MAESTROS: Clientes, Abogados/Médicos, Casos
-- =============================================

USE `alianza_salud`;

-- ---------------------------------------------
-- Tabla: clients (Maestro de Clientes)
-- Contiene el Código de Verificación de 8 Caracteres por Cliente
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NULL,
  `document_id` VARCHAR(30) NULL,
  `address` VARCHAR(200) NULL,
  `verification_code` VARCHAR(8) NOT NULL UNIQUE,
  `user_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Tabla: lawyers (Maestro de Abogados y Especialistas)
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS `lawyers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NULL,
  `specialty` VARCHAR(100) NOT NULL DEFAULT 'Derecho Médico',
  `role_type` ENUM('lawyer', 'medical_specialist') NOT NULL DEFAULT 'lawyer',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
