import type { ProcessStep } from '../types';

/**
 * Pasos del proceso público de atención médico-pericial.
 * Alineado con el flujo de 12 etapas internas del sistema.
 */
export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Solicitud y contacto inicial',
    description:
      'Solicite su valoración a través de la plataforma web o canales oficiales. Registramos la información preliminar y los antecedentes de su lesión o proceso.',
    icon: 'Phone',
  },
  {
    id: 2,
    title: 'Admisión y recepción documental',
    description:
      'La auxiliar de admisiones revisa los antecedentes, solicita las historias clínicas, incapacidades o evidencias y habilita la apertura del expediente.',
    icon: 'ClipboardList',
  },
  {
    id: 3,
    title: 'Valoración médica especializada',
    description:
      'Evaluación presencial o médica remota realizada por peritos médicos para valorar el estado de salud, secuelas y pérdida de capacidad laboral.',
    icon: 'Stethoscope',
  },
  {
    id: 4,
    title: 'Análisis y elaboración del dictamen',
    description:
      'Los especialistas médicos elaboran el Informe Pericial o dictamen de PCLO bajo rigor científico y normativa técnico-legal vigente.',
    icon: 'Microscope',
  },
  {
    id: 5,
    title: 'Entrega de resultados y acompañamiento jurídico',
    description:
      'Carga del documento oficial en su área de cliente para consulta y descarga, con opción de asesoría jurídica complementaria si lo requiere.',
    icon: 'CheckCircle',
  },
];
