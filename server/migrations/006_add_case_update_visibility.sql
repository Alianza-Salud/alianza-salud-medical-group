ALTER TABLE case_updates
  ADD COLUMN visible_to_client TINYINT(1) NOT NULL DEFAULT 1 AFTER stage_name,
  ADD INDEX idx_case_updates_case_visibility (case_id, visible_to_client);
