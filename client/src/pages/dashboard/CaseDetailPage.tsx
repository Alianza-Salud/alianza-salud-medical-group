import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Clock,
  FileText,
  Plus,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useAuth } from '../../context/AuthContext';
import {
  fetchCaseById,
  updateCaseStage,
  addCaseUpdate,
  addCaseDocument,
  updateCaseLawyers,
} from '../../services/caseService';
import { fetchLawyers } from '../../services/lawyerService';
import type { Lawyer } from '../../types/lawyer';
import type { LegalCase } from '../../types/case';
import { CASE_STAGES } from '../../components/cases/CaseStageStepper';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { cn } from '../../lib/utils';

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState<LegalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados de formularios
  const [selectedStatus, setSelectedStatus] = useState<string>('in_progress');
  const [selectedStage, setSelectedStage] = useState<string>(CASE_STAGES[0]);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  // Formulario Documento
  const [showDocForm, setShowDocForm] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('recibido');
  const [docDescription, setDocDescription] = useState('');
  const [docVisibleToClient, setDocVisibleToClient] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // Formulario Novedad
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDesc, setUpdateDesc] = useState('');
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);

  // Modal Reasignar Especialistas
  const [isLawyersModalOpen, setIsLawyersModalOpen] = useState(false);
  const [allLawyers, setAllLawyers] = useState<Lawyer[]>([]);
  const [editingLawyerIds, setEditingLawyerIds] = useState<number[]>([]);
  const [isUpdatingLawyers, setIsUpdatingLawyers] = useState(false);

  const isStaff = user?.role === 'admin' || user?.role === 'auxiliar_admisiones' || user?.role === 'lawyer';

  const handleSaveLawyers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData) return;
    setIsUpdatingLawyers(true);
    setAlertMsg(null);
    const res = await updateCaseLawyers(caseData.id, editingLawyerIds);
    setIsUpdatingLawyers(false);
    if (res.success) {
      setAlertMsg({ type: 'success', message: 'Especialistas asignados al caso actualizados exitosamente.' });
      setIsLawyersModalOpen(false);
      loadCase();
    } else {
      setAlertMsg({ type: 'error', message: res.message || 'Error al actualizar especialistas.' });
    }
  };

  usePageMeta(
    caseData ? `Detalle ${caseData.caseCode}` : 'Detalle del Caso',
    'Expediente detallado del caso médico-pericial'
  );

  const loadCase = async () => {
    if (!id) return;
    setLoading(true);
    const data = await fetchCaseById(Number(id));
    if (data) {
      setCaseData(data);
      setSelectedStatus(data.status);
      setSelectedStage(data.stage);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCase();
  }, [id]);

  const handleStageStatusChange = async (newStage?: string, newStatus?: string) => {
    if (!caseData) return;
    const stageToSet = newStage || selectedStage;
    const statusToSet = newStatus || selectedStatus;

    setIsUpdatingStage(true);
    setAlertMsg(null);

    const res = await updateCaseStage(caseData.id, stageToSet, statusToSet);
    setIsUpdatingStage(false);

    if (res.success) {
      setAlertMsg({ type: 'success', message: 'Etapa y estado del caso actualizados.' });
      loadCase();
    } else {
      setAlertMsg({ type: 'error', message: res.message || 'Error al actualizar.' });
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData || (!docName.trim() && !selectedFile)) return;

    setIsAddingDoc(true);
    setAlertMsg(null);

    const res = await addCaseDocument(caseData.id, {
      name: docName || selectedFile?.name || 'Documento Adjunto',
      type: docType,
      description: docDescription,
      visibleToClient: docVisibleToClient,
      file: selectedFile || undefined,
    });

    setIsAddingDoc(false);

    if (res.success) {
      setAlertMsg({ type: 'success', message: 'Documento subido exitosamente al expediente.' });
      setDocName('');
      setDocDescription('');
      setDocVisibleToClient(false);
      setSelectedFile(null);
      setShowDocForm(false);
      loadCase();
    } else {
      setAlertMsg({ type: 'error', message: res.message || 'Error al adjuntar documento.' });
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData || !updateTitle.trim() || !updateDesc.trim()) return;

    setIsAddingUpdate(true);
    setAlertMsg(null);

    const res = await addCaseUpdate(caseData.id, {
      title: updateTitle,
      description: updateDesc,
      stageName: caseData.stage,
    });

    setIsAddingUpdate(false);

    if (res.success) {
      setAlertMsg({ type: 'success', message: 'Novedad registrada en el caso.' });
      setUpdateTitle('');
      setUpdateDesc('');
      setShowUpdateForm(false);
      loadCase();
    } else {
      setAlertMsg({ type: 'error', message: res.message || 'Error al registrar novedad.' });
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Cargando expediente del caso..." />;
  }

  if (!caseData) {
    return (
      <div className="py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">Caso no encontrado</h2>
        <p className="mt-2 text-sm text-gray-600">El expediente solicitado no existe o fue eliminado.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button variant="outline"><ArrowLeft className="h-4 w-4" /> Volver a Casos</Button>
        </Link>
      </div>
    );
  }

  const currentStageIndex = CASE_STAGES.findIndex(
    (s) => s.toLowerCase() === caseData.stage.toLowerCase()
  );
  const activeIdx = currentStageIndex >= 0 ? currentStageIndex : 0;

  return (
    <div className="space-y-6">
      {/* Header Nivel Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            title="Volver a la lista de casos"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
                {caseData.caseCode}
              </span>
              <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                Código Cliente: {caseData.verificationCode}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{caseData.title}</h1>
          </div>
        </div>

        {/* Estado badge */}
        <div className="flex items-center gap-3">
          {caseData.status === 'closed' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
              <CheckCircle2 className="h-4 w-4 text-green-600" /> Caso Finalizado / Cerrado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Clock className="h-4 w-4 text-emerald-600" /> En Gestión Activa
            </span>
          )}
        </div>
      </div>

      {alertMsg && <Alert variant={alertMsg.type} message={alertMsg.message} dismissible />}

      {/* Grid Principal: 2 columnas en Desktop (Izquierda: Detalle, Documentos, Novedades | Derecha: Stepper Vertical de 12 Etapas) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Información + Documentos + Novedades (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card Información Básica */}
          <Card>
            <CardHeader className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Información del Expediente</h2>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Cliente</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{caseData.clientName}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Correo de Contacto</span>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{caseData.clientEmail}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Teléfono</span>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{caseData.clientPhone || 'No registrado'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Tipo de Caso (Lesión)</span>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-gray-900">{caseData.caseType || 'Peritaje Médico General'}</span>
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Especialistas / Médicos Legistas Asignados</span>
                    {isStaff && (
                      <button
                        type="button"
                        onClick={async () => {
                          const llist = await fetchLawyers();
                          setAllLawyers(llist);
                          const currentIds = caseData.assignedLawyers ? caseData.assignedLawyers.map((l) => l.id) : (caseData.lawyerId ? [caseData.lawyerId] : []);
                          setEditingLawyerIds(currentIds);
                          setIsLawyersModalOpen(true);
                        }}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Gestionar Especialistas
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {caseData.assignedLawyers && caseData.assignedLawyers.length > 0 ? (
                      caseData.assignedLawyers.map((l) => (
                        <span key={l.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {l.fullName} <span className="text-[10px] text-gray-500">({l.specialty || 'Especialista'})</span>
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        <ShieldCheck className="h-3.5 w-3.5 text-gray-500" />
                        {caseData.assignedLawyerName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500 uppercase font-semibold">Descripción del Caso</span>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {caseData.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card Cambio de Estado y Etapa (Solo Staff) */}
          {isStaff && (
            <Card>
              <CardHeader className="border-b border-gray-100 pb-3">
                <h2 className="text-base font-semibold text-gray-900">Actualizar Estado y Etapa del Caso</h2>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4 sm:grid-cols-2 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Estado General</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                    >
                      <option value="pending">Evaluación Inicial (pending)</option>
                      <option value="in_progress">En Proceso / Activo (in_progress)</option>
                      <option value="closed">Cerrado / Finalizado (closed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Etapa Activa</label>
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-primary focus:outline-none"
                    >
                      {CASE_STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    size="sm"
                    isLoading={isUpdatingStage}
                    onClick={() => handleStageStatusChange()}
                  >
                    Guardar Cambios de Estado / Etapa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seccion Documentos del Caso */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Documentos del Expediente</h2>
                <p className="text-xs text-gray-500">Dictámenes, historias clínicas y archivos adjuntos.</p>
              </div>
              {isStaff && (
                <Button
                  size="sm"
                  variant={showDocForm ? 'outline' : 'primary'}
                  onClick={() => setShowDocForm(!showDocForm)}
                >
                  <Plus className="h-4 w-4" />
                  {showDocForm ? 'Cancelar' : 'Cargar Documento'}
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Formulario Cargar Documento */}
              {showDocForm && (
                <form onSubmit={handleAddDocument} className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" /> Cargar Nuevo Documento
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre del Documento *</label>
                      <input
                        type="text"
                        placeholder="Ej. Dictamen Pericial PCLO Final"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Documento</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none bg-white"
                      >
                        <option value="recibido">Documento Recibido (Historia Clínica, etc.)</option>
                        <option value="generado">Documento Generado (Borrador pericial)</option>
                        <option value="entregable">Documento Entregable (Dictamen Oficial)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Anexar Archivo Real (.pdf, .docx, .txt, .png, etc.)</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          if (!docName) setDocName(file.name);
                        }
                      }}
                      className="w-full text-xs text-gray-600 border border-gray-300 rounded-lg p-2 bg-white cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción / Notas (Opcional)</label>
                    <textarea
                      rows={2}
                      placeholder="Observaciones sobre el documento..."
                      value={docDescription}
                      onChange={(e) => setDocDescription(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none bg-white resize-y"
                    />
                  </div>

                  {/* Switch/Checkbox de Visibilidad para Cliente */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
                    <input
                      id="visibleToClientCheckbox"
                      type="checkbox"
                      checked={docVisibleToClient}
                      onChange={(e) => setDocVisibleToClient(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="visibleToClientCheckbox" className="text-xs font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                      {docVisibleToClient ? (
                        <Eye className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Permitir que el cliente vea y descargue este documento</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="submit" size="sm" isLoading={isAddingDoc}>
                      Subir y Guardar Documento
                    </Button>
                  </div>
                </form>
              )}

              {/* Lista de Documentos */}
              {!caseData.documents || caseData.documents.length === 0 ? (
                <p className="text-xs text-gray-500 italic text-center py-4">
                  No hay documentos registrados en el expediente.
                </p>
              ) : (
                <div className="space-y-2">
                  {caseData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white transition-colors gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                          {doc.description && <p className="text-xs text-gray-600 mt-0.5">{doc.description}</p>}
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-400">
                            <span>Tipo: <strong className="capitalize">{doc.type}</strong></span>
                            <span>•</span>
                            <span>Cargado por: {doc.uploadedByName}</span>
                            <span>•</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString('es-CO')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {doc.visibleToClient ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Eye className="h-3.5 w-3.5 text-emerald-600" /> Visible Cliente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            <EyeOff className="h-3.5 w-3.5 text-gray-400" /> Privado / Interno
                          </span>
                        )}

                        {doc.filePath && (
                          <a
                            href={`http://localhost:3001${doc.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm"
                          >
                            <Upload className="h-3.5 w-3.5 rotate-180" /> Descargar
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sección Novedades / Historial de Movimientos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Historial de Novedades</h2>
                <p className="text-xs text-gray-500">Registro cronológico de movimientos del caso.</p>
              </div>
              {isStaff && (
                <Button
                  size="sm"
                  variant={showUpdateForm ? 'outline' : 'primary'}
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                >
                  <Plus className="h-4 w-4" />
                  {showUpdateForm ? 'Cancelar' : 'Agregar Novedad'}
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {showUpdateForm && (
                <form onSubmit={handleAddUpdate} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Título de la Novedad *</label>
                    <input
                      type="text"
                      placeholder="Ej. Recepción de Historia Clínica de Urgencias"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción / Detalle *</label>
                    <textarea
                      rows={3}
                      placeholder="Detalles sobre este avance..."
                      value={updateDesc}
                      onChange={(e) => setUpdateDesc(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none bg-white resize-y"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button type="submit" size="sm" isLoading={isAddingUpdate}>
                      Registrar Novedad
                    </Button>
                  </div>
                </form>
              )}

              {!caseData.updates || caseData.updates.length === 0 ? (
                <p className="text-xs text-gray-500 italic text-center py-4">No hay novedades registradas aún.</p>
              ) : (
                <div className="relative border-l-2 border-primary/20 ml-3 space-y-6 py-2">
                  {caseData.updates.map((u) => (
                    <div key={u.id} className="relative pl-6">
                      <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-white" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-gray-900">{u.title}</h4>
                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                          {u.stageName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{u.description}</p>
                      <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        <span>{u.createdByName}</span>
                        <span>•</span>
                        <span>{new Date(u.createdAt).toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Vista de las Etapas Moderna (Vertical Stepper 1 a 12) (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="sticky top-20 border-primary/20 shadow-md p-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 mb-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Progreso de Etapas</span>
                </h3>
                <span className="text-xs font-mono font-bold bg-white/15 text-emerald-300 px-2.5 py-1 rounded-md border border-white/10 shrink-0">
                  {activeIdx + 1} / {CASE_STAGES.length}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Etapas cumplidas marcadas en verde.
              </p>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-2.5 max-h-[calc(100vh-200px)] overflow-y-auto bg-slate-50/30">
              {CASE_STAGES.map((stageName, idx) => {
                const isPassed = idx < activeIdx;
                const isCurrent = idx === activeIdx;

                return (
                  <div
                    key={stageName}
                    onClick={() => {
                      if (isStaff && !isUpdatingStage) {
                        setSelectedStage(stageName);
                        handleStageStatusChange(stageName);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                      isStaff && 'cursor-pointer hover:shadow-sm',
                      isCurrent && 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/30 text-emerald-950 font-bold',
                      isPassed && 'border-green-200 bg-green-50 text-green-900',
                      !isPassed && !isCurrent && 'border-gray-200 bg-gray-50/70 text-gray-400'
                    )}
                  >
                    {/* Número o Check verde */}
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 transition-colors',
                        isPassed && 'bg-green-600 text-white shadow-sm',
                        isCurrent && 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300',
                        !isPassed && !isCurrent && 'bg-gray-200 text-gray-500'
                      )}
                    >
                      {isPassed ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-xs leading-snug',
                        isCurrent && 'font-bold text-emerald-900',
                        isPassed && 'font-semibold text-green-800',
                        !isPassed && !isCurrent && 'text-gray-500'
                      )}>
                        {stageName}
                      </p>
                      {isCurrent && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <Clock className="h-3 w-3 animate-spin text-emerald-600" /> Etapa Activa
                        </span>
                      )}
                    </div>

                    {isPassed && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Reasignar Especialistas */}
      {isLawyersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Asignar Especialistas al Caso
              </h3>
              <button onClick={() => setIsLawyersModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <AlertCircle className="h-5 w-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSaveLawyers} className="space-y-4">
              <p className="text-xs text-gray-600">
                Seleccione los especialistas o médicos legistas asignados al expediente del cliente.
              </p>

              <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-300 p-2.5 bg-white space-y-1.5">
                {allLawyers.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No hay especialistas registrados en el Maestro.</p>
                ) : (
                  allLawyers.map((l) => {
                    const isChecked = editingLawyerIds.includes(l.id);
                    return (
                      <label
                        key={l.id}
                        className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-primary bg-primary/5 text-primary font-bold'
                            : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingLawyerIds((prev) => [...prev, l.id]);
                              } else {
                                setEditingLawyerIds((prev) => prev.filter((id) => id !== l.id));
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                          <span>{l.fullName}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">({l.specialty})</span>
                      </label>
                    );
                  })
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsLawyersModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isUpdatingLawyers}>
                  Guardar Especialistas
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
