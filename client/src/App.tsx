import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from './components/layout/PageLayout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AboutPage from './pages/AboutPage';
import ProcessPage from './pages/ProcessPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Componente raíz de la aplicación.
 * Define todas las rutas públicas dentro del PageLayout.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/servicios/:slug" element={<ServiceDetailPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/proceso" element={<ProcessPage />} />
          <Route path="/citas" element={<AppointmentsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
