import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PageLayout } from './components/layout/PageLayout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AboutPage from './pages/AboutPage';
import ProcessPage from './pages/ProcessPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Componente raíz de la aplicación.
 * Encapsula la navegación y el AuthProvider para autenticación global.
 */
function App() {
  return (
    <AuthProvider>
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
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
