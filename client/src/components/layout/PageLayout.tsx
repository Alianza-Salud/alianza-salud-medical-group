import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CaseReviewModal } from '../forms/CaseReviewModal';

export interface PageLayoutContext {
  onOpenCaseModal: (caseType?: string) => void;
}

/**
 * Layout principal que envuelve todas las páginas públicas.
 * Incluye Header, Footer, CaseReviewModal global y scroll-to-top.
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
    <div className="flex min-h-screen flex-col">
      <Header onOpenModal={() => handleOpenCaseModal()} />
      <main className="flex-1">
        <Outlet context={{ onOpenCaseModal: handleOpenCaseModal }} />
      </main>
      <Footer />

      <CaseReviewModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        defaultCaseType={selectedCaseType}
      />
    </div>
  );
}
