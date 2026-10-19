const { pool } = require('../database/db');

async function recordAuditEvent(req, { event, resourceType = null, resourceId = null, result = 'success' }) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    actorUserId: req.user?.id || null,
    actorRole: req.user?.role || null,
    resourceType,
    resourceId: resourceId == null ? null : String(resourceId),
    result,
    requestId: req.id || null,
  };
  console.info(JSON.stringify(entry));
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO audit_logs
       (event, actor_user_id, actor_role, resource_type, resource_id, result, request_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [entry.event, entry.actorUserId, entry.actorRole, entry.resourceType, entry.resourceId, entry.result, entry.requestId]
    );
  } catch {
    // Database audit persistence becomes active after migration 005; never log request bodies or secrets here.
  }
}

module.exports = { recordAuditEvent };
