const siteInfoRepository = require('../repositories/siteInfoRepository');
const storageService = require('../storage/StorageService');
const fs = require('fs');

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
    delete siteInfo.visual_resource_storage_key;
    delete siteInfo.visual_resource_mime_type;
    if (/localhost|\/uploads\//i.test(String(siteInfo.visual_resource || ''))) {
      siteInfo.visual_resource = '';
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

    const allowedKeys = new Set([
      'company_name', 'tagline', 'phone', 'email', 'address', 'schedule',
      'history', 'mission', 'vision', 'values', 'visual_resource',
    ]);
    const safeSettings = Object.fromEntries(
      Object.entries(settingsData).filter(([key]) => allowedKeys.has(key))
    );
    if (Object.keys(safeSettings).length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No se proporcionaron campos de configuración válidos.', status: 400 },
      });
    }

    await siteInfoRepository.updateInfo(safeSettings);
    const updatedInfo = await siteInfoRepository.getInfo();

    return res.json({
      success: true,
      message: 'Configuración de la empresa e información institucional actualizada exitosamente.',
      data: updatedInfo || { ...mockSiteInfo, ...safeSettings },
    });
  } catch (error) {
    next(error);
  }
}

async function uploadVisualResource(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: { message: 'Debe seleccionar un archivo de imagen válido.', status: 400 },
      });
    }

    const previousInfo = await siteInfoRepository.getInfo();
    let stored;
    try {
      stored = await storageService.uploadFile(file.path, file.originalname, file.mimetype);
    } finally {
      await fs.promises.unlink(file.path).catch(() => {});
    }
    const imageUrl = '/api/site-info/visual-resource';

    await siteInfoRepository.updateInfo({
      visual_resource: imageUrl,
      visual_resource_storage_key: stored.storageKey,
      visual_resource_mime_type: file.mimetype,
    });
    const previousKey = previousInfo?.visual_resource_storage_key;
    if (previousKey && previousKey !== stored.storageKey) {
      await storageService.deleteFile(previousKey).catch(() => {});
    }
    const updatedInfo = await siteInfoRepository.getInfo();
    if (updatedInfo) {
      delete updatedInfo.visual_resource_storage_key;
      delete updatedInfo.visual_resource_mime_type;
    }

    return res.json({
      success: true,
      message: 'Imagen del recurso visual institucional subida y proyectada exitosamente.',
      data: {
        imageUrl,
        siteInfo: updatedInfo,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getVisualResource(req, res, next) {
  try {
    const siteInfo = await siteInfoRepository.getInfo();
    const storageKey = siteInfo?.visual_resource_storage_key;
    if (!storageKey || !(await storageService.exists(storageKey))) {
      return res.status(404).json({ success: false, error: { message: 'Imagen no disponible.', status: 404 } });
    }
    const mimeType = ['image/jpeg', 'image/png'].includes(siteInfo.visual_resource_mime_type)
      ? siteInfo.visual_resource_mime_type
      : 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return (await storageService.getReadStream(storageKey)).pipe(res);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSiteInfo,
  updateSiteInfo,
  uploadVisualResource,
  getVisualResource,
};
