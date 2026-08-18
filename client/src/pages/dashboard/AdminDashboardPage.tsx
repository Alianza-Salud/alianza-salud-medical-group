import { useState, useEffect } from 'react';
import {
  FolderPlus,
  Search,
  KeyRound,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  X,
  UserPlus,
  ChevronRight,
  ChevronLeft,
  Check,
  Users,
  CalendarDays,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchCases, createCase, addCaseUpdate, updateCaseStage } from '../../services/caseService';
import { fetchClients } from '../../services/clientService';
import { fetchLawyers } from '../../services/lawyerService';
import { fetchDashboardStats, type DashboardStats } from '../../services/dashboardService';
import type { LegalCase } from '../../types/case';
import type { Client } from '../../types/client';
import type { Lawyer } from '../../types/lawyer';
import { services as availableServices } from '../../data/services';
import { CaseStageStepper, CASE_STAGES } from '../../components/cases/CaseStageStepper';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const INJURY_CASE_TYPES = [
  'Lesión por Accidente de Tránsito (SOAT)',
  'Enfermedad o Accidente de Trabajo / Laboral (ARL)',
  'Negligencia Médica o Secuela Quirúrgica',
  'Lesión por Responsabilidad Civil / Terceros',
  'Pérdida de Capacidad Laboral y Ocupacional (PCLO)',
  'Secuela Traumatológica / Incapacidad Permanente',
  'Valoración de Estado Secuelar / Daño Corporal',
  'Otro Tipo de Lesión / Secuela',
];

