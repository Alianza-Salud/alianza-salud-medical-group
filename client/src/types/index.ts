/**
 * Etapa del proceso de atención.
 */
export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string; // Nombre del icono de Lucide React
}

/**
 * Datos del formulario de contacto.
 * En fases futuras, mapeará a la tabla `contacts` en MySQL.
 */
export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/**
 * Información de contacto de la empresa.
 */
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  schedule: string;
}

/**
 * Enlace de navegación.
 */
export interface NavLink {
  label: string;
  href: string;
}

/**
 * Información general del sitio.
 */
export interface SiteInfo {
  name: string;
  tagline: string;
  description: string;
  contact: ContactInfo;
  navigation: NavLink[];
}
