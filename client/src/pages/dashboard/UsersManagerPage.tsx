import { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Plus,
  X,
  UserCheck,
  Building2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchUsers, updateUser } from '../../services/userService';
import { fetchClients } from '../../services/clientService';
import { fetchLawyers } from '../../services/lawyerService';
import type { User, UserRole } from '../../types/auth';
import type { Client } from '../../types/client';
import type { Lawyer } from '../../types/lawyer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiClient } from '../../services/api';

export default function UsersManagerPage() {
  usePageMeta('Maestro de Usuarios', 'Gestión de Cuentas de Usuario y Roles');

  const [users, setUsers] = useState<User[]>([]);
  const [masterClients, setMasterClients] = useState<Client[]>([]);
  const [masterLawyers, setMasterLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selección de entidad del Maestro
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [selectedLawyerId, setSelectedLawyerId] = useState<number>(0);

  // Formulario Editar
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'client' as UserRole,
    phone: '',
    isActive: true,
  });

  // Formulario Crear Cuenta de Usuario
  const [createFormData, setCreateFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'auxiliar_admisiones' as UserRole,
    phone: '',
    clientId: 0,
    lawyerId: 0,
  });

  const loadData = async () => {
    setIsLoading(true);
    const [usersData, clientsData, lawyersData] = await Promise.all([
      fetchUsers(),
      fetchClients(),
      fetchLawyers(),
    ]);
    setUsers(usersData);
    setMasterClients(clientsData);
    setMasterLawyers(lawyersData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = async () => {
    setErrorMessage(null);
    setSelectedClientId(0);
    setSelectedLawyerId(0);
    setCreateFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'auxiliar_admisiones',
      phone: '',
      clientId: 0,
      lawyerId: 0,
    });
    // Recargar maestros para tener lista actualizada de disponibles
    const [clientsData, lawyersData] = await Promise.all([
      fetchClients(),
      fetchLawyers(),
    ]);
    setMasterClients(clientsData);
    setMasterLawyers(lawyersData);
    setIsCreateModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      phone: u.phone || '',
      isActive: u.isActive,
    });
    setErrorMessage(null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await updateUser(editingUser.id, formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsEditModalOpen(false);
      loadData();
    } else {
      setErrorMessage(res.message || 'Error al actualizar usuario.');
    }
  };

  // Cambio de Rol en Modal de Creación
  const handleRoleChange = (newRole: UserRole) => {
    setSelectedClientId(0);
    setSelectedLawyerId(0);
    setCreateFormData({
      fullName: '',
      email: '',
      password: createFormData.password,
      role: newRole,
      phone: '',
      clientId: 0,
      lawyerId: 0,
    });
  };

  // Seleccionar Cliente sin Usuario registrado
  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
    const client = masterClients.find((c) => c.id === clientId);
    if (client) {
      setCreateFormData((prev) => ({
        ...prev,
        clientId: client.id,
        fullName: client.fullName,
        email: client.email,
        phone: client.phone || '',
      }));
    } else {
      setCreateFormData((prev) => ({
        ...prev,
        clientId: 0,
        fullName: '',
        email: '',
        phone: '',
      }));
    }
  };

  // Seleccionar Especialista sin Usuario registrado
  const handleSelectLawyer = (lawyerId: number) => {
    setSelectedLawyerId(lawyerId);
    const lawyer = masterLawyers.find((l) => l.id === lawyerId);
    if (lawyer) {
      setCreateFormData((prev) => ({
        ...prev,
        lawyerId: lawyer.id,
        fullName: lawyer.fullName,
        email: lawyer.email,
        phone: lawyer.phone || '',
      }));
    } else {
      setCreateFormData((prev) => ({
        ...prev,
        lawyerId: 0,
        fullName: '',
        email: '',
        phone: '',
      }));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (createFormData.role === 'client' && !selectedClientId) {
      setErrorMessage('Seleccione un cliente válido del Maestro de Clientes.');
      return;
    }
    if (createFormData.role === 'lawyer' && !selectedLawyerId) {
      setErrorMessage('Seleccione un especialista válido del Maestro de Especialistas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiClient.post<{ success: boolean; message?: string }>('/users', createFormData);
      setIsSubmitting(false);

      if (res.ok && res.data && res.data.success) {
        setIsCreateModalOpen(false);
        loadData();
      } else {
        const msg = (res.data as any)?.error?.message || (res.data as any)?.message || 'Error al crear cuenta de usuario.';
        setErrorMessage(msg);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Error al procesar la solicitud.');
    }
  };

  // Clientes y Especialistas sin usuario registrado
  const availableClients = masterClients.filter((c) => !c.userId && !c.isRegistered);
  const availableLawyers = masterLawyers.filter((l) => !l.userId && !l.isRegistered);
      if (res.ok && res.data && res.data.success) {
        setIsCreateModalOpen(false);
        setCreateFormData({ fullName: '', email: '', password: '', role: 'lawyer', phone: '' });
        loadData();
      } else {
        setErrorMessage(res.data?.message || 'Error al crear la cuenta de usuario.');
      }
    } catch (err) {
      setErrorMessage('Error de servidor al crear la cuenta.');
    }
    setIsSubmitting(false);
  };

  const toggleUserStatus = async (u: User) => {
    await updateUser(u.id, { isActive: !u.isActive });
    loadData();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maestro de Cuentas de Usuario</h1>
          <p className="mt-1 text-sm text-gray-600">
            Cree y administre las cuentas de acceso para Abogados, Especialistas y Administradores.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-5 w-5" />
          Crear Cuenta de Usuario
        </Button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuario por nombre, correo o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando usuarios..." />
      ) : filteredUsers.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-500">No hay cuentas de usuario registradas.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol Asignado</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{u.fullName}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'lawyer'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {u.role === 'admin' ? 'Administrador' : u.role === 'lawyer' ? 'Abogado / Médico' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">{u.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(u)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {u.isActive ? 'Activo' : 'Desactivado'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
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

      {/* Modal Crear Usuario */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Crear Nueva Cuenta de Usuario
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

              {/* PASO 1: Selección de Rol como primera acción */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                  1. Tipo / Rol de Usuario *
                </label>
                <select
                  value={createFormData.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-white font-semibold text-gray-900 focus:border-primary focus:outline-none"
                >
                  <option value="auxiliar_admisiones">Auxiliar de Admisiones</option>
                  <option value="admin">Administrador del Sistema</option>
                  <option value="client">Cliente (Enlazado al Maestro de Clientes)</option>
                  <option value="lawyer">Abogado / Médico Especialista (Enlazado al Maestro)</option>
                </select>
              </div>

              {/* PASO 2: Selección o Llenado de Datos según el Rol */}

              {/* CASO A: CLIENTE */}
              {createFormData.role === 'client' && (
                <div className="space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span>Vinculación con el Maestro de Clientes</span>
                  </div>

                  {availableClients.length === 0 ? (
                    <Alert variant="warning" message="Todos los clientes registrados en el Maestro ya cuentan con una usuario de acceso asignado. Debe crear un cliente nuevo en el Maestro de Clientes primero." />
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Seleccione el Cliente del Maestro *
                      </label>
                      <select
                        value={selectedClientId}
                        onChange={(e) => handleSelectClient(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                      >
                        <option value={0}>-- Seleccione un cliente registrado --</option>
                        {availableClients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.fullName} ({c.email}) - Código: {c.verificationCode}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedClientId > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-blue-100">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Nombre Completo</label>
                        <input
                          type="text"
                          readOnly
                          value={createFormData.fullName}
                          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-700 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Correo Electrónico</label>
                        <input
                          type="email"
                          readOnly
                          value={createFormData.email}
                          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-700 font-semibold"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CASO B: ABOGADO / MÉDICO ESPECIALISTA */}
              {createFormData.role === 'lawyer' && (
                <div className="space-y-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Vinculación con el Maestro de Especialistas</span>
                  </div>

                  {availableLawyers.length === 0 ? (
                    <Alert variant="warning" message="Todos los especialistas registrados en el Maestro ya cuentan con una cuenta de usuario asignada. Debe agregar un especialista nuevo en el Maestro de Especialistas primero." />
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Seleccione el Especialista del Maestro *
                      </label>
                      <select
                        value={selectedLawyerId}
                        onChange={(e) => handleSelectLawyer(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                      >
                        <option value={0}>-- Seleccione un especialista registrado --</option>
                        {availableLawyers.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.fullName} ({l.email}) - {l.specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedLawyerId > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-emerald-100">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Nombre Completo</label>
                        <input
                          type="text"
                          readOnly
                          value={createFormData.fullName}
                          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-700 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Correo Electrónico</label>
                        <input
                          type="email"
                          readOnly
                          value={createFormData.email}
                          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-700 font-semibold"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CASO C: ADMIN / AUXILIAR DE ADMISIONES (LIBRE INGRESO DE CAMPOS) */}
              {(createFormData.role === 'admin' || createFormData.role === 'auxiliar_admisiones') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carolina Martínez"
                      value={createFormData.fullName}
                      onChange={(e) => setCreateFormData({ ...createFormData, fullName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="usuario@alianzasalud.com"
                        value={createFormData.email}
                        onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        placeholder="+57 300 000 0000"
                        value={createFormData.phone}
                        onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTRASEÑA OBLIGATORIA */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Contraseña de Acceso *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={
                    (createFormData.role === 'client' && !selectedClientId) ||
                    (createFormData.role === 'lawyer' && !selectedLawyerId)
                  }
                >
                  Crear Cuenta de Usuario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Editar Usuario</h2>
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rol de Acceso *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                >
                  <option value="auxiliar_admisiones">Auxiliar de Admisiones</option>
                  <option value="lawyer">Abogado / Médico Especialista</option>
                  <option value="admin">Administrador</option>
                  <option value="client">Cliente</option>
                </select>
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
