import { useState, useEffect } from 'react';
import {
  FolderKanban,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchCases, fetchCaseById, downloadDocument } from '../../services/caseService';
import type { LegalCase } from '../../types/case';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CASE_STAGES } from '../../components/cases/CaseStageStepper';
import { cn } from '../../lib/utils';

export default function ClientDashboardPage() {
  usePageMeta('Mis Casos', 'Seguimiento de Casos y Dictámenes Periciales');
  const { user } = useAuth();

  const [cases, setCases] = useState<LegalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadClientCases() {
      setIsLoading(true);
      const data = await fetchCases();
      setCases(data);
      setIsLoading(false);
    }
    loadClientCases();
  }, []);

  const handleOpenDetail = async (caseId: number) => {
    setIsDetailLoading(true);
    const detail = await fetchCaseById(caseId);
    if (detail) {
      setSelectedCase(detail);
    }
    setIsDetailLoading(false);
  };

  const handleBackToList = () => {
    setSelectedCase(null);
  };

  // Filtrar documentos visibles solo para el cliente
  const authorizedDocuments = selectedCase?.documents
    ? selectedCase.documents.filter((d) => d.visibleToClient)
    : [];

  return (
    <div className="space-y-6">
      {/* Header Cliente */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido(a), {user?.fullName}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Consulte la etapa actual, los documentos autorizados y las novedades de sus casos médico-periciales.
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando sus expedientes..." />
      ) : cases.length === 0 ? (
        <Card className="text-center p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">No tiene casos vinculados actualmente</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Si su asesor o médico legista ya aperturó un caso para usted, asegúrese de haber activado su cuenta con su Código de Verificación de 8 caracteres.
          </p>
        </Card>
      ) : selectedCase ? (
        /* ================= VISTA DE DETALLE DEL CASO (SOLO LECTURA) ================= */
        <div className="space-y-6">
          {/* Header del Caso */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToList}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                title="Volver a la lista de mis casos"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
                    {selectedCase.caseCode}
                  </span>
                  <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                    Código Verificación: {selectedCase.verificationCode}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedCase.title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedCase.status === 'closed' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Caso Finalizado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Clock className="h-4 w-4 text-emerald-600" /> En Proceso
                </span>
              )}
            </div>
          </div>

          {/* Grid Principal: Izquierda (Detalles, Docs, Novedades) | Derecha (Etapas Verticales en Verde) */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Columna Izquierda (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Información General */}
              <Card>
                <CardHeader className="border-b border-gray-100 pb-3">
                  <h3 className="text-base font-semibold text-gray-900">Información de su Caso</h3>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Servicio Pericial</span>
                      <p className="font-semibold text-gray-900 capitalize mt-0.5">
                        {selectedCase.serviceSlug.replace(/-/g, ' ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 uppercase font-semibold">Especialista Responsable</span>
                      <div className="flex items-center gap-2 font-semibold text-gray-900 mt-0.5">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>{selectedCase.assignedLawyerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Descripción / Antecedentes</span>
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {selectedCase.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Documentos Autorizados */}
              <Card>
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Documentos y Dictámenes Emitidos</h3>
                      <p className="text-xs text-gray-500">Archivos autorizados para su consulta y descarga.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {authorizedDocuments.length} Disponible(s)
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {authorizedDocuments.length === 0 ? (
                    <div className="text-center py-6">
                      <FileText className="mx-auto h-8 w-8 text-gray-300" />
                      <p className="mt-2 text-xs text-gray-500 italic">
                        Aún no se han publicado dictámenes o documentos autorizados para descarga.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {authorizedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow gap-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                              {doc.description && <p className="text-xs text-gray-600 mt-0.5">{doc.description}</p>}
                              <p className="text-[11px] text-gray-400 mt-1">
                                Publicado el {new Date(doc.createdAt).toLocaleDateString('es-CO')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Eye className="h-3.5 w-3.5 text-emerald-600" /> Disponible
                            </span>

                            {doc.downloadAvailable && (
                              <button
                                type="button"
                                onClick={() => downloadDocument(selectedCase.id, doc.id, doc.originalName || doc.name)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                              >
                                <Download className="h-3.5 w-3.5" /> Descargar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Historial de Novedades */}
              <Card>
                <CardHeader className="border-b border-gray-100 pb-3">
                  <h3 className="text-base font-semibold text-gray-900">Historial de Novedades del Proceso</h3>
                </CardHeader>
                <CardContent className="pt-4">
                  {!selectedCase.updates || selectedCase.updates.length === 0 ? (
                    <p className="text-xs text-gray-500 italic text-center py-4">No hay novedades registradas en su expediente aún.</p>
                  ) : (
                    <div className="relative border-l-2 border-primary/20 ml-3 space-y-6 py-2">
                      {selectedCase.updates.map((u) => (
                        <div key={u.id} className="relative pl-6">
                          <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-white" />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="text-sm font-bold text-gray-900">{u.title}</h4>
                            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">
                              {u.stageName}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{u.description}</p>
                          <div className="mt-2 text-[11px] text-gray-400">
                            <span>{u.createdByName}</span> • <span>{new Date(u.createdAt).toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna Derecha: Stepper Vertical de 12 Etapas (Solo Lectura, Verde) (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="sticky top-20 border-primary/20 shadow-md">
                <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-xl py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      Estado de su Peritaje
                    </h3>
                    <span className="text-xs font-mono font-bold bg-white/20 text-emerald-300 px-2 py-0.5 rounded">
                      {CASE_STAGES.findIndex((s) => s.toLowerCase() === selectedCase.stage.toLowerCase()) + 1} / {CASE_STAGES.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Etapas cumplidas en verde.
                  </p>
                </CardHeader>

                <CardContent className="p-4 space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto">
                  {(() => {
                    const activeIdx = CASE_STAGES.findIndex(
                      (s) => s.toLowerCase() === selectedCase.stage.toLowerCase()
                    );
                    const currentIdx = activeIdx >= 0 ? activeIdx : 0;

                    return CASE_STAGES.map((stageName, idx) => {
                      const isPassed = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={stageName}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                            isCurrent && 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/30 text-emerald-950 font-bold',
                            isPassed && 'border-green-200 bg-green-50 text-green-900',
                            !isPassed && !isCurrent && 'border-gray-200 bg-gray-50/70 text-gray-400'
                          )}
                        >
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
                                <Clock className="h-3 w-3 animate-spin text-emerald-600" /> Etapa Actual
                              </span>
                            )}
                          </div>

                          {isPassed && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                        </div>
                      );
                    });
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* ================= VISTA DE LISTA LIMPIA DE SUS CASOS (SOLO LECTURA) ================= */
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Código del Caso</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Caso</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Servicio</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Etapa Actual</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">
                          {c.caseCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{c.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Responsable: {c.assignedLawyerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-gray-700 capitalize">
                          {c.serviceSlug.replace(/-/g, ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {c.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          isLoading={isDetailLoading && selectedCase?.id === c.id}
                          onClick={() => handleOpenDetail(c.id)}
                        >
                          Ver detalles
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
