import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { siteInfo, footerNavigation } from '../../data/site';

/**
 * Footer del sitio público con información de contacto,
 * navegación y disclaimer legal.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contenido principal */}
        <div className="py-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Columna 1: Info de la empresa */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-white">{siteInfo.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {siteInfo.tagline}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-500" />
                <span>{siteInfo.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gray-500" />
                <span>{siteInfo.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                <span>{siteInfo.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Columnas de navegación */}
          {footerNavigation.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer y copyright */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col gap-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} {siteInfo.name}. Todos los derechos reservados.
            </p>
            <p className="max-w-xl text-xs leading-relaxed">
              La información presentada en este sitio web es de carácter informativo
              y no constituye asesoramiento legal. Cada caso es único y requiere una
              evaluación personalizada.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
