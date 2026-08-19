const { pool } = require('../database/db');

/**
 * Repositorio para la gestión de configuración y auditoría de notificaciones.
 */
class NotificationRepository {
  /**
   * Obtener todas las configuraciones de eventos de notificación.
   */
  async getSettings() {
    if (!pool) return [];
    try {
      const [rows] = await pool.query(
        'SELECT * FROM notification_settings ORDER BY category, id'
      );
      return rows;
    } catch (error) {
      console.error('[NotificationRepository.getSettings Error]:', error.message);
      return [];
    }
  }

  /**
   * Obtener la configuración de un evento específico.
   */
  async getSettingByEvent(eventType) {
    if (!pool) return null;
    try {
      const [rows] = await pool.query(
        'SELECT * FROM notification_settings WHERE event_type = ? LIMIT 1',
        [eventType]
      );
      return rows[0] || null;
    } catch (error) {
      console.error(`[NotificationRepository.getSettingByEvent Error]:`, error.message);
      return null;
    }
  }

  /**
   * Actualizar la configuración de notificaciones de un evento.
   */
  async updateSetting(eventType, { send_to_client, send_to_admin, is_enabled }) {
    if (!pool) return false;
    try {
      await pool.query(
        `UPDATE notification_settings 
         SET send_to_client = ?, send_to_admin = ?, is_enabled = ?, updated_at = CURRENT_TIMESTAMP
         WHERE event_type = ?`,
        [send_to_client ? 1 : 0, send_to_admin ? 1 : 0, is_enabled ? 1 : 0, eventType]
      );
      return true;
    } catch (error) {
      console.error(`[NotificationRepository.updateSetting Error]:`, error.message);
      return false;
    }
  }

  /**
   * Registrar un intento de envío en la bitácora de auditoría.
   */
  async createLog({ event_type, recipient_email, recipient_type, subject, status, provider_message_id, related_client_id, related_case_id, error_message }) {
    if (!pool) return null;
    try {
      const [result] = await pool.query(
        `INSERT INTO notification_logs 
         (event_type, recipient_email, recipient_type, subject, status, provider_message_id, related_client_id, related_case_id, error_message, sent_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event_type,
          recipient_email,
          recipient_type || 'client',
          subject,
          status || 'PENDING',
          provider_message_id || null,
          related_client_id || null,
          related_case_id || null,
          error_message || null,
          status === 'SENT' ? new Date() : null,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error('[NotificationRepository.createLog Error]:', error.message);
      return null;
    }
  }

  /**
   * Actualizar el estado de un registro de auditoría.
   */
  async updateLogStatus(logId, { status, provider_message_id, error_message, retry_count }) {
    if (!pool || !logId) return false;
    try {
      const updates = [];
      const values = [];

      if (status) {
        updates.push('status = ?');
        values.push(status);
        if (status === 'SENT') {
          updates.push('sent_at = CURRENT_TIMESTAMP');
        }
      }
      if (provider_message_id !== undefined) {
        updates.push('provider_message_id = ?');
        values.push(provider_message_id);
      }
      if (error_message !== undefined) {
        updates.push('error_message = ?');
        values.push(error_message);
      }
      if (retry_count !== undefined) {
        updates.push('retry_count = ?');
        values.push(retry_count);
      }

      if (updates.length === 0) return true;

      values.push(logId);
      await pool.query(
        `UPDATE notification_logs SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return true;
    } catch (error) {
      console.error('[NotificationRepository.updateLogStatus Error]:', error.message);
      return false;
    }
  }

  /**
   * Obtener registros de auditoría filtrados.
   */
  async getLogs({ status, recipient_email, event_type, limit = 50, offset = 0 }) {
    if (!pool) return { logs: [], total: 0 };
    try {
      let whereClause = 'WHERE 1=1';
      const params = [];

      if (status) {
        whereClause += ' AND status = ?';
        params.push(status);
      }
      if (recipient_email) {
        whereClause += ' AND recipient_email LIKE ?';
        params.push(`%${recipient_email}%`);
      }
      if (event_type) {
        whereClause += ' AND event_type = ?';
        params.push(event_type);
      }

      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM notification_logs ${whereClause}`,
        params
      );
      const total = countResult[0]?.total || 0;

      const [logs] = await pool.query(
        `SELECT * FROM notification_logs ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...params, parseInt(limit, 10), parseInt(offset, 10)]
      );

      return { logs, total };
    } catch (error) {
      console.error('[NotificationRepository.getLogs Error]:', error.message);
      return { logs: [], total: 0 };
    }
  }

  /**
   * Obtener notificaciones fallidas elegibles para reintento.
   */
  async getFailedLogs(maxRetries = 3) {
    if (!pool) return [];
    try {
      const [rows] = await pool.query(
        'SELECT * FROM notification_logs WHERE status = "FAILED" AND retry_count < ? ORDER BY id ASC LIMIT 20',
        [maxRetries]
      );
      return rows;
    } catch (error) {
      console.error('[NotificationRepository.getFailedLogs Error]:', error.message);
      return [];
    }
  }
}

module.exports = new NotificationRepository();
