import { useState, useEffect } from 'react';
import { Mail, ShieldCheck, CheckCircle2, XCircle, Clock, RefreshCw, Save, Send, AlertTriangle, Layers, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface NotificationSetting {
  id: number;
  event_type: string;
  event_name: string;
  category: string;
  send_to_client: number;
  send_to_admin: number;
  is_enabled: number;
}

interface NotificationLog {
  id: number;
  event_type: string;
  recipient_email: string;
  recipient_type: 'client' | 'admin';
  subject: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  provider_message_id?: string;
  error_message?: string;
  retry_count: number;
  created_at: string;
  sent_at?: string;
}

export function NotificationSettingsPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'logs'>('settings');
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [companyEmail, setCompanyEmail] = useState('contacto@alianzasalud.com');
  const [senderName, setSenderName] = useState('Alianza Salud Medical Group');
  const [senderEmail, setSenderEmail] = useState('notificaciones@alianzasalud.com');
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  const getAuthToken = () => localStorage.getItem('alianza_token') || '';

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications/settings', {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data.settings || []);
        if (data.data.companyEmail) setCompanyEmail(data.data.companyEmail);
        if (data.data.senderName) setSenderName(data.data.senderName);
        if (data.data.senderEmail) setSenderEmail(data.data.senderEmail);
      }
    } catch (err) {
      console.error('Error cargando configuración:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (statusFilter = filterStatus) => {
    try {
      const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/notifications/logs${query}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data || []);
      }
    } catch (err) {
      console.error('Error cargando bitácora:', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setFeedback(null);
      const res = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          settings,
          companyEmail,
          senderName,
          senderEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Configuración de notificaciones guardada correctamente.' });
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'Fallo al guardar.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error de comunicación con el servidor.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = async (logId: number) => {
    try {
      const res = await fetch(`/api/notifications/logs/${logId}/retry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Notificación reenviada exitosamente.' });
        fetchLogs();
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'Fallo en reintento.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error al solicitar el reintento.' });
    }
  };

  const toggleEvent = (index: number, key: 'send_to_client' | 'send_to_admin' | 'is_enabled') => {
    const updated = [...settings];
    updated[index][key] = updated[index][key] === 1 ? 0 : 1;
    setSettings(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-primary">Módulo de Notificaciones Transaccionales</h1>
            <p className="text-xs text-gray-500">Gestión de eventos por correo (Brevo Provider) & Bitácora de Auditoría</p>
          </div>
        </div>

        {/* Pestanas de Navegación */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-primary shadow-xs font-extrabold' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <Bell className="h-3.5 w-3.5 inline mr-1.5" />
            Configuración de Eventos
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'logs' ? 'bg-white text-primary shadow-xs font-extrabold' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <Clock className="h-3.5 w-3.5 inline mr-1.5" />
            Bitácora de Auditoría
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* PESTAÑA 1: CONFIGURACIÓN */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Datos del Remitente y Empresa */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-primary flex items-center gap-2 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Configuración de Correo Empresarial & Remitente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Correo Receptor de la Empresa:</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  placeholder="contacto@empresa.com"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Recibe copias de solicitudes de cita y revisiones.</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Remitente:</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Correo Remitente Registrado en Brevo:</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tabla de Interruptores por Evento */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-primary">Eventos Transaccionales Habilitados</h3>
                <p className="text-xs text-gray-500">Configure los grupos de destinatarios para cada acción del sistema.</p>
              </div>
              <Button variant="primary" size="sm" onClick={handleSaveSettings} disabled={saving} className="font-bold">
                <Save className="h-4 w-4 mr-1.5" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="px-6 py-3.5">Evento Transaccional</th>
                    <th className="px-4 py-3.5 text-center">Enviar a Cliente</th>
                    <th className="px-4 py-3.5 text-center">Enviar a Empresa</th>
                    <th className="px-4 py-3.5 text-center">Notificación Activa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {settings.map((item, idx) => (
                    <tr key={item.event_type} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 block">{item.event_name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{item.event_type}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={item.send_to_client === 1}
                          onChange={() => toggleEvent(idx, 'send_to_client')}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={item.send_to_admin === 1}
                          onChange={() => toggleEvent(idx, 'send_to_admin')}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleEvent(idx, 'is_enabled')}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                            item.is_enabled === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {item.is_enabled === 1 ? 'Habilitada' : 'Inactiva'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: BITÁCORA DE AUDITORÍA */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden space-y-4 p-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <h3 className="text-sm font-extrabold text-primary">Historial y Auditoría de Envíos</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600">Filtrar estado:</span>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  fetchLogs(e.target.value);
                }}
                className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="all">Todos los Estados</option>
                <option value="SENT">Enviados (SENT)</option>
                <option value="FAILED">Fallidos (FAILED)</option>
                <option value="PENDING">Pendientes (PENDING)</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => fetchLogs()} className="font-bold">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Tabla de Logs */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3">Destinatario</th>
                  <th className="px-4 py-3">Asunto</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3">Brevo Message ID</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-medium">
                      No se encontraron registros de notificaciones en la bitácora.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">{log.event_type}</td>
                      <td className="px-4 py-3">
                        <span className="block font-semibold text-gray-800">{log.recipient_email}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">{log.recipient_type}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium max-w-xs truncate" title={log.subject}>
                        {log.subject}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {log.status === 'SENT' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> SENT
                          </span>
                        )}
                        {log.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-extrabold text-red-800" title={log.error_message}>
                            <XCircle className="h-3 w-3 text-red-600" /> FAILED
                          </span>
                        )}
                        {log.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                            <Clock className="h-3 w-3 text-amber-600" /> PENDING
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">
                        {log.provider_message_id || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {log.status === 'FAILED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(log.id)}
                            className="text-[11px] py-1 px-2.5 font-bold border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Send className="h-3 w-3 mr-1" /> Reintentar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationSettingsPage;

