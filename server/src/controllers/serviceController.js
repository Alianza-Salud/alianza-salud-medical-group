const serviceRepository = require('../repositories/serviceRepository');

// Mock fallback si MySQL no está conectado
const mockServices = [
  {
    id: 1,
    slug: 'negligencia-medica',
    name: 'Negligencia Médica',
    shortDescription: 'Asesoría y representación jurídica en casos donde se presuma que un profesional de la salud no proporcionó el estándar de cuidado adecuado.',
    description: 'Si usted o un familiar ha sufrido daños como consecuencia de una presunta negligencia por parte de un profesional o institución de salud, nuestro equipo jurídico, respaldado por especialistas médicos, puede evaluar su caso para determinar si existió una desviación del estándar de cuidado esperado. Ofrecemos acompañamiento integral durante todo el proceso.',
    icon: 'Stethoscope',
    situations: ['Diagnósticos presuntamente errados o tardíos', 'Errores presuntos durante procedimientos quirúrgicos', 'Administración inadecuada de medicamentos', 'Falta de seguimiento post-operatorio', 'Infecciones asociadas a la atención en salud', 'Alta prematura sin evaluación completa'],
    processSteps: ['Evaluación inicial gratuita de su caso', 'Revisión de la historia clínica y documentación', 'Concepto médico especializado', 'Análisis jurídico del caso', 'Definición de la estrategia legal', 'Representación y seguimiento'],
    ctaText: 'Solicitar evaluación de caso',
    isActive: true,
  },
  {
    id: 2,
    slug: 'responsabilidad-medica',
    name: 'Responsabilidad Médica',
    shortDescription: 'Evaluación y acompañamiento jurídico en casos de presunta responsabilidad por parte de profesionales o instituciones de salud.',
    description: 'La responsabilidad médica abarca situaciones en las que un profesional o institución de salud puede ser considerado responsable por daños causados a un paciente. Nuestro equipo evalúa cada caso de manera integral, combinando el análisis jurídico con valoraciones médicas especializadas para determinar la viabilidad de la reclamación.',
    icon: 'ShieldCheck',
    situations: ['Daños derivados de tratamientos médicos', 'Complicaciones no informadas al paciente', 'Falta de consentimiento informado', 'Demoras injustificadas en la atención', 'Deficiencias en la prestación del servicio de salud', 'Responsabilidad institucional de clínicas y hospitales'],
    processSteps: ['Consulta inicial para conocer su situación', 'Recopilación de documentación clínica', 'Evaluación médica por especialistas', 'Dictamen jurídico sobre viabilidad', 'Inicio de acciones legales si procede', 'Seguimiento integral del proceso'],
    ctaText: 'Consultar sobre mi caso',
    isActive: true,
  },
  {
    id: 3,
    slug: 'accidentes-transito',
    name: 'Accidentes de Tránsito',
    shortDescription: 'Representación jurídica para víctimas de accidentes de tránsito, incluyendo la gestión de reclamaciones y procesos asociados.',
    description: 'Si usted ha sido víctima de un accidente de tránsito, nuestro equipo jurídico le ofrece acompañamiento integral para la gestión de su caso. Evaluamos las circunstancias del accidente, la responsabilidad de las partes involucradas y los daños sufridos para definir la mejor estrategia de reclamación.',
    icon: 'Car',
    situations: ['Colisiones vehiculares con lesiones personales', 'Atropellamientos', 'Accidentes en motocicleta', 'Accidentes con vehículos de transporte público', 'Siniestros con daños materiales y personales', 'Fallecimiento como consecuencia de un accidente vial'],
    processSteps: ['Atención inmediata de su caso', 'Recopilación de evidencias y documentación', 'Evaluación médica de las lesiones', 'Análisis de responsabilidad', 'Gestión de reclamaciones', 'Representación legal y seguimiento'],
    ctaText: 'Reportar mi caso',
    isActive: true,
  },
  {
    id: 4,
    slug: 'indemnizaciones-accidentes',
    name: 'Indemnización por Accidentes de Tránsito',
    shortDescription: 'Gestión de procesos de indemnización y reclamación económica por daños sufridos en accidentes de tránsito.',
    description: 'Más allá de la representación legal inmediata, nuestro equipo se especializa en la gestión de indemnizaciones por accidentes de tránsito. Evaluamos los daños físicos, psicológicos y económicos para buscar una compensación justa que cubra los perjuicios sufridos.',
    icon: 'Scale',
    situations: ['Lesiones personales con incapacidad temporal o permanente', 'Gastos médicos derivados del accidente', 'Lucro cesante por incapacidad laboral', 'Daño moral y psicológico', 'Daños a terceros', 'Reclamaciones ante aseguradoras'],
    processSteps: ['Evaluación integral de los daños', 'Valoración médica de las secuelas', 'Cálculo de la indemnización potencial', 'Negociación con las partes responsables', 'Proceso judicial si es necesario', 'Seguimiento hasta la resolución'],
    ctaText: 'Consultar sobre indemnización',
    isActive: true,
  },
  {
    id: 5,
    slug: 'cirugia-estetica',
    name: 'Responsabilidad por Cirugías Estéticas',
    shortDescription: 'Asesoría jurídica en casos de presunta responsabilidad derivada de procedimientos o cirugías estéticas.',
    description: 'Los procedimientos estéticos conllevan riesgos que deben ser debidamente informados al paciente. Cuando los resultados se desvían significativamente de lo acordado o se producen complicaciones por presunta mala praxis, nuestro equipo jurídico, con apoyo de especialistas médicos, evalúa la viabilidad de la reclamación.',
    icon: 'HeartPulse',
    situations: ['Resultados no conformes con lo pactado', 'Complicaciones post-operatorias por presunta mala praxis', 'Falta de consentimiento informado adecuado', 'Procedimientos realizados por personal no cualificado', 'Infecciones o daños derivados del procedimiento', 'Publicidad engañosa sobre procedimientos estéticos'],
    processSteps: ['Análisis de la documentación previa al procedimiento', 'Evaluación del consentimiento informado', 'Valoración médica especializada del resultado', 'Determinación de la viabilidad jurídica', 'Inicio de acciones legales correspondientes', 'Acompañamiento hasta la resolución'],
    ctaText: 'Evaluar mi caso',
    isActive: true,
  },
  {
    id: 6,
    slug: 'otros-servicios',
    name: 'Otros Servicios Jurídicos',
    shortDescription: 'Consultoría jurídica en otros casos relacionados con el ámbito médico, de salud y responsabilidad civil.',
    description: 'Además de nuestras áreas principales de especialización, Alianza Salud Medical Group ofrece consultoría jurídica en otros casos relacionados con el ámbito médico y de responsabilidad. Si su situación no encaja exactamente en las categorías anteriores, no dude en contactarnos para una evaluación personalizada.',
    icon: 'Briefcase',
    situations: ['Casos de responsabilidad civil relacionados con salud', 'Reclamaciones ante entidades de salud', 'Casos de derechos del paciente', 'Situaciones no contempladas en las categorías anteriores'],
    processSteps: ['Contacto inicial para describir su situación', 'Evaluación preliminar del caso', 'Orientación sobre las opciones disponibles', 'Definición del plan de acción', 'Acompañamiento personalizado'],
    ctaText: 'Contactar para evaluación',
    isActive: true,
  },
];

/**
 * Obtener todos los servicios jurídicos.
 * GET /api/services
 */
async function getServices(req, res, next) {
  try {
    let services = null;
    try {
      services = await serviceRepository.findAllActive();
    } catch (dbError) {
      console.warn('[ServiceController Warning] Falló consulta MySQL, usando fallback mock:', dbError.message);
    }

    if (!services || services.length === 0) {
      services = mockServices;
    }

    return res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener un servicio por su slug.
 * GET /api/services/:slug
 */
async function getServiceBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    let service = null;

    try {
      service = await serviceRepository.findBySlug(slug);
    } catch (dbError) {
      console.warn('[ServiceController Warning] Falló consulta MySQL, usando fallback mock:', dbError.message);
    }

    if (!service) {
      service = mockServices.find((s) => s.slug === slug) || null;
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        error: { message: 'Servicio no encontrado', status: 404 },
      });
    }

    return res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getServices,
  getServiceBySlug,
};
