-- =============================================
-- FASE NOTIFICACIONES: Tablas de Configuración y Logs
-- =============================================

USE `alianza_salud`;

-- ---------------------------------------------
-- Tabla: notification_settings (Configuración por Evento)
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS `notification_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_type` VARCHAR(80) NOT NULL UNIQUE,
  `event_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(80) NOT NULL DEFAULT 'general',
  `send_to_client` TINYINT(1) NOT NULL DEFAULT 1,
  `send_to_admin` TINYINT(1) NOT NULL DEFAULT 1,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Tabla: notification_logs (Bitácora de Auditoría)
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS `notification_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_type` VARCHAR(80) NOT NULL,
  `recipient_email` VARCHAR(120) NOT NULL,
  `recipient_type` ENUM('client', 'admin') NOT NULL DEFAULT 'client',
  `subject` VARCHAR(200) NOT NULL,
  `status` ENUM('PENDING', 'SENT', 'FAILED', 'RETRYING') NOT NULL DEFAULT 'PENDING',
  `provider_message_id` VARCHAR(150) NULL,
  `related_client_id` INT NULL,
  `related_case_id` INT NULL,
  `error_message` TEXT NULL,
  `retry_count` INT NOT NULL DEFAULT 0,
  `sent_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`related_client_id`) REFERENCES `clients`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`related_case_id`) REFERENCES `cases`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Sembrado Inicial de Configuración de Eventos
-- ---------------------------------------------
INSERT INTO `notification_settings` (`event_type`, `event_name`, `category`, `send_to_client`, `send_to_admin`, `is_enabled`) VALUES
('CLIENT_CREATED', 'Creación / Registro de Cliente', 'clientes', 1, 0, 1),
('APPOINTMENT_REQUESTED', 'Solicitud de Cita en Página Pública', 'citas', 1, 1, 1),
('APPOINTMENT_CONFIRMED', 'Confirmación de Cita', 'citas', 1, 0, 1),
('APPOINTMENT_CANCELLED', 'Cancelación de Cita', 'citas', 1, 0, 1),
('PETITION_SUBMITTED', 'Solicitud de Revisión de Caso', 'revisiones', 1, 1, 1),
('CONTACT_SUBMITTED', 'Mensaje del Formulario de Contacto', 'contacto', 1, 1, 1),
('CASE_CREATED', 'Apertura de Nuevo Caso', 'expedientes', 1, 0, 1),
('CASE_UPDATED', 'Nueva Novedad en Expediente', 'expedientes', 1, 0, 1),
('DOCUMENT_UPLOADED', 'Nuevo Documento Disponible', 'documentos', 1, 0, 1),
('CASE_STAGE_CHANGED', 'Cambio de Etapa del Caso', 'expedientes', 1, 0, 1)
ON DUPLICATE KEY UPDATE `event_name` = VALUES(`event_name`);
