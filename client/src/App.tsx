import { BrowserRouter, Routes, Route } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PageLayout } from './components/layout/PageLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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

import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';
import CaseDetailPage from './pages/dashboard/CaseDetailPage';
import ClientDashboardPage from './pages/dashboard/ClientDashboardPage';
import ClientsManagerPage from './pages/dashboard/ClientsManagerPage';
import LawyersManagerPage from './pages/dashboard/LawyersManagerPage';
import UsersManagerPage from './pages/dashboard/UsersManagerPage';
import AppointmentsManagerPage from './pages/dashboard/AppointmentsManagerPage';
import ContactMessagesPage from './pages/dashboard/ContactMessagesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import CaseReviewRequestsPage from './pages/dashboard/CaseReviewRequestsPage';
import NotificationSettingsPage from './pages/dashboard/NotificationSettingsPage';

/**
 * Componente raíz de la aplicación.
 * Define rutas públicas y rutas privadas de Dashboard protegidas por rol.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas (PageLayout) */}
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

          {/* Entorno Privado / Dashboards (DashboardLayout) */}
          <Route element={<DashboardLayout />}>
            {/* Rutas para Admin, Auxiliar de Admisiones y Abogados / Especialistas */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'auxiliar_admisiones', 'lawyer']} />}>
              <Route path="/dashboard" element={<AdminDashboardPage />} />
              <Route path="/dashboard/casos/:id" element={<CaseDetailPage />} />
              <Route path="/dashboard/solicitudes-revision" element={<CaseReviewRequestsPage />} />
              <Route path="/dashboard/citas" element={<AppointmentsManagerPage />} />
              <Route path="/dashboard/mensajes" element={<ContactMessagesPage />} />
              <Route path="/dashboard/clientes" element={<ClientsManagerPage />} />
            </Route>

            {/* Rutas exclusivas para el Administrador & Auxiliar */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'auxiliar_admisiones']} />}>
              <Route path="/dashboard/abogados" element={<LawyersManagerPage />} />
              <Route path="/dashboard/usuarios" element={<UsersManagerPage />} />
              <Route path="/dashboard/configuracion" element={<SettingsPage />} />
              <Route path="/dashboard/configuracion/notificaciones" element={<NotificationSettingsPage />} />
            </Route>

            {/* Dashboard para Clientes */}
            <Route element={<ProtectedRoute allowedRoles={['client', 'cliente', 'admin', 'auxiliar_admisiones', 'lawyer']} />}>
              <Route path="/dashboard/cliente" element={<ClientDashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
