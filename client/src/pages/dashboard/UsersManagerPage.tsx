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
  KeyRound,
  Copy,
  Lock,
  Check,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchUsers, updateUser, resetUserPassword } from '../../services/userService';
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

  // Modal Restablecer Contraseña
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [customNewPassword, setCustomNewPassword] = useState('');
  const [generatedPasswordResult, setGeneratedPasswordResult] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selección de entidad del Maestro
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [selectedLawyerId, setSelectedLawyerId] = useState<number>(0);

  // Modales de Búsqueda (Picker)
  const [isClientPickerOpen, setIsClientPickerOpen] = useState(false);
  const [searchClientModalTerm, setSearchClientModalTerm] = useState('');

  const [isLawyerPickerOpen, setIsLawyerPickerOpen] = useState(false);
  const [searchLawyerModalTerm, setSearchLawyerModalTerm] = useState('');

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

  const openResetPasswordModal = (u: User) => {
    setResetTargetUser(u);
    setCustomNewPassword('');
    setGeneratedPasswordResult(null);
    setIsCopied(false);
    setErrorMessage(null);
    setIsResetModalOpen(true);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    setIsResettingPassword(true);
    setErrorMessage(null);

    const res = await resetUserPassword(resetTargetUser.id, customNewPassword);
    setIsResettingPassword(false);

    if (res.success && res.temporaryPassword) {
      setGeneratedPasswordResult(res.temporaryPassword);
    } else {
      setErrorMessage(res.message || 'Error al restablecer la contraseña.');
    }
  };

  const handleCopyPassword = () => {
    if (!generatedPasswordResult) return;
    navigator.clipboard.writeText(generatedPasswordResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
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
  const handleSelectClient = (client: Client) => {
    setSelectedClientId(client.id);
    setCreateFormData((prev) => ({
      ...prev,
      clientId: client.id,
      fullName: client.fullName,
      email: client.email,
      phone: client.phone || '',
    }));
    setIsClientPickerOpen(false);
  };

  // Seleccionar Especialista sin Usuario registrado
  const handleSelectLawyer = (lawyer: Lawyer) => {
    setSelectedLawyerId(lawyer.id);
    setCreateFormData((prev) => ({
      ...prev,
      lawyerId: lawyer.id,
      fullName: lawyer.fullName,
      email: lawyer.email,
      phone: lawyer.phone || '',
    }));
    setIsLawyerPickerOpen(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (createFormData.role === 'client' && !selectedClientId) {
      setErrorMessage('Seleccione un cliente del Maestro mediante el botón de búsqueda.');
      return;
    }
    if (createFormData.role === 'lawyer' && !selectedLawyerId) {
      setErrorMessage('Seleccione un especialista del Maestro mediante el botón de búsqueda.');
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

  // Filtrados por búsqueda en modales picker
  const filteredAvailableClients = availableClients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchClientModalTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchClientModalTerm.toLowerCase()) ||
      (c.verificationCode && c.verificationCode.toLowerCase().includes(searchClientModalTerm.toLowerCase())) ||
      (c.documentId && c.documentId.toLowerCase().includes(searchClientModalTerm.toLowerCase()))
  );

  const filteredAvailableLawyers = availableLawyers.filter(
    (l) =>
      l.fullName.toLowerCase().includes(searchLawyerModalTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchLawyerModalTerm.toLowerCase()) ||
      (l.specialty && l.specialty.toLowerCase().includes(searchLawyerModalTerm.toLowerCase()))
  );

  const toggleUserStatus = async (u: User) => {
    if (u.role === 'admin') {
      alert('Las cuentas de tipo Administrador no se pueden inactivar por seguridad del sistema.');
      return;
    }
    const res = await updateUser(u.id, {
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      phone: u.phone,
      isActive: !u.isActive,
    });
    if (!res.success) {
      alert(res.message || 'Error al cambiar estado del usuario.');
    }
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
                          : u.role === 'auxiliar_admisiones'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'lawyer'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {u.role === 'admin'
                        ? 'Administrador'
                        : u.role === 'auxiliar_admisiones'
                        ? 'Aux. Admisiones'
                        : u.role === 'lawyer'
                        ? 'Abogado / Médico'
                        : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">{u.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {u.role === 'admin' ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-not-allowed"
                        title="Los usuarios administradores no se pueden inactivar por seguridad del sistema"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Activo (Protegido)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-colors ${
                          u.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title={u.isActive ? 'Hacer clic para inactivar cuenta de usuario' : 'Hacer clic para activar cuenta de usuario'}
                      >
                        {u.isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {u.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResetPasswordModal(u)}
                        title="Restablecer Contraseña del Usuario"
                        className="text-amber-700 border-amber-200 hover:bg-amber-50"
                      >
                        <KeyRound className="h-4 w-4 text-amber-600" />
                        Restablecer Clave
                      </Button>
                    </div>
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
                <div className="space-y-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span>Vinculación con el Maestro de Clientes</span>
                  </div>

                  {availableClients.length === 0 ? (
                    <Alert variant="warning" message="Todos los clientes registrados en el Maestro ya cuentan con un usuario asignado." />
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Cliente del Maestro *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          placeholder="Ningún cliente seleccionado..."
                          value={createFormData.fullName ? `${createFormData.fullName} (${createFormData.email})` : ''}
                          className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:outline-none font-semibold text-gray-900 placeholder:font-normal"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            setSearchClientModalTerm('');
                            setIsClientPickerOpen(true);
                          }}
                          className="shrink-0"
                        >
                          <Search className="h-4 w-4" /> Buscar Cliente
                        </Button>
                      </div>
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
                <div className="space-y-3 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Vinculación con el Maestro de Especialistas</span>
                  </div>

                  {availableLawyers.length === 0 ? (
                    <Alert variant="warning" message="Todos los especialistas registrados en el Maestro ya cuentan con un usuario asignado." />
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Especialista del Maestro *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          placeholder="Ningún especialista seleccionado..."
                          value={createFormData.fullName ? `${createFormData.fullName} (${createFormData.email})` : ''}
                          className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:outline-none font-semibold text-gray-900 placeholder:font-normal"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            setSearchLawyerModalTerm('');
                            setIsLawyerPickerOpen(true);
                          }}
                          className="shrink-0"
                        >
                          <Search className="h-4 w-4" /> Buscar Especialista
                        </Button>
                      </div>
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

      {/* Modal Picker Buscar Cliente sin Usuario */}
      {isClientPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Buscar Cliente sin Usuario Registrado
              </h3>
              <button onClick={() => setIsClientPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Solo se muestran los clientes del Maestro que no tienen una cuenta de acceso registrada.
            </p>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo, documento o código de verificación..."
                value={searchClientModalTerm}
                onChange={(e) => setSearchClientModalTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-200">
              {filteredAvailableClients.length === 0 ? (
                <p className="p-6 text-center text-xs text-gray-500 italic">
                  {availableClients.length === 0
                    ? 'No hay clientes disponibles sin usuario registrado.'
                    : 'No se encontraron coincidencias para la búsqueda.'}
                </p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Documento</th>
                      <th className="p-3">Código Verif.</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAvailableClients.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{c.fullName}</div>
                          <div className="text-gray-500">{c.email}</div>
                        </td>
                        <td className="p-3 font-mono text-gray-600">{c.documentId || 'N/A'}</td>
                        <td className="p-3">
                          <span className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono text-[11px] font-bold text-primary border border-gray-200">
                            {c.verificationCode}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button size="sm" onClick={() => handleSelectClient(c)}>
                            Seleccionar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setIsClientPickerOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Picker Buscar Especialista sin Usuario */}
      {isLawyerPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-600" />
                Buscar Especialista sin Usuario Registrado
              </h3>
              <button onClick={() => setIsLawyerPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Solo se muestran los especialistas del Maestro que no tienen una cuenta de acceso registrada.
            </p>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, especialidad o correo..."
                value={searchLawyerModalTerm}
                onChange={(e) => setSearchLawyerModalTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-200">
              {filteredAvailableLawyers.length === 0 ? (
                <p className="p-6 text-center text-xs text-gray-500 italic">
                  {availableLawyers.length === 0
                    ? 'No hay especialistas disponibles sin usuario registrado.'
                    : 'No se encontraron coincidencias para la búsqueda.'}
                </p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="p-3">Especialista</th>
                      <th className="p-3">Especialidad</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAvailableLawyers.map((l) => (
                      <tr key={l.id} className="hover:bg-emerald-50/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-gray-900">{l.fullName}</div>
                          <div className="text-gray-500">{l.email}</div>
                        </td>
                        <td className="p-3 font-semibold text-emerald-800">{l.specialty}</td>
                        <td className="p-3 text-right">
                          <Button size="sm" onClick={() => handleSelectLawyer(l)}>
                            Seleccionar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setIsLawyerPickerOpen(false)}>
                Cerrar
              </Button>
            </div>
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

      {/* Modal Restablecer Contraseña */}
      {isResetModalOpen && resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-600" />
                Restablecer Contraseña de Usuario
              </h3>
              <button onClick={() => setIsResetModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <span className="text-xs font-bold text-amber-900 uppercase">Usuario Seleccionado</span>
              <p className="text-sm font-bold text-gray-900">{resetTargetUser.fullName}</p>
              <p className="text-xs text-gray-600">{resetTargetUser.email}</p>
            </div>

            {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

            {generatedPasswordResult ? (
              <div className="space-y-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <p className="text-xs font-bold text-emerald-900 uppercase">¡Contraseña Restablecida con Éxito!</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="font-mono text-lg font-bold text-emerald-950 bg-white px-4 py-1.5 rounded-lg border border-emerald-300 tracking-wider">
                    {generatedPasswordResult}
                  </span>
                  <Button size="sm" onClick={handleCopyPassword} variant="outline">
                    {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    {isCopied ? '¡Copiado!' : 'Copiar'}
                  </Button>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Proporcione esta nueva clave temporal al usuario para que pueda acceder a la plataforma.
                </p>
                <div className="pt-2">
                  <Button className="w-full" onClick={() => setIsResetModalOpen(false)}>
                    Finalizar y Cerrar
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nueva Contraseña (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Deje en blanco para auto-generar clave aleatoria..."
                    value={customNewPassword}
                    onChange={(e) => setCustomNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Si deja el campo vacío, el sistema generará automáticamente una clave segura (ej. <em>Alianza8492!</em>).
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsResetModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={isResettingPassword}>
                    Restablecer Contraseña
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
