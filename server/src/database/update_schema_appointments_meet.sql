-- =============================================
-- MIGRACIÓN: Modalidad de Citas y Enlace a Google Meet
-- =============================================

USE `alianza_salud`;

-- Agregar columnas modality y meet_link si no existen
ALTER TABLE `appointments`
  ADD COLUMN IF NOT EXISTS `modality` ENUM('presencial', 'remota') NOT NULL DEFAULT 'presencial' AFTER `status`,
  ADD COLUMN IF NOT EXISTS `meet_link` VARCHAR(255) NULL AFTER `modality`;
