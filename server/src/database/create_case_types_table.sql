USE `alianza_salud`;

CREATE TABLE IF NOT EXISTS `case_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `case_types` (`name`, `description`) VALUES
('Lesión por Accidente de Tránsito (SOAT)', 'Casos vinculados a siniestros viales y cobertura SOAT'),
('Enfermedad o Accidente de Trabajo / Laboral (ARL)', 'Casos derivados de riesgos laborales y dictámenes ARL'),
('Negligencia Médica o Secuela Quirúrgica', 'Casos por presunta mala praxis o fallas asistenciales'),
('Lesión por Responsabilidad Civil / Terceros', 'Daños corporales generados por terceros o accidentes generales'),
('Secuela Traumatológica / Incapacidad Permanente', 'Evaluaciones por incapacidad permanente parcial o total'),
('Valoración de Estado Secuelar / Daño Corporal', 'Dictámenes integrales sobre baremos de daño corporal'),
('Otro Tipo de Lesión / Secuela', 'Casos periciales con requerimientos especiales');
