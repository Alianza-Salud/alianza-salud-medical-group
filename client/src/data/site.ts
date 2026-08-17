import type { SiteInfo, NavLink } from '../types';
import type { TimeSlot } from '../types/appointment';

export const siteInfo: SiteInfo = {
  name: 'Alianza Salud Medical Group',
  tagline: 'Evaluaciones médico-periciales especializadas con soporte jurídico complementario',
  description:
    'Alianza Salud Medical Group ofrece servicios médicos especializados para la Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO) e Informes Periciales Médicos en Medellín, Colombia, brindando dictámenes técnicos para respaldo de su caso.',
  contact: {
    phone: '+57 (604) 444-5566',
    email: 'contacto@alianzasalud.com.co',
    address: 'Medellín, Colombia',
    city: 'Medellín, Colombia',
    schedule: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
  },
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Proceso', href: '/proceso' },
    { label: 'Agendar Valoración', href: '/citas' },
    { label: 'Contacto', href: '/contacto' },
  ],
};

export const footerNavigation: { title: string; links: NavLink[] }[] = [
  {
    title: 'Navegación',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Proceso Médico-Pericial', href: '/proceso' },
    ],
  },
  {
    title: 'Servicios Médico-Periciales',
    links: [
      { label: 'Calificación PCLO', href: '/servicios/pclo' },
      { label: 'Informe Pericial Médico', href: '/servicios/informe-pericial-medico' },
    ],
  },
  {
    title: 'Atención',
    links: [
      { label: 'Agendar Valoración', href: '/citas' },
      { label: 'Contacto', href: '/contacto' },
      { label: 'Área de Clientes', href: '/login' },
    ],
  },
];

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
