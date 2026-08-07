/**
 * Representa un servicio jurídico ofrecido por Alianza Salud Medical Group.
 * En fases futuras, esta interfaz mapeará a la tabla `services` en MySQL.
 */
export interface Service {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string; // Nombre del icono de Lucide React
  situations: string[]; // Situaciones que puede abarcar
  processSteps: string[]; // Proceso de atención específico
  ctaText: string;
  isActive: boolean;
}

/**
 * Versión resumida para listados y cards.
 */
export type ServiceSummary = Pick<
  Service,
  'id' | 'slug' | 'name' | 'shortDescription' | 'icon' | 'ctaText'
>;
