-- Aplicar una sola vez, después de un backup verificado.
ALTER TABLE clients
  ADD COLUMN verification_code_hash CHAR(64) NULL AFTER verification_code,
  ADD COLUMN verification_code_expires_at DATETIME NULL AFTER verification_code_hash,
  ADD COLUMN verification_code_used_at DATETIME NULL AFTER verification_code_expires_at,
  ADD COLUMN verification_attempts INT NOT NULL DEFAULT 0 AFTER verification_code_used_at,
  ADD INDEX idx_clients_verification_code_hash (verification_code_hash),
  MODIFY COLUMN verification_code VARCHAR(8) NULL;
ALTER TABLE cases MODIFY COLUMN verification_code VARCHAR(8) NULL;

-- Los códigos legacy permanecen temporalmente en verification_code para compatibilidad.
-- Deben reemitirse como códigos hasheados y luego limpiarse en una migración posterior.
