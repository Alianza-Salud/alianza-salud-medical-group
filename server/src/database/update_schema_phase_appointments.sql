-- =============================================
-- AJUSTES EN CITAS Y MENSAJES DE CONTACTO
-- =============================================

USE `alianza_salud`;

-- Actualizar tabla appointments para asignar abogado y ampliar estados
ALTER TABLE `appointments`
  ADD COLUMN IF NOT EXISTS `assigned_lawyer_id` INT NULL AFTER `accepted_policy`,
  MODIFY COLUMN `status` ENUM('pending', 'approved', 'rejected', 'case_created') NOT NULL DEFAULT 'pending',
  ADD CONSTRAINT `fk_appointments_lawyer` FOREIGN KEY (`assigned_lawyer_id`) REFERENCES `lawyers`(`id`) ON DELETE SET NULL;

-- Actualizar tabla contacts para lectura y respuesta
ALTER TABLE `contacts`
  ADD COLUMN IF NOT EXISTS `is_read` TINYINT(1) NOT NULL DEFAULT 0 AFTER `message`,
  ADD COLUMN IF NOT EXISTS `responded` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_read`;
