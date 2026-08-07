const siteInfoRepository = require('../repositories/siteInfoRepository');

const mockSiteInfo = {
  company_name: 'Alianza Salud Medical Group',
  tagline: 'Acompañamiento jurídico especializado con respaldo médico integral',
  phone: '+57 (XXX) XXX-XXXX',
  email: 'contacto@alianzasalud.com.co',
  address: 'Medellín, Colombia',
  city: 'Medellín, Colombia',
  schedule: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
  history: 'Alianza Salud Medical Group nació con la visión de integrar la práctica médica especializada y la consultoría jurídica en Medellín, Colombia.',
  mission: 'Brindar soluciones y asesoría jurídica integral respaldada por conceptos médicos científicos de alta calidad.',
  vision: 'Ser la organización líder en Colombia en el acompañamiento interdisciplinario en responsabilidad médica y derecho de la salud.',
  values: ['Ética profesional', 'Excelencia técnica', 'Empatía con las víctimas', 'Transparencia', 'Rigor científico'],
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
    }

    return res.json({
      success: true,
      data: siteInfo,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSiteInfo,
};
