import { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Search,
  X,
  UserCheck,
  UserPlus,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Ban,
  LayoutGrid,
  List,
  RotateCcw,
  Video,
  Building2,
  Copy,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  fetchPrivateAppointments,
  updateAppointmentStatus,
  type PrivateAppointment,
} from '../../services/appointmentService';
import { fetchClients, createClient } from '../../services/clientService';
import { fetchLawyers } from '../../services/lawyerService';
import { createCase } from '../../services/caseService';
import type { Client } from '../../types/client';
import type { Lawyer } from '../../types/lawyer';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function AppointmentsManagerPage() {
  usePageMeta('Gestión de Citas', 'Calendario Interactivo y Solicitudes de Citas de Clientes');
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<PrivateAppointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modos de Vista: 'list' | 'cards' | 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'calendar'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('approved');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Estado del Calendario Mensual
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<{ dateStr: string; items: PrivateAppointment[] } | null>(null);
  const [dayModalPage, setDayModalPage] = useState<number>(1);

  // Modales
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetAppointment, setTargetAppointment] = useState<PrivateAppointment | null>(null);
  const [assignLawyerId, setAssignLawyerId] = useState<number>(0);

  // Modal Conversión a Caso
  const [clientOption, setClientOption] = useState<'create' | 'existing'>('create');
  const [selectedClientId, setSelectedClientId] = useState<number>(0);
  const [selectedLawyerId, setSelectedLawyerId] = useState<number>(0);
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');

  // Modal Lupa Búsqueda Cliente
  const [isClientPickerOpen, setIsClientPickerOpen] = useState(false);
  const [searchClientTerm, setSearchClientTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [appData, clientsData, lawyersData] = await Promise.all([
      fetchPrivateAppointments(),
      fetchClients(),
      fetchLawyers(),
    ]);
    setAppointments(appData);
    setClients(clientsData);
    setLawyers(lawyersData);

    if (clientsData.length > 0 && selectedClientId === 0) {
      setSelectedClientId(clientsData[0].id);
    }
    if (lawyersData.length > 0 && selectedLawyerId === 0) {
      setSelectedLawyerId(lawyersData[0].id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Modal Aprobación Cita & Google Meet
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveModality, setApproveModality] = useState<'presencial' | 'remota'>('presencial');
  const [approveMeetLink, setApproveMeetLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);

  const generateRandomMeetUrl = () => 'https://meet.google.com/new';

  const openApproveModal = (app: PrivateAppointment) => {
    setTargetAppointment(app);
    setApproveModality(app.modality || 'presencial');
    setApproveMeetLink(app.meetLink || generateRandomMeetUrl());
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppointment) return;
    setIsSubmitting(true);
    await updateAppointmentStatus(
      targetAppointment.id,
      'approved',
      targetAppointment.assignedLawyerId || null,
      approveModality,
      approveModality === 'remota' ? approveMeetLink : null
    );
    setIsSubmitting(false);
    setIsApproveModalOpen(false);
    loadData();
    if (selectedDayAppointments) {
      updateDayModal(targetAppointment.preferredDate);
    }
  };

  const handleCancelAppointment = async (app: PrivateAppointment) => {
    if (window.confirm(`¿Está seguro de cancelar la cita de ${app.fullName}?`)) {
      await updateAppointmentStatus(app.id, 'rejected');
      loadData();
      if (selectedDayAppointments) {
        updateDayModal(app.preferredDate);
      }
    }
  };

  const openAssignModal = (app: PrivateAppointment) => {
    setTargetAppointment(app);
    setAssignLawyerId(app.assignedLawyerId || (lawyers[0]?.id || 0));
    setIsAssignModalOpen(true);
  };

  const handleAssignLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppointment) return;
    setIsSubmitting(true);
    await updateAppointmentStatus(targetAppointment.id, undefined, assignLawyerId);
    setIsSubmitting(false);
    setIsAssignModalOpen(false);
    loadData();
    if (selectedDayAppointments) {
      updateDayModal(targetAppointment.preferredDate);
    }
  };

  const updateDayModal = async (dateStr: string) => {
    const updatedApps = await fetchPrivateAppointments();
    setAppointments(updatedApps);
    const items = updatedApps.filter((a) => normalizeDateStr(a.preferredDate) === dateStr);
    setSelectedDayAppointments({ dateStr, items });
  };

  const openConvertModal = (app: PrivateAppointment) => {
    setTargetAppointment(app);
    setCaseTitle(`Atención por ${app.serviceType.replace('-', ' ')} — Cita del ${app.preferredDate}`);
    setCaseDescription(app.message || `Solicitud de atención agendada el día ${app.preferredDate} a las ${app.preferredTime}.`);

    // Pre-seleccionar experto asignado si la cita lo tiene
    if (app.assignedLawyerId) {
      setSelectedLawyerId(app.assignedLawyerId);
    } else if (lawyers.length > 0) {
      setSelectedLawyerId(lawyers[0].id);
    }

    const existing = clients.find((c) => c.email.toLowerCase() === app.email.toLowerCase());
    if (existing) {
      setClientOption('existing');
      setSelectedClientId(existing.id);
    } else {
      setClientOption('create');
    }

    setErrorMessage(null);
    setIsConvertModalOpen(true);
  };

  const handleConvertAppointmentToCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppointment) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    let finalClientId = selectedClientId;

    if (clientOption === 'create') {
      const clientRes = await createClient({
        fullName: targetAppointment.fullName,
        email: targetAppointment.email,
        phone: targetAppointment.phone,
      });

      if (clientRes.success && clientRes.data) {
        finalClientId = clientRes.data.id;
      } else {
        setErrorMessage(clientRes.message || 'Error al registrar al cliente.');
        setIsSubmitting(false);
        return;
      }
    }

    const selectedLawyer = lawyers.find((l) => l.id === Number(selectedLawyerId));

    const caseRes = await createCase({
      clientId: finalClientId,
      serviceSlug: targetAppointment.serviceType,
      title: caseTitle,
      description: caseDescription,
      lawyerId: selectedLawyer ? selectedLawyer.id : null,
      assignedLawyerName: selectedLawyer ? selectedLawyer.fullName : 'Equipo Jurídico Alianza Salud',
    });

    if (caseRes.success) {
      await updateAppointmentStatus(targetAppointment.id, 'case_created', selectedLawyer ? selectedLawyer.id : null);
      setIsConvertModalOpen(false);
      setTargetAppointment(null);
      loadData();
    } else {
      setErrorMessage(caseRes.message || 'Error al aperturar el caso.');
    }
    setIsSubmitting(false);
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.assignedLawyerName && app.assignedLawyerName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesDate = !selectedDate || normalizeDateStr(app.preferredDate) === selectedDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const selectedClientObj = clients.find((c) => c.id === selectedClientId);

  const filteredModalClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
      c.verificationCode.toLowerCase().includes(searchClientTerm.toLowerCase()) ||
      (c.documentId && c.documentId.includes(searchClientTerm))
  );

  // Restablecer Filtros a Estado Inicial
  const resetFilters = () => {
    setSelectedDate('');
    setFilterStatus(viewMode === 'calendar' ? 'approved' : 'all');
    setSearchTerm('');
  };

  // -------------------------------------------------------------
  // Lógica del Calendario Mensual Interactivo
  // -------------------------------------------------------------
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const prevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentCalendarDate(new Date());
  };

  function normalizeDateStr(dateInput: string): string {
    if (!dateInput) return '';
    const str = String(dateInput).trim();
    if (str.includes('T')) {
      return str.split('T')[0];
    }
    return str.substring(0, 10);
  }

  const getAppointmentsForDate = (dateStr: string) => {
    return filteredAppointments.filter((app) => normalizeDateStr(app.preferredDate) === dateStr);
  };

  const handleDayClick = (dateStr: string) => {
    const dayApps = getAppointmentsForDate(dateStr);
    setSelectedDayAppointments({ dateStr, items: dayApps });
    setDayModalPage(1);
  };

  // Paginación del modal del día (Max 5 citas por página)
  const dayItems = selectedDayAppointments?.items || [];
  const totalDayPages = Math.ceil(dayItems.length / 5) || 1;
  const paginatedDayItems = dayItems.slice((dayModalPage - 1) * 5, dayModalPage * 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas y Agendamiento</h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'admin'
              ? 'Calendario interactivo y control de citas del sistema. Asigne expertos, apruebe, cancele o inicie casos.'
              : 'Sus citas agendadas y consultas asignadas.'}
          </p>
        </div>

        {/* Selector de Modo de Vista */}
        <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => { setViewMode('calendar'); setFilterStatus('approved'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Calendar className="h-4 w-4 text-primary" />
            Calendario
          </button>
          <button
            onClick={() => { setViewMode('cards'); setFilterStatus('all'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Tarjetas
          </button>
          <button
            onClick={() => { setViewMode('list'); setFilterStatus('all'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <List className="h-4 w-4" />
            Lista
          </button>
        </div>
      </div>

      {/* Filtros con Botón de Restablecer Estado Inicial */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, correo, profesional o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Canceladas / Rechazadas</option>
            <option value="case_created">Convertidas en Caso</option>
          </select>

          {/* Botón para restablecer filtros a su estado inicial */}
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
            title="Restablecer filtros a su estado inicial"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      </div>

      {/* Contenido según el Modo de Vista */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando agendamiento de citas..." />
      ) : viewMode === 'calendar' ? (
        /* VISTA CALENDARIO MENSUAL INTERACTIVO */
        <Card className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3 sm:pb-4">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={goToToday}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Hoy
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Anterior</span>
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <span className="hidden sm:inline">Siguiente</span> <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((dayName) => (
              <div key={dayName} className="text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider py-1.5">
                <span className="sm:hidden">{dayName.substring(0, 1)}</span>
                <span className="hidden sm:inline">{dayName}</span>
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[50px] sm:min-h-[110px] rounded-lg sm:rounded-xl bg-gray-50/40 border border-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDay = String(dayNum).padStart(2, '0');
              const formattedMonth = String(month + 1).padStart(2, '0');
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

              const dayApps = getAppointmentsForDate(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dateStr}
                  onDoubleClick={() => handleDayClick(dateStr)}
                  onClick={() => handleDayClick(dateStr)}
                  className={`group relative min-h-[58px] sm:min-h-[110px] p-1 sm:p-2 rounded-lg sm:rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${isToday
                      ? 'border-2 border-primary bg-primary/5 shadow-sm'
                      : dayApps.length > 0
                        ? 'border-indigo-200 bg-indigo-50/20 sm:bg-white hover:border-indigo-400 hover:shadow-md'
                        : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center justify-between sm:justify-between w-full">
                    <span
                      className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[11px] sm:text-xs font-bold ${isToday ? 'bg-primary text-white shadow-sm' : 'text-gray-700'
                        }`}
                    >
                      {dayNum}
                    </span>

                    {/* Badge contador en pantallas medianas/grandes */}
                    {dayApps.length > 0 && (
                      <span className="hidden sm:inline-flex items-center justify-center rounded-full bg-primary/20 text-primary font-mono text-[10px] font-extrabold px-1.5 py-0.5">
                        {dayApps.length} {dayApps.length === 1 ? 'cita' : 'citas'}
                      </span>
                    )}
                  </div>

                  {/* Badge circular centrado en pantallas móviles con color Índigo contrastante */}
                  {dayApps.length > 0 && (
                    <div className="sm:hidden flex items-center justify-center my-0.5">
                      <span className="flex h-4.5 min-w-[18px] px-1.5 items-center justify-center rounded-full bg-indigo-600 text-white font-mono text-[10px] font-extrabold shadow-xs">
                        {dayApps.length}
                      </span>
                    </div>
                  )}

                  {/* Vista previa compacta en pantallas grandes (Desktop) */}
                  <div className="hidden sm:block mt-1 space-y-1 overflow-hidden flex-1">
                    {dayApps.slice(0, 2).map((app) => (
                      <div
                        key={app.id}
                        className={`text-[10px] p-1 rounded font-semibold truncate flex items-center justify-between ${app.status === 'approved'
                            ? 'bg-green-100 text-green-900'
                            : app.status === 'case_created'
                              ? 'bg-purple-100 text-purple-900'
                              : app.status === 'rejected'
                                ? 'bg-red-100 text-red-900'
                                : 'bg-amber-100 text-amber-900'
                          }`}
                      >
                        <span className="truncate">{app.fullName.split(' ')[0]}</span>
                        <span className="font-mono text-[9px] shrink-0 ml-1">{app.preferredTime}</span>
                      </div>
                    ))}

                    {dayApps.length > 2 && (
                      <p className="text-[10px] text-gray-500 font-semibold text-center mt-1">
                        + {dayApps.length - 2} más...
                      </p>
                    )}
                  </div>

                  {/* Indicadores visuales por puntos en móvil */}
                  {dayApps.length > 0 && (
                    <div className="sm:hidden flex items-center justify-center gap-0.5 mt-auto">
                      {dayApps.slice(0, 3).map((app, idx) => (
                        <span
                          key={idx}
                          className={`h-1.5 w-1.5 rounded-full ${app.status === 'approved'
                              ? 'bg-green-500'
                              : app.status === 'case_created'
                                ? 'bg-purple-500'
                                : app.status === 'rejected'
                                  ? 'bg-red-500'
                                  : 'bg-amber-500'
                            }`}
                        />
                      ))}
                    </div>
                  )}

                  <p className="hidden sm:block text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-center mt-1">
                    Clic para detalle
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      ) : viewMode === 'cards' ? (
        /* VISTA TARJETAS */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((app) => (
            <Card key={app.id} className="hover:border-primary/50 transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <CalendarDays className="h-4 w-4" />
                    {app.preferredDate} — {app.preferredTime}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${app.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : app.status === 'case_created'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                  >
                    {app.status === 'approved'
                      ? 'Aprobada'
                      : app.status === 'rejected'
                        ? 'Cancelada'
                        : app.status === 'case_created'
                          ? 'Caso Iniciado'
                          : 'Pendiente'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">{app.fullName}</h3>
                  <p className="text-xs text-gray-500">{app.email} | {app.phone}</p>
                  <p className="text-xs font-semibold text-primary mt-1 uppercase tracking-wider">
                    {app.serviceType.replace('-', ' ')}
                  </p>
                  {app.assignedLawyerName && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 p-2 rounded-md">
                      <UserCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Experto: <strong>{app.assignedLawyerName}</strong></span>
                    </div>
                  )}
                </div>

                {app.message && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                    "{app.message}"
                  </p>
                )}

                {/* Modalidad de Cita & Enlace Google Meet */}
                {app.modality === 'remota' || app.meetLink ? (
                  <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5 text-[11px]">
                        <Video className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        Videoconsulta Google Meet
                      </span>
                      {app.meetLink && (
                        <a
                          href={app.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-0.5 underline shrink-0"
                        >
                          Abrir reunión <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    {app.meetLink ? (
                      <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-blue-200 font-mono text-[11px] text-blue-900">
                        <span className="truncate">{app.meetLink}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(app.meetLink!);
                            setCopiedLinkId(app.id);
                            setTimeout(() => setCopiedLinkId(null), 2000);
                          }}
                          className="text-[11px] font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 shrink-0 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                          title="Copiar enlace al portapapeles"
                        >
                          {copiedLinkId === app.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                          {copiedLinkId === app.id ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-blue-700 italic">Videoconsulta remota sin enlace asignado.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/80">
                    <Building2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[11px]">Atención Presencial en Sede Principal</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {app.status === 'pending' && (
                      <Button size="sm" variant="outline" onClick={() => openApproveModal(app)} className="text-green-700">
                        Aprobar
                      </Button>
                    )}
                    {app.status !== 'rejected' && app.status !== 'case_created' && (
                      <Button size="sm" variant="ghost" onClick={() => handleCancelAppointment(app)} className="text-red-600 hover:bg-red-50">
                        <Ban className="h-3.5 w-3.5" /> Cancelar
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => openAssignModal(app)}>
                      <UserCog className="h-3.5 w-3.5" /> Experto
                    </Button>
                    {app.status !== 'case_created' && (
                      <Button size="sm" onClick={() => openConvertModal(app)}>
                        <FolderPlus className="h-3.5 w-3.5" /> Caso
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* VISTA LISTA / TABLA */
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Cliente Solicita</th>
                <th className="px-6 py-4">Servicio</th>
                <th className="px-6 py-4">Fecha y Hora Cita</th>
                <th className="px-6 py-4">Experto Asignado</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{app.fullName}</div>
                    <div className="text-xs text-gray-500">{app.email} — {app.phone}</div>
                    {app.message && <p className="text-xs text-gray-600 mt-1 italic line-clamp-1">"{app.message}"</p>}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-800 capitalize">
                    {app.serviceType.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {app.preferredDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                      {app.preferredTime}
                    </div>
                    {app.modality === 'remota' || app.meetLink ? (
                      <div className="mt-2 text-xs">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Video className="h-3 w-3 text-blue-600" /> Virtual Meet
                        </span>
                        {app.meetLink && (
                          <div className="mt-1 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(app.meetLink!);
                                setCopiedLinkId(app.id);
                                setTimeout(() => setCopiedLinkId(null), 2000);
                              }}
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-0.5"
                              title="Copiar enlace"
                            >
                              {copiedLinkId === app.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              {copiedLinkId === app.id ? '¡Copiado!' : 'Copiar Meet'}
                            </button>
                            <span className="text-gray-300">•</span>
                            <a
                              href={app.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-0.5"
                            >
                              Abrir <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Building2 className="h-3 w-3 text-emerald-600" /> Presencial
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-700 font-medium">
                    {app.assignedLawyerName ? (
                      <span className="inline-flex items-center gap-1 text-gray-900 font-bold">
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        {app.assignedLawyerName}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${app.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : app.status === 'case_created'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                      {app.status === 'approved'
                        ? 'Aprobada'
                        : app.status === 'rejected'
                          ? 'Cancelada'
                          : app.status === 'case_created'
                            ? 'Caso Iniciado'
                            : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {app.status === 'pending' && (
                        <Button variant="ghost" size="sm" onClick={() => openApproveModal(app)} className="text-green-700 hover:bg-green-50">
                          <CheckCircle2 className="h-4 w-4" /> Aprobar
                        </Button>
                      )}

                      {app.status !== 'rejected' && app.status !== 'case_created' && (
                        <Button variant="ghost" size="sm" onClick={() => handleCancelAppointment(app)} className="text-red-600 hover:bg-red-50">
                          <XCircle className="h-4 w-4" /> Cancelar
                        </Button>
                      )}

                      <Button variant="outline" size="sm" onClick={() => openAssignModal(app)}>
                        <UserCog className="h-4 w-4" /> Asignar Experto
                      </Button>

                      {app.status !== 'case_created' && (
                        <Button size="sm" onClick={() => openConvertModal(app)}>
                          <FolderPlus className="h-4 w-4" />
                          Iniciar Caso
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Detalle de Citas del Día Seleccionado (Con Paginación de Max 5 Citas) */}
      {selectedDayAppointments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Citas Agendadas para el {selectedDayAppointments.dateStr}
                </h3>
                <p className="text-xs text-gray-500">Total de consultas: {dayItems.length}</p>
              </div>
              <button onClick={() => setSelectedDayAppointments(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {dayItems.length === 0 ? (
                <p className="text-center py-8 text-sm text-gray-500">No hay citas registradas para esta fecha.</p>
              ) : (
                paginatedDayItems.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{app.preferredTime}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${app.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : app.status === 'case_created'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          {app.status === 'approved' ? 'Aprobada' : app.status === 'rejected' ? 'Cancelada' : app.status === 'case_created' ? 'Caso Iniciado' : 'Pendiente'}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm mt-1">{app.fullName}</h4>
                      <p className="text-xs text-gray-500">{app.email} — {app.phone}</p>
                      <p className="text-xs font-semibold text-primary mt-0.5 uppercase tracking-wider">
                        {app.serviceType.replace('-', ' ')}
                      </p>
                      {app.assignedLawyerName && (
                        <p className="text-xs text-gray-700 mt-1">
                          Experto asignado: <strong>{app.assignedLawyerName}</strong>
                        </p>
                      )}

                      {/* Google Meet enlace en Modal del Día */}
                      {app.modality === 'remota' || app.meetLink ? (
                        <div className="mt-2 text-xs">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            <Video className="h-3 w-3 text-blue-600" /> Virtual Meet
                          </span>
                          {app.meetLink && (
                            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-blue-900 bg-white px-2 py-1 rounded border border-blue-200">
                              <span className="truncate max-w-[180px]">{app.meetLink}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(app.meetLink!);
                                  setCopiedLinkId(app.id);
                                  setTimeout(() => setCopiedLinkId(null), 2000);
                                }}
                                className="text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-0.5 shrink-0 bg-blue-50 px-1.5 py-0.5 rounded"
                                title="Copiar enlace"
                              >
                                {copiedLinkId === app.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                                {copiedLinkId === app.id ? 'Copiado' : 'Copiar'}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Building2 className="h-3 w-3 text-emerald-600" /> Presencial
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {app.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => openApproveModal(app)} className="text-green-700">
                          Aprobar
                        </Button>
                      )}
                      {app.status !== 'rejected' && app.status !== 'case_created' && (
                        <Button size="sm" variant="ghost" onClick={() => handleCancelAppointment(app)} className="text-red-600">
                          Cancelar
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => openAssignModal(app)}>
                        <UserCog className="h-3.5 w-3.5" /> Experto
                      </Button>
                      {app.status !== 'case_created' && (
                        <Button size="sm" onClick={() => openConvertModal(app)}>
                          <FolderPlus className="h-3.5 w-3.5" /> Caso
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Paginación de citas del día (Máximo 5 por página) */}
            {totalDayPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 shrink-0 text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={dayModalPage === 1}
                  onClick={() => setDayModalPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>

                <span className="font-semibold text-gray-700">
                  Página {dayModalPage} de {totalDayPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={dayModalPage === totalDayPages}
                  onClick={() => setDayModalPage((p) => Math.min(totalDayPages, p + 1))}
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end shrink-0">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedDayAppointments(null)}>
                Cerrar Detalle del Día
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Asignar Experto / Abogado a Cita */}
      {isAssignModalOpen && targetAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                Asignar Experto a la Cita
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAssignLawyer} className="space-y-4">
              <p className="text-xs text-gray-600">
                Cita de <strong>{targetAppointment.fullName}</strong> el día {targetAppointment.preferredDate} a las {targetAppointment.preferredTime}.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Seleccionar Abogado / Médico Especialista *</label>
                <select
                  value={assignLawyerId}
                  onChange={(e) => setAssignLawyerId(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                >
                  <option value={0}>Sin asignar (Equipo General)</option>
                  {lawyers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} — {l.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Guardar Asignación
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Iniciar Caso a partir de Cita */}
      {isConvertModalOpen && targetAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Aperturar Caso a partir de la Cita</h2>
                <p className="text-xs text-gray-500">Cliente solicitante: {targetAppointment.fullName}</p>
              </div>
              <button onClick={() => setIsConvertModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleConvertAppointmentToCase} className="mt-4 space-y-4">
              {errorMessage && <Alert variant="error" message={errorMessage} dismissible />}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Opción de Cliente *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClientOption('create')}
                    className={`flex items-center justify-center gap-2 p-2.5 text-xs font-semibold rounded-lg border transition-all ${clientOption === 'create'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Crear Nuevo Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientOption('existing')}
                    className={`flex items-center justify-center gap-2 p-2.5 text-xs font-semibold rounded-lg border transition-all ${clientOption === 'existing'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    Elegir del Maestro
                  </button>
                </div>
              </div>

              {clientOption === 'create' ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1 text-amber-800">
                  <p><strong>Datos que se guardarán en el Maestro de Clientes:</strong></p>
                  <p>• Nombre: {targetAppointment.fullName}</p>
                  <p>• Correo: {targetAppointment.email}</p>
                  <p>• Teléfono: {targetAppointment.phone}</p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-1">
                    Se generará automáticamente un Código de Verificación de 8 caracteres para el cliente.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cliente Seleccionado *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      onClick={() => setIsClientPickerOpen(true)}
                      value={
                        selectedClientObj
                          ? `${selectedClientObj.fullName} (${selectedClientObj.email})`
                          : ''
                      }
                      placeholder="Haga clic en la lupa 🔍 para buscar cliente..."
                      className="flex-1 cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => { setIsClientPickerOpen(true); setSearchClientTerm(''); }}
                      className="flex items-center justify-center p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                      title="Buscar cliente en el Maestro"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Asignar Abogado / Médico Especialista *</label>
                <select
                  value={selectedLawyerId}
                  onChange={(e) => setSelectedLawyerId(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                >
                  <option value={0}>Equipo Jurídico Alianza Salud</option>
                  {lawyers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} — {l.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Título del Caso *</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción Inicial *</label>
                <textarea
                  rows={3}
                  required
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-primary focus:outline-none resize-y"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsConvertModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Aperturar Caso y Asignar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Secundario: Buscador de Cliente con Lupa para Citas */}
      {isClientPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Buscar y Seleccionar Cliente del Maestro
              </h3>
              <button onClick={() => setIsClientPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar por nombre, correo, cédula o código..."
                value={searchClientTerm}
                onChange={(e) => setSearchClientTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none shadow-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white">
              {filteredModalClients.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  No se encontraron clientes que coincidan con la búsqueda.
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredModalClients.map((cli) => {
                      const isSelected = selectedClientId === cli.id;
                      return (
                        <tr key={cli.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900">{cli.fullName}</div>
                            <div className="text-xs text-gray-500">{cli.email}</div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-amber-800">
                            {cli.verificationCode}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant={isSelected ? 'primary' : 'outline'}
                              onClick={() => {
                                setSelectedClientId(cli.id);
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

            <div className="pt-2 flex items-center justify-end shrink-0">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsClientPickerOpen(false)}>
                Cerrar Buscador
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Aprobación de Cita (Selección de Modalidad Presencial / Remota & Google Meet) */}
      {isApproveModalOpen && targetAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
                <h3 className="text-lg font-extrabold text-gray-900">Aprobar Solicitud de Cita</h3>
              </div>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-gray-900 text-sm">
                <span>{targetAppointment.fullName}</span>
                <span className="text-primary font-mono">{targetAppointment.preferredTime}</span>
              </div>
              <p className="text-gray-500">{targetAppointment.email} • {targetAppointment.phone}</p>
              <p className="font-semibold text-primary uppercase tracking-wider text-[11px]">
                {targetAppointment.serviceType.replace('-', ' ')} — {targetAppointment.preferredDate}
              </p>
            </div>

            <form onSubmit={handleConfirmApprove} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Seleccionar Modalidad de Atención <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setApproveModality('presencial')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all text-xs font-bold gap-1.5 ${approveModality === 'presencial'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    <span>Presencial en Sede</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setApproveModality('remota');
                      if (!approveMeetLink) setApproveMeetLink(generateRandomMeetUrl());
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all text-xs font-bold gap-1.5 ${approveModality === 'remota'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    <Video className="h-5 w-5 text-blue-600" />
                    <span>Consulta Virtual (Google Meet)</span>
                  </button>
                </div>
              </div>

              {approveModality === 'remota' && (
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      Enlace de Videoconsulta Google Meet
                    </label>
                    <button
                      type="button"
                      onClick={() => setApproveMeetLink(generateRandomMeetUrl())}
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" /> Generar nuevo
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      required
                      value={approveMeetLink}
                      onChange={(e) => setApproveMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="flex-1 rounded-xl border border-blue-300 bg-white px-3 py-2 text-xs font-mono text-blue-900 focus:border-blue-500 focus:outline-none shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(approveMeetLink);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="rounded-xl border border-blue-300 bg-white px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 flex items-center gap-1 shrink-0 transition-colors"
                      title="Copiar enlace"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {isCopied ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Este enlace será enviado automáticamente por correo electrónico al cliente y quedará disponible en su panel personal.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsApproveModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar y Enviar Notificación'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
