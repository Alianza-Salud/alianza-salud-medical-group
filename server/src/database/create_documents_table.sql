USE `alianza_salud`;

DROP TABLE IF EXISTS `documents`;

CREATE TABLE `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'recibido',
  `description` TEXT NULL,
  `file_path` VARCHAR(500) NULL,
  `original_name` VARCHAR(255) NULL,
  `mime_type` VARCHAR(100) NULL,
  `file_size` INT NULL,
  `uploaded_by_name` VARCHAR(150) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'aprobado',
  `visible_to_client` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
