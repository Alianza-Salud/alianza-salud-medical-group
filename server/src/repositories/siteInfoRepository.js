const { pool } = require('../database/db');

/**
 * Repositorio de Información del Sitio / Institucional.
 * Encargado del acceso a los datos de la tabla `site_info` en MySQL.
 */
class SiteInfoRepository {
  /**
   * Obtener toda la configuración del sitio como clave-valor.
   */
  async getInfo() {
    if (!pool) return null;
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
}

module.exports = new SiteInfoRepository();
