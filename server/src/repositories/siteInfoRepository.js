const { pool } = require('../database/db');

/**
 * Repositorio de Información del Sitio / Institucional.
 * Encargado del acceso a los datos de la tabla `site_info` en MySQL.
 */
class SiteInfoRepository {
  async ensureTable() {
    if (!pool) return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  /**
   * Obtener toda la configuración del sitio como clave-valor.
   */
  async getInfo() {
    if (!pool) return null;
    await this.ensureTable();
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_info');
    if (rows.length === 0) return null;

    const info = {};
    for (const row of rows) {
      try {
        info[row.setting_key] = JSON.parse(row.setting_value);
      } catch {
        info[row.setting_key] = row.setting_value;
      }
    }
    return info;
  }

  /**
   * Guardar o actualizar la configuración del sitio en MySQL.
   */
  async updateInfo(settingsObject) {
    if (!pool) return false;
    await this.ensureTable();

    for (const [key, val] of Object.entries(settingsObject)) {
      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
      await pool.query(
        `INSERT INTO site_info (setting_key, setting_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, valStr]
      );
    }
    return true;
  }
}

module.exports = new SiteInfoRepository();