export default function AdminDashboardPage() {
  usePageMeta('Gestión de Casos', 'Panel de Administración y Gestión Jurídica');

  const [cases, setCases] = useState<LegalCase[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    pendingAppointments: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);

  // Modal Búsqueda de Cliente (Lupa)
  const [isClientPickerOpen, setIsClientPickerOpen] = useState(false);
  const [searchClientTerm, setSearchClientTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulario Crear Caso (Selección de Cliente y Abogado existente)
  const [newCaseData, setNewCaseData] = useState({
    clientId: 0,
    serviceSlug: 'informe-pericial-medico',
    caseType: 'Lesión por Accidente de Tránsito (SOAT)',
    title: '',
    description: '',
    lawyerId: 0,
  });

  // Formulario Agregar Novedad
  const [newUpdateData, setNewUpdateData] = useState({
    title: '',
    description: '',
    stageName: 'Evaluación Inicial',
  });

  // Formulario Cambiar Etapa
  const [selectedStageName, setSelectedStageName] = useState<string>('Evaluación Inicial');

  const loadAllData = async () => {
    setIsLoading(true);
    const [casesData, clientsData, lawyersData, statsData] = await Promise.all([
      fetchCases(),
      fetchClients(),
      fetchLawyers(),
      fetchDashboardStats(),
    ]);
    setCases(casesData);
    setClients(clientsData);
    setLawyers(lawyersData);
    setDashboardStats(statsData);

    if (clientsData.length > 0 && newCaseData.clientId === 0) {
      setNewCaseData((prev) => ({ ...prev, clientId: clientsData[0].id }));
    }
    if (lawyersData.length > 0 && newCaseData.lawyerId === 0) {
      setNewCaseData((prev) => ({ ...prev, lawyerId: lawyersData[0].id }));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseData.clientId) {
      setErrorMessage('Seleccione un cliente válido desde el buscador.');
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    const selectedLawyer = lawyers.find((l) => l.id === Number(newCaseData.lawyerId));

    const res = await createCase({
      clientId: Number(newCaseData.clientId),
      serviceSlug: newCaseData.serviceSlug,
      caseType: newCaseData.caseType,
      title: newCaseData.title,
      description: newCaseData.description,
      lawyerId: selectedLawyer ? selectedLawyer.id : null,
      assignedLawyerName: selectedLawyer ? selectedLawyer.fullName : 'Equipo Jurídico Alianza Salud',
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsCreateModalOpen(false);
      setNewCaseData({
        clientId: clients[0]?.id || 0,
        serviceSlug: 'informe-pericial-medico',
        caseType: INJURY_CASE_TYPES[0],
        title: '',
        description: '',
        lawyerId: lawyers[0]?.id || 0,
      });
      loadAllData();
    } else {
      setErrorMessage(res.message || 'Error al crear el caso.');
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await addCaseUpdate(selectedCase.id, newUpdateData);
    setIsSubmitting(false);

    if (res.success) {
      setIsUpdateModalOpen(false);
      setSelectedCase(null);
      setNewUpdateData({ title: '', description: '', stageName: 'Evaluación Inicial' });
      loadAllData();
    } else {
      setErrorMessage(res.message || 'Error al registrar la novedad.');
    }
  };

  const handleStageChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await updateCaseStage(selectedCase.id, selectedStageName);
    setIsSubmitting(false);

    if (res.success) {
      setIsStageModalOpen(false);
      setSelectedCase(null);
      loadAllData();
    } else {
      setErrorMessage(res.message || 'Error al cambiar la etapa.');
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Paginación (Máximo 10 casos por página)
  const totalPages = Math.ceil(filteredCases.length / 10) || 1;
  const paginatedCases = filteredCases.slice((currentPage - 1) * 10, currentPage * 10);

  const selectedClientObj = clients.find((c) => c.id === newCaseData.clientId);

  const filteredModalClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
      (c.documentId && c.documentId.includes(searchClientTerm))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Casos Jurídicos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Aperture casos seleccionando clientes existentes del Maestro con la lupa de búsqueda, asigne abogados y controle las etapas.
          </p>
        </div>
        <Button onClick={() => { setIsCreateModalOpen(true); setErrorMessage(null); }}>
          <FolderPlus className="h-5 w-5" />
          Aperturar Nuevo Caso
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Casos</p>
              <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">En Proceso / Evaluación</p>
              <p className="text-2xl font-bold text-gray-900">
                {cases.filter((c) => c.status !== 'closed').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Casos Finalizados</p>
              <p className="text-2xl font-bold text-gray-900">
                {cases.filter((c) => c.status === 'closed').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, código CAS o título..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Estado:</span>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Evaluación Inicial</option>
            <option value="in_progress">En Proceso</option>
            <option value="closed">Cerrado</option>
          </select>
        </div>
      </div>

      {/* Tabla limpia de Casos Médico-Periciales */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando casos..." />
      ) : filteredCases.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-500">No hay casos registrados actualmente.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Código del Caso</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Caso</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Etapa Activa</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedCases.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">
                          {c.caseCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{c.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 capitalize">{c.serviceSlug.replace(/-/g, ' ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{c.clientName}</div>
                        <div className="text-xs text-gray-500 font-mono">Código: {c.verificationCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {c.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/dashboard/casos/${c.id}`}>
                          <Button size="sm">
                            Ver detalles
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación de Casos (Máximo 10 por página) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 text-sm shadow-sm">
              <span className="text-xs text-gray-500 font-medium">
                Mostrando {paginatedCases.length} de {filteredCases.length} casos totales (Página {currentPage} de {totalPages})
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>

                <span className="text-xs font-bold text-gray-700 px-3">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Aperturar Caso (Selección con Input + Lupa) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-primary" />
                Apertura de Caso (Cliente del Maestro)
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="mt-4 space-y-4">
              {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

              {/* Selector de Cliente con Input No Editable + Lupa */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Cliente del Maestro Seleccionado *
                  </label>
                  <Link
                    to="/dashboard/clientes"
                    className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    + Crear Nuevo Cliente en Maestro
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    onClick={() => setIsClientPickerOpen(true)}
                    value={
                      selectedClientObj
                        ? `${selectedClientObj.fullName} (${selectedClientObj.email}) — Código: ${selectedClientObj.verificationCode}`
                        : ''
                    }
                    placeholder="Haga clic en la lupa 🔍 para buscar y seleccionar un cliente..."
                    className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-primary focus:outline-none font-medium text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => { setIsClientPickerOpen(true); setSearchClientTerm(''); }}
                    className="flex items-center justify-center p-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm"
                    title="Buscar cliente en el Maestro"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Selector de Abogado / Profesional */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Abogado / Especialista Asignado</label>
                  <select
                    value={newCaseData.lawyerId}
                    onChange={(e) => setNewCaseData({ ...newCaseData, lawyerId: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                  >
                    <option value={0}>Equipo Jurídico Alianza Salud</option>
                    {lawyers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.fullName} ({l.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Servicio médico-pericial *</label>
                  <select
                    value={newCaseData.serviceSlug}
                    onChange={(e) => setNewCaseData({ ...newCaseData, serviceSlug: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                  >
                    {availableServices.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de caso *</label>
                  <select
                    value={newCaseData.caseType}
                    onChange={(e) => setNewCaseData({ ...newCaseData, caseType: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                  >
                    {INJURY_CASE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Título del Caso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Reclamación por presunta negligencia en procedimiento asistencial"
                  value={newCaseData.title}
                  onChange={(e) => setNewCaseData({ ...newCaseData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción Inicial del Caso *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalles preliminares y circunstancias generales..."
                  value={newCaseData.description}
                  onChange={(e) => setNewCaseData({ ...newCaseData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none resize-y"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting} disabled={!newCaseData.clientId}>
                  Aperturar Caso
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Secundario: Buscador de Cliente con Lupa */}
      {isClientPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Buscar y Seleccionar Cliente del Maestro
              </h3>
              <button onClick={() => setIsClientPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Input Buscador */}
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Escriba para buscar por nombre, correo, cédula o código de 8 caracteres..."
                value={searchClientTerm}
                onChange={(e) => setSearchClientTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none shadow-sm"
              />
            </div>

            {/* Tabla de Clientes con Scroll */}
            <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white">
              {filteredModalClients.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No se encontraron clientes que coincidan con "{searchClientTerm}".
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Documento / Teléfono</th>
                      <th className="px-4 py-3">Código 8 Chars</th>
                      <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredModalClients.map((cli) => {
                      const isSelected = newCaseData.clientId === cli.id;
                      return (
                        <tr key={cli.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900">{cli.fullName}</div>
                            <div className="text-xs text-gray-500">{cli.email}</div>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <div>Doc: {cli.documentId || 'N/A'}</div>
                            <div>Tel: {cli.phone || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
                              <KeyRound className="h-3 w-3" />
                              {cli.verificationCode}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant={isSelected ? 'primary' : 'outline'}
                              onClick={() => {
                                setNewCaseData({ ...newCaseData, clientId: cli.id });
                                setIsClientPickerOpen(false);
                              }}
                            >
                              {isSelected ? <Check className="h-4 w-4" /> : 'Seleccionar'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between shrink-0 border-t border-gray-100 text-xs">
              <span className="text-gray-500">Total clientes encontrados: {filteredModalClients.length}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsClientPickerOpen(false)}>
                Cerrar Buscador
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cambiar / Avanzar Etapa del Caso */}
      {isStageModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Control de Etapa del Caso</h2>
                <p className="text-xs text-primary font-mono font-semibold">{selectedCase.caseCode} — {selectedCase.clientName}</p>
              </div>
              <button onClick={() => setIsStageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleStageChange} className="mt-4 space-y-4">
              {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Seleccione la Nueva Etapa</label>
                <select
                  value={selectedStageName}
                  onChange={(e) => setSelectedStageName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                >
                  {CASE_STAGES.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                Al avanzar la etapa, se registrará una novedad automática en el timeline del caso y el cliente podrá ver el nuevo porcentaje de progreso.
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsStageModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Actualizar Etapa del Caso
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Novedad / Movimiento */}
      {isUpdateModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Registrar Novedad / Movimiento</h2>
                <p className="text-xs text-primary font-mono font-semibold">{selectedCase.caseCode} — {selectedCase.clientName}</p>
              </div>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddUpdate} className="mt-4 space-y-4">
              {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Título de la Novedad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Emisión del concepto médico por especialista"
                  value={newUpdateData.title}
                  onChange={(e) => setNewUpdateData({ ...newUpdateData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción / Avance *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detalle los avances realizados..."
                  value={newUpdateData.description}
                  onChange={(e) => setNewUpdateData({ ...newUpdateData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none resize-y"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Publicar Novedad
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
