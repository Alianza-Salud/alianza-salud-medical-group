import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  X,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchClients, createClient, updateClient } from '../../services/clientService';
import type { Client, CreateClientFormData } from '../../types/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function ClientsManagerPage() {
  usePageMeta('Maestro de Clientes', 'Gestión Centralizada de Clientes y Códigos de Verificación');

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Alerta de Código Creado
  const [createdClientInfo, setCreatedClientInfo] = useState<Client | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulario
  const [formData, setFormData] = useState<CreateClientFormData>({
    fullName: '',
    email: '',
    phone: '',
    documentId: '',
    address: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchClients();
    setClients(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await createClient(formData);
    setIsSubmitting(false);

    if (res.success && res.data) {
      setCreatedClientInfo(res.data);
      loadData();
      setFormData({ fullName: '', email: '', phone: '', documentId: '', address: '' });
    } else {
      setErrorMessage(res.message || 'Error al registrar cliente.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await updateClient(selectedClient.id, formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsEditModalOpen(false);
      setSelectedClient(null);
      loadData();
    } else {
      setErrorMessage(res.message || 'Error al actualizar cliente.');
    }
  };

  const openEdit = (c: Client) => {
    setSelectedClient(c);
    setFormData({
      fullName: c.fullName,
      email: c.email,
      phone: c.phone || '',
      documentId: c.documentId || '',
      address: c.address || '',
    });
    setErrorMessage(null);
    setIsEditModalOpen(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.documentId && c.documentId.includes(searchTerm))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maestro de Clientes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión centralizada de clientes. Los Códigos de Verificación de 8 caracteres se generan aquí una sola vez por cliente.
          </p>
        </div>
        <Button onClick={() => { setIsCreateModalOpen(true); setCreatedClientInfo(null); setErrorMessage(null); setFormData({ fullName: '', email: '', phone: '', documentId: '', address: '' }); }}>
          <UserPlus className="h-5 w-5" />
          Registrar Nuevo Cliente
        </Button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre, correo, cédula o código de 8 caracteres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla de Clientes */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando lista de clientes..." />
      ) : filteredClients.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-500">No hay clientes registrados o que coincidan con la búsqueda.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Documento / Teléfono</th>
                <th className="px-6 py-4">Código de Verificación (8 Chars)</th>
                <th className="px-6 py-4">Estado Cuenta</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{c.fullName}</div>
                    <div className="text-xs text-gray-500">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div>C.C. / Doc: <span className="font-medium text-gray-800">{c.documentId || 'N/A'}</span></div>
                    <div>Tel: <span className="font-medium text-gray-800">{c.phone || 'N/A'}</span></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-mono font-bold text-amber-800 border border-amber-200">
                        <KeyRound className="h-3.5 w-3.5" />
                        {c.verificationCode}
                      </span>
                      <button
                        onClick={() => copyCode(c.verificationCode)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Copiar código"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.isRegistered ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cuenta Registrada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        <Clock className="h-3.5 w-3.5" /> Pendiente Activación
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Registrar Nuevo Cliente */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Registrar Cliente y Generar Código de 8 Caracteres
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {createdClientInfo ? (
              <div className="py-6 space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">¡Cliente Creado Exitosamente!</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Entregue el siguiente Código de Verificación al cliente para que cree su contraseña de acceso.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 max-w-md mx-auto">
                  <p className="text-xs font-semibold uppercase text-amber-800 tracking-wider">
                    Código de Verificación Único (8 Caracteres)
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="font-mono text-3xl font-extrabold tracking-widest text-gray-900">
                      {createdClientInfo.verificationCode}
                    </span>
                    <button
                      onClick={() => copyCode(createdClientInfo.verificationCode)}
                      className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                      {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-amber-700">
                    Cliente: <strong>{createdClientInfo.fullName}</strong> ({createdClientInfo.email})
                  </p>
                </div>

                <Button fullWidth onClick={() => setIsCreateModalOpen(false)}>
                  Entendido / Volver al Maestro
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María Fernanda López"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="maria@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Cédula / Documento ID</label>
                    <input
                      type="text"
                      placeholder="1020304050"
                      value={formData.documentId}
                      onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+57 300 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección de Residencia</label>
                  <input
                    type="text"
                    placeholder="Calle 10 # 40-20, Medellín"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={isSubmitting}>
                    Guardar y Generar Código de 8 Caracteres
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Editar Cliente */}
      {isEditModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Editar Datos del Cliente</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cédula / Documento ID</label>
                  <input
                    type="text"
                    value={formData.documentId}
                    onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
