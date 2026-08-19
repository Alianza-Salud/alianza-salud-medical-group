import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CaseReviewModal } from '../forms/CaseReviewModal';
import { FloatingCaseReviewButton } from '../ui/FloatingCaseReviewButton';

export interface PageLayoutContext {
  onOpenCaseModal: (caseType?: string) => void;
}

/**
 * Layout principal que envuelve todas las páginas públicas.
 * Incluye Header, Footer, Botón Circular Flotante (FAB), CaseReviewModal global y scroll-to-top.
 */
export function PageLayout() {
  const { pathname } = useLocation();
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedCaseType, setSelectedCaseType] = useState('Accidente de tránsito');

  const handleOpenCaseModal = (caseType?: string) => {
    if (caseType) setSelectedCaseType(caseType);
    setIsCaseModalOpen(true);
  };

  // Scroll to top cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col relative">
      <Header onOpenModal={() => handleOpenCaseModal()} />
      <main className="flex-1">
        <Outlet context={{ onOpenCaseModal: handleOpenCaseModal }} />
      </main>
      <Footer />

      {/* Botón Circular Flotante (FAB) siempre visible durante el scroll */}
      <FloatingCaseReviewButton onClick={() => handleOpenCaseModal()} />

      <CaseReviewModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        defaultCaseType={selectedCaseType}
      />
    </div>
  );
}
