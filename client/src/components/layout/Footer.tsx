import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { footerNavigation } from '../../data/site';
import { fetchSiteInfo, type SiteInfoData } from '../../services/siteInfoService';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteData, setSiteData] = useState<SiteInfoData | null>(null);

  useEffect(() => {
    fetchSiteInfo().then((data) => setSiteData(data));
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contenido principal */}
        <div className="py-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Columna 1: Info de la empresa */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-white">
              {siteData?.company_name || 'Alianza Salud Medical Group'}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {siteData?.tagline || 'Acompañamiento jurídico especializado con respaldo médico integral.'}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{siteData?.phone || '+57 (601) 555-0199'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>{siteData?.email || 'contacto@alianzasalud.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>{siteData?.address || 'Carrera 15 # 93-47, Oficina 502, Bogotá D.C.'}</span>
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

        {/* Disclaimer y Copyright */}
        <div className="border-t border-gray-800 py-6 text-xs text-gray-400 space-y-4">
          <p className="leading-relaxed">
            <strong>Aviso Legal:</strong> La información contenida en este sitio web tiene carácter estrictamente informativo. No constituye asesoría jurídica formal ni crea una relación abogado-cliente.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-gray-800/60 pt-4">
            <p>© {currentYear} {siteData?.company_name || 'Alianza Salud Medical Group'}. Todos los derechos reservados.</p>
            <p>Especialidades Médicas & Consultoría Jurídica</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
