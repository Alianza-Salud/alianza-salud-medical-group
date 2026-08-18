import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  PhoneCall,
  FolderPlus,
  XCircle,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  ShieldCheck,
  X,
  Save,
  UserPlus,
  Users,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  fetchCaseReviewPetitions,
  updatePetitionStatus,
  convertPetitionToCase,
  downloadPetitionDocument,
  type CaseReviewPetition,
} from '../../services/caseReviewService';
import { fetchClients } from '../../services/clientService';
import type { Client } from '../../types/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';

export default function CaseReviewRequestsPage() {
  usePageMeta('Solicitudes de Revisión', 'Gestión de Leads y Peticiones de Revisión Preliminar de Casos');
  const navigate = useNavigate();

  const [petitions, setPetitions] = useState<CaseReviewPetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal de Detalle y Gestión
  const [selectedPetition, setSelectedPetition] = useState<CaseReviewPetition | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal Sub-diálogo de Conversión (Crear o Seleccionar Cliente)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [existingClients, setExistingClients] = useState<Client[]>([]);
  const [conversionMode, setConversionMode] = useState<'create' | 'existing'>('create');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [newClientData, setNewClientData] = useState({
    fullName: '',
    email: '',
    phone: '',
    documentId: '',
    address: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchCaseReviewPetitions(statusFilter);
    setPetitions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const openDetails = (p: CaseReviewPetition) => {
    setSelectedPetition(p);
    setAdminNotes(p.adminNotes || '');
    setAlertMsg(null);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedPetition) return;
    setIsUpdatingStatus(true);
    setAlertMsg(null);

    const res = await updatePetitionStatus(selectedPetition.id, newStatus, adminNotes);
    setIsUpdatingStatus(false);

    if (res.success) {
      setAlertMsg({ type: 'success', message: res.message || 'Estado actualizado exitosamente.' });
      setSelectedPetition((prev) => (prev ? { ...prev, status: newStatus as any, adminNotes } : null));
      loadData();
    } else {
      setAlertMsg({ type: 'error', message: res.message || 'Error al actualizar estado.' });
    }
  };

  const openConvertModal = async () => {
    if (!selectedPetition) return;
    setNewClientData({
      fullName: selectedPetition.fullName,
      email: selectedPetition.email,
      phone: selectedPetition.phone,
      documentId: '',
      address: '',
    });
    setConversionMode('create');
    setSelectedClientId(null);

    // Cargar lista de clientes existentes del Maestro
    const clients = await fetchClients();
    setExistingClients(clients);
    if (clients.length > 0) {
      // Si el correo ya coincide con un cliente existente, pre-seleccionarlo
      const match = clients.find((c) => c.email.toLowerCase() === selectedPetition.email.toLowerCase());
      if (match) {
        setConversionMode('existing');
        setSelectedClientId(match.id);
      }
    }
    setIsConvertModalOpen(true);
  };

  const handleConfirmConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetition) return;

    let payload: { clientId?: number; clientData?: typeof newClientData } = {};

    if (conversionMode === 'existing') {
      if (!selectedClientId) {
        alert('Debe seleccionar un cliente existente de la lista.');
        return;
      }
      payload.clientId = selectedClientId;
    } else {
      if (!newClientData.fullName.trim() || !newClientData.email.trim()) {
        alert('Por favor complete el nombre y correo del nuevo cliente.');
        return;
      }
      payload.clientData = newClientData;
    }

    setIsUpdatingStatus(true);
    setAlertMsg(null);

    const res = await convertPetitionToCase(selectedPetition.id, payload);
    setIsUpdatingStatus(false);
    setIsConvertModalOpen(false);

    if (res.success && res.caseId) {
      alert(`¡Expediente de Caso #${res.caseId} aperturado exitosamente! Se han vinculado los datos y documentos adjuntos.`);
      setSelectedPetition(null);
      navigate(`/dashboard/casos/${res.caseId}`);
    } else {
      setAlertMsg({ type: 'error', message: res.message || 'Error al convertir en expediente.' });
    }
  };

  const filteredPetitions = petitions.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.caseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = petitions.filter((p) => p.status === 'pending').length;
  const inReviewCount = petitions.filter((p) => p.status === 'in_review' || p.status === 'contacted').length;
  const convertedCount = petitions.filter((p) => p.status === 'converted').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600" /> Pendiente
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <FileSearch className="h-3.5 w-3.5 text-blue-600" /> En Revisión
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <PhoneCall className="h-3.5 w-3.5 text-purple-600" /> Contactado
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Expediente Creado
          </span>
        );
      case 'discarded':
        return (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle className="h-3.5 w-3.5 text-gray-500" /> Descartado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileSearch className="h-7 w-7 text-primary" />
          Solicitudes de Revisión Preliminar (Leads)
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Visualice y gestione las solicitudes de revisión preliminar sin costo enviadas por los clientes desde la web pública.
        </p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Solicitudes Pendientes</p>
              <h3 className="text-2xl font-extrabold text-amber-900 mt-1">{pendingCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">En Revisión / Contactados</p>
              <h3 className="text-2xl font-extrabold text-blue-900 mt-1">{inReviewCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <PhoneCall className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Convertidos a Expediente</p>
              <h3 className="text-2xl font-extrabold text-emerald-900 mt-1">{convertedCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono, correo o tipo de caso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'in_review', label: 'En Revisión' },
            { id: 'contacted', label: 'Contactados' },
            { id: 'converted', label: 'Convertidos' },
            { id: 'discarded', label: 'Descartados' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Peticiones */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando solicitudes de revisión..." />
      ) : filteredPetitions.length === 0 ? (
        <Card className="text-center p-12">
          <FileSearch className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No se encontraron solicitudes de revisión con los filtros aplicados.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Cliente / Contacto</th>
                <th className="px-6 py-4">Tipo de Caso</th>
                <th className="px-6 py-4">Adjuntos</th>
                <th className="px-6 py-4">Fecha Envío</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPetitions.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{p.fullName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span>{p.email}</span>
                      <span>•</span>
                      <span className="font-mono">{p.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 text-xs">
                    {p.caseType}
                  </td>
                  <td className="px-6 py-4">
                    {p.documents && p.documents.length > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        {p.documents.length} soporte(s)
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sin adjuntos</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(p.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => openDetails(p)}>
                      <Eye className="h-4 w-4" />
                      Ver Detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Principal de Detalle y Gestión del Lead */}
      {selectedPetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Solicitud de Revisión Preliminar #{selectedPetition.id}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedPetition.fullName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPetition(null)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {alertMsg && (
                <Alert variant={alertMsg.type === 'success' ? 'success' : 'error'}>
                  {alertMsg.message}
                </Alert>
              )}

              {/* Información de Contacto */}
              <div className="grid gap-4 sm:grid-cols-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Nombre</span>
                    <span className="text-xs font-bold text-gray-900">{selectedPetition.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Teléfono / WhatsApp</span>
                    <span className="text-xs font-bold text-gray-900 font-mono">{selectedPetition.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Correo Electrónico</span>
                    <span className="text-xs font-bold text-gray-900 truncate">{selectedPetition.email}</span>
                  </div>
                </div>
              </div>

              {/* Detalle del Caso */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Tipo de Caso & Descripción Aportada
                </h4>
                <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase">
                    {selectedPetition.caseType}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedPetition.description || 'El cliente no agregó descripción adicional.'}
                  </p>
                </div>
              </div>

              {/* Documentos Adjuntos */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Soportes y Documentos Adjuntos ({selectedPetition.documents?.length || 0})
                </h4>
                {selectedPetition.documents && selectedPetition.documents.length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedPetition.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-xs font-semibold text-gray-900 truncate">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadPetitionDocument(selectedPetition.id, idx, doc.name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-primary text-white hover:bg-primary-dark shrink-0 cursor-pointer"
                        >
                          <Upload className="h-3 w-3 rotate-180" /> Descargar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No se adjuntaron archivos en esta solicitud.</p>
                )}
              </div>

              {/* Notas de Admisiones */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Notas Internas de Admisiones / Peritos
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Escriba aquí notas de seguimiento, llamadas realizadas o evaluación de viabilidad..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* Acciones del Lead */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleUpdateStatus('contacted')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300 transition-colors cursor-pointer"
                  >
                    Marcar Contactado
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('in_review')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 transition-colors cursor-pointer"
                  >
                    En Revisión
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('discarded')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors cursor-pointer"
                  >
                    Descartar
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    onClick={() => handleUpdateStatus(selectedPetition.status)}
                    variant="outline"
                    size="sm"
                    disabled={isUpdatingStatus}
                  >
                    <Save className="h-4 w-4" />
                    Guardar Notas
                  </Button>

                  {selectedPetition.status !== 'converted' && (
                    <Button
                      onClick={openConvertModal}
                      size="sm"
                      disabled={isUpdatingStatus}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      <FolderPlus className="h-4 w-4" />
                      Convertir a Caso
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal de Conversión (Crear o Seleccionar Cliente) */}
      {isConvertModalOpen && selectedPetition && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-900 to-primary-dark p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderPlus className="h-5 w-5 text-emerald-400" />
                  Convertir Solicitud a Expediente de Caso
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  Asigne o cree el cliente para la apertura del expediente en MySQL.
                </p>
              </div>
              <button
                onClick={() => setIsConvertModalOpen(false)}
                className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmConversion} className="p-6 space-y-5">
              {/* Opciones de Selección de Cliente */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Selección de Cliente
                </label>
                
                <div className="grid gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      conversionMode === 'create'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="conversionMode"
                      checked={conversionMode === 'create'}
                      onChange={() => setConversionMode('create')}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-bold flex items-center gap-1.5 text-gray-900">
                        <UserPlus className="h-4 w-4 text-primary" />
                        Crear un NUEVO Cliente en el Maestro
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Registrar al cliente con los datos de contacto enviados en la solicitud de revisión.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                      conversionMode === 'existing'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="conversionMode"
                      checked={conversionMode === 'existing'}
                      onChange={() => setConversionMode('existing')}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-bold flex items-center gap-1.5 text-gray-900">
                        <Users className="h-4 w-4 text-primary" />
                        Seleccionar un Cliente EXISTENTE del Maestro ({existingClients.length})
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Vincular el expediente a un cliente ya registrado previamente en el sistema.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Formulario Modo Crear Nuevo Cliente */}
              {conversionMode === 'create' && (
                <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo del Cliente *</label>
                    <input
                      type="text"
                      required
                      value={newClientData.fullName}
                      onChange={(e) => setNewClientData({ ...newClientData, fullName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none bg-white"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={newClientData.email}
                        onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={newClientData.phone}
                        onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Número de Cédula / Documento</label>
                      <input
                        type="text"
                        placeholder="Ej. 1020304050"
                        value={newClientData.documentId}
                        onChange={(e) => setNewClientData({ ...newClientData, documentId: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Dirección / Ciudad</label>
                      <input
                        type="text"
                        placeholder="Ej. Medellín, Antioquia"
                        value={newClientData.address}
                        onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario Modo Seleccionar Cliente Existente */}
              {conversionMode === 'existing' && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Seleccionar Cliente Registrado *
                  </label>
                  {existingClients.length === 0 ? (
                    <p className="text-xs text-amber-700 font-medium">
                      No hay clientes registrados en el Maestro. Por favor elija la opción de crear cliente nuevo.
                    </p>
                  ) : (
                    <select
                      value={selectedClientId || ''}
                      onChange={(e) => setSelectedClientId(Number(e.target.value))}
                      required
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium focus:border-primary focus:outline-none bg-white"
                    >
                      <option value="">-- Seleccione un cliente del listado --</option>
                      {existingClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} ({c.email}) {c.documentId ? `- Cédula: ${c.documentId}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Acciones Modal */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsConvertModalOpen(false)}>
                  Cancelar
                </Button>
                <Button size="sm" type="submit" disabled={isUpdatingStatus} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  {isUpdatingStatus ? 'Creando Expediente...' : 'Confirmar & Aperturar Caso'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
