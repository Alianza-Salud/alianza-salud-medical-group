import { icons, type LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * Obtiene un componente de icono de Lucide por nombre.
 * Devuelve el icono `Circle` si el nombre no se encuentra.
 */
export function getIconByName(name: string): ComponentType<LucideProps> {
  const icon = icons[name as keyof typeof icons];
  return icon || icons.Circle;
}
