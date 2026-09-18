CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event VARCHAR(80) NOT NULL,
  actor_user_id INT NULL,
  actor_role VARCHAR(40) NULL,
  resource_type VARCHAR(60) NULL,
  resource_id VARCHAR(100) NULL,
  result VARCHAR(30) NOT NULL,
  request_id VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_event_created (event, created_at),
  INDEX idx_audit_actor_created (actor_user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
