import type { ProcessStep } from '../types';

/**
 * Pasos del proceso público de atención médico-pericial.
 * Alineado con el flujo de 12 etapas internas del sistema.
 */
export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Envío de caso y revisión preliminar',
    description:
      'Nos envías la información y documentos disponibles (IPAT, historia clínica, epicrisis). Realizamos un análisis inicial sin costo ni compromiso.',
    icon: 'UploadCloud',
  },
  {
    id: 2,
    title: 'Análisis de viabilidad',
    description:
      'Estudio inicial de viabilidad técnico-médica y análisis del nexo causal para verificar si existe mérito de dictamen pericial.',
    icon: 'FileSearch',
  },
  {
    id: 3,
    title: 'Valoración y especialistas',
    description:
      'Valoración médica presencial o remota con participación de médicos especialistas peritos y exámenes complementarios cuando corresponda.',
    icon: 'Stethoscope',
  },
  {
    id: 4,
    title: 'Informe técnico y pericial',
    description:
      'Análisis técnico-médico detallado y estructuración del dictamen de PCLO o Informe Pericial Especializado con blindaje científico.',
    icon: 'Microscope',
  },
  {
    id: 5,
    title: 'Entrega de resultados',
    description:
      'Entrega oficial de los resultados en el portal con opción de soporte jurídico complementario si lo requiere.',
    icon: 'CheckCircle',
  },
];
