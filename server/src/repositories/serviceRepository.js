const { pool } = require('../database/db');

/**
 * Repositorio de Servicios Jurídicos.
 * Encargado del acceso a los datos de la tabla `services` en MySQL.
 */
class ServiceRepository {
  /**
   * Parsear campos JSON en un objeto de servicio.
   */
  _formatService(row) {
    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      shortDescription: row.short_description,
      description: row.description,
      icon: row.icon,
      situations: typeof row.situations === 'string' ? JSON.parse(row.situations) : row.situations,
      processSteps: typeof row.process_steps === 'string' ? JSON.parse(row.process_steps) : row.process_steps,
      ctaText: row.cta_text,
      isActive: Boolean(row.is_active),
    };
  }

  /**
   * Obtener todos los servicios activos.
   */
  async findAllActive() {
    if (!pool) return null;
    const [rows] = await pool.query(
      'SELECT * FROM services WHERE is_active = 1 ORDER BY id ASC'
    );
    return rows.map((row) => this._formatService(row));
  }

  /**
   * Obtener un servicio por su slug.
   */
  async findBySlug(slug) {
    if (!pool) return null;
    const [rows] = await pool.query(
      'SELECT * FROM services WHERE slug = ? AND is_active = 1 LIMIT 1',
      [slug]
    );
    if (rows.length === 0) return null;
    return this._formatService(rows[0]);
  }
}

module.exports = new ServiceRepository();
