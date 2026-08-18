USE `alianza_salud`;

CREATE TABLE IF NOT EXISTS `case_lawyers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `case_id` INT NOT NULL,
  `lawyer_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lawyer_id`) REFERENCES `lawyers`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_case_lawyer` (`case_id`, `lawyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `case_lawyers` (case_id, lawyer_id)
SELECT id, lawyer_id FROM cases WHERE lawyer_id IS NOT NULL;
