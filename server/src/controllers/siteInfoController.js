const siteInfoRepository = require('../repositories/siteInfoRepository');

const mockSiteInfo = {
  company_name: 'Alianza Salud Medical Group',
  tagline: 'Acompañamiento jurídico especializado con respaldo médico integral',
  phone: '+57 (601) 555-0199',
  email: 'contacto@alianzasalud.com',
  address: 'Carrera 15 # 93-47, Oficina 502, Bogotá D.C.',
  schedule: 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM',
  history: 'Espacio reservado para información institucional adicional: historia, misión, visión, valores. — Pendiente de datos proporcionados por la empresa.',
  mission: 'Brindar soluciones y asesoría jurídica integral respaldada por conceptos médicos científicos de alta calidad.',
  vision: 'Ser la organización líder en Colombia en el acompañamiento interdisciplinario en responsabilidad médica y derecho de la salud.',
  values: ['Ética profesional', 'Excelencia técnica', 'Empatía con las víctimas', 'Transparencia', 'Rigor científico'],
  visual_resource: 'Espacio reservado para imagen o recurso visual institucional',
};

/**
 * Obtener información institucional.
 * GET /api/site-info
 */
async function getSiteInfo(req, res, next) {
  try {
    let siteInfo = null;
    try {
      siteInfo = await siteInfoRepository.getInfo();
    } catch (dbError) {
      console.warn('[SiteInfoController Warning] Falló consulta MySQL:', dbError.message);
    }

    if (!siteInfo) {
      siteInfo = mockSiteInfo;
    } else {
      // Merge con los valores por defecto si faltan claves
      siteInfo = { ...mockSiteInfo, ...siteInfo };
    }

    return res.json({
      success: true,
      data: siteInfo,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualizar información institucional y datos públicos.
 * PUT /api/site-info
 */
async function updateSiteInfo(req, res, next) {
  try {
    const settingsData = req.body;
    if (!settingsData || typeof settingsData !== 'object') {
      return res.status(400).json({
        success: false,
        error: { message: 'Datos de configuración inválidos.', status: 400 },
      });
    }

    await siteInfoRepository.updateInfo(settingsData);
    const updatedInfo = await siteInfoRepository.getInfo();

    return res.json({
      success: true,
      message: 'Configuración de la empresa e información institucional actualizada exitosamente.',
      data: updatedInfo || { ...mockSiteInfo, ...settingsData },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSiteInfo,
  updateSiteInfo,
};
