import type { SiteInfo, NavLink } from '../types';
import type { TimeSlot } from '../types/appointment';

/**
 * Información general del sitio.
 *
 * Los datos de contacto son placeholders.
 * Deben ser reemplazados con la información real de la empresa.
 */
export const siteInfo: SiteInfo = {
  name: 'Alianza Salud Medical Group',
  tagline: 'Acompañamiento jurídico especializado con respaldo médico integral',
  description:
    'Alianza Salud Medical Group integra servicios de consultoría jurídica y especialidades en salud para brindar un acompañamiento integral en casos de responsabilidad médica, accidentes de tránsito y otros servicios jurídicos relacionados.',
  contact: {
    phone: '+57 (XXX) XXX-XXXX', // Placeholder — reemplazar con dato real
    email: 'contacto@alianzasalud.com.co', // Placeholder — reemplazar con dato real
    address: 'Medellín, Colombia', // Placeholder — reemplazar con dirección completa
    city: 'Medellín, Colombia',
    schedule: 'Lunes a Viernes: 8:00 AM - 6:00 PM', // Placeholder — confirmar horario
  },
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Proceso', href: '/proceso' },
    { label: 'Agendar Cita', href: '/citas' },
    { label: 'Contacto', href: '/contacto' },
  ],
};

/**
 * Navegación del footer — puede diferir de la principal.
 */
export const footerNavigation: { title: string; links: NavLink[] }[] = [
  {
    title: 'Navegación',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Proceso', href: '/proceso' },
    ],
  },
  {
    title: 'Servicios',
    links: [
      { label: 'Negligencia Médica', href: '/servicios/negligencia-medica' },
      { label: 'Responsabilidad Médica', href: '/servicios/responsabilidad-medica' },
      { label: 'Accidentes de Tránsito', href: '/servicios/accidentes-transito' },
      { label: 'Indemnizaciones', href: '/servicios/indemnizaciones-accidentes' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { label: 'Agendar Cita', href: '/citas' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
];

/**
 * Franjas horarias mock para el formulario de citas.
 * En fases futuras, vendrán del backend: GET /api/appointments/availability
 */
export const timeSlots: TimeSlot[] = [
  { value: '08:00', label: '8:00 AM', available: true },
  { value: '09:00', label: '9:00 AM', available: true },
  { value: '10:00', label: '10:00 AM', available: true },
  { value: '11:00', label: '11:00 AM', available: true },
  { value: '14:00', label: '2:00 PM', available: true },
  { value: '15:00', label: '3:00 PM', available: true },
  { value: '16:00', label: '4:00 PM', available: true },
  { value: '17:00', label: '5:00 PM', available: true },
];
