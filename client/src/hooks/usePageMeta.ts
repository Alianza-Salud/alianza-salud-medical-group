import { useEffect } from 'react';

/**
 * Hook para actualizar el título y meta description de la página.
 * Permite SEO básico por ruta en una SPA de React.
 *
 * En fases futuras, podría reemplazarse por react-helmet-async
 * o una solución SSR si se requiere SEO avanzado.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const siteName = 'Alianza Salud Medical Group';
    document.title = title ? `${title} | ${siteName}` : siteName;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);

      // Open Graph básico
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', `${title} | ${siteName}`);

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', description);
    }
  }, [title, description]);
}
