import type { Service } from '../types/service';

/**
 * Servicios médico-periciales principales de Alianza Salud Medical Group.
 * Enfocados en PCLO e Informe Pericial Médico.
 */
export const services: Service[] = [
  {
    id: 1,
    slug: 'pclo',
    name: 'Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO)',
    shortDescription:
      'Determinación médica especializada del porcentaje de pérdida de capacidad laboral y ocupacional bajo normativa colombiana.',
    description:
      'Evaluación médico-pericial integral orientada a la determinación técnica del porcentaje de pérdida de capacidad laboral y ocupacional (PCLO). Realizada por peritos médicos cualificados con base en los baremos vigentes en Colombia, este informe sustenta procesos de invalidez, pensiones y reclamos ante aseguradoras o entidades competentes.',
    icon: 'ClipboardCheck',
    situations: [
      'Accidentes de tránsito con secuelas físicas o cognitivas',
      'Accidentes laborales y enfermedades profesionales',
      'Secuelas de negligencia o complicaciones asistenciales médicas',
      'Reclamación de pensión de invalidez o incapacidad permanente',
      'Controversias ante Juntas de Calificación de Invalidez',
      'Pérdida de capacidad en actividades ocupacionales o cotidianas',
    ],
    processSteps: [
      'Solicitud de información y recepción de documentos',
      'Admisión y revisión inicial por la auxiliar de admisiones',
      'Valoración médica especializada presencial o virtual',
      'Análisis técnico-científico e historia clínica',
      'Elaboración y revisión final del dictamen de PCLO',
      'Entrega de documento resultante y asesoría jurídica complementaria',
    ],
    ctaText: 'Solicitar valoración PCLO',
    isActive: true,
  },
  {
    id: 2,
    slug: 'informe-pericial-medico',
    name: 'Informe Médico Especializado de Tipo Pericial',
    shortDescription:
      'Dictamen médico-legal con rigor científico para sustentar reclamaciones de daño corporal, secuelas e invalidez.',
    description:
      'Elaboración de informes periciales médicos fundamentados en la evidencia clínica, historia médica y análisis de nexo causal. Diseñados para servir de soporte en procesos de reclamación por accidentes de tránsito, accidentes laborales y negligencia y responsabilidad médica.',
    icon: 'FileCheck',
    situations: [
      'Evaluación de nexo causal en presunta negligencia y responsabilidad médica',
      'Valoración de daño corporal y secuelas por siniestro vial',
      'Determinación de gravedad de lesiones sufridas en ambiente de trabajo',
      'Dictamen técnico para objeción de dictámenes de aseguradoras',
      'Segunda opinión médico-legal sobre secuelas permanentes',
      'Soporte especializado para procesos judiciales o extrajudiciales',
    ],
    processSteps: [
      'Recepción de solicitud y antecedentes clínicos',
      'Verificación y estructuración del expediente de admisión',
      'Agendamiento y valoración médica especializada',
      'Redacción científica del informe pericial y nexo causal',
      'Carga y disponibilidad de documento resultante en plataforma',
      'Entrega al cliente y evaluación de necesidad jurídica opcional',
    ],
    ctaText: 'Solicitar informe pericial',
    isActive: true,
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getActiveServices(): Service[] {
  return services.filter((s) => s.isActive);
}
