-- Actualización de esquema para la profesionalización de almacenamiento de documentos
ALTER TABLE `documents`
  ADD COLUMN IF NOT EXISTS `storage_key` VARCHAR(512) NULL AFTER `file_path`,
  ADD COLUMN IF NOT EXISTS `checksum` CHAR(64) NULL AFTER `storage_key`;
