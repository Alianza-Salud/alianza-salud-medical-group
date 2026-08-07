import type { ProcessStep } from '../types';

/**
 * Datos mock de las etapas del proceso de atención.
 *
 * En fases futuras, este flujo podrá ser gestionado dinámicamente
 * desde el backend según el tipo de caso.
 *
 * NOTA: Este es un flujo conceptual para el sitio público.
 * No todos los casos siguen exactamente las mismas etapas.
 */
export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Primer contacto',
    description:
      'Comuníquese con nosotros a través de cualquiera de nuestros canales. Un asesor le atenderá para conocer su situación de manera inicial.',
    icon: 'Phone',
  },
  {
    id: 2,
    title: 'Solicitud de cita',
    description:
      'Agende una cita de evaluación inicial a través de nuestro sitio web o por contacto directo. Le confirmaremos la fecha y hora.',
    icon: 'CalendarCheck',
  },
  {
    id: 3,
    title: 'Evaluación inicial',
    description:
      'Nuestro equipo realizará una evaluación preliminar de su caso para determinar la naturaleza de la situación y los pasos a seguir.',
    icon: 'ClipboardList',
  },
  {
    id: 4,
    title: 'Revisión jurídica',
    description:
      'El equipo jurídico analizará los aspectos legales de su caso, revisando la documentación disponible y la normativa aplicable.',
    icon: 'Scale',
  },
  {
    id: 5,
    title: 'Análisis médico especializado',
    description:
      'Cuando el caso lo requiera, nuestros especialistas en salud emitirán conceptos, valoraciones o dictámenes médicos que respalden el análisis jurídico.',
    icon: 'Microscope',
  },
  {
    id: 6,
    title: 'Definición de ruta de atención',
    description:
      'Con base en los análisis jurídico y médico, se definirá la estrategia y ruta de atención más adecuada para su caso particular.',
    icon: 'Route',
  },
  {
    id: 7,
    title: 'Seguimiento del caso',
    description:
      'Realizamos seguimiento continuo a su caso, manteniéndole informado sobre los avances, novedades y próximos pasos en cada etapa del proceso.',
    icon: 'Eye',
  },
  {
    id: 8,
    title: 'Resolución',
    description:
      'Acompañamos el proceso hasta su resolución, buscando siempre el resultado más favorable para usted y brindando orientación en cada decisión.',
    icon: 'CheckCircle',
  },
];
