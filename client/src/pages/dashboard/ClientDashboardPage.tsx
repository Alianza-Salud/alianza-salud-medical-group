import { useState, useEffect } from 'react';
import {
  FolderKanban,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { fetchCases } from '../../services/caseService';
import type { LegalCase } from '../../types/case';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CaseStageStepper } from '../../components/cases/CaseStageStepper';

export default function ClientDashboardPage() {
  usePageMeta('Mis Casos', 'Seguimiento de Casos y Novedades');
  const { user } = useAuth();
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  useEffect(() => {
    async function loadClientCases() {
      setIsLoading(true);
      const data = await fetchCases();
      setCases(data);
      if (data.length > 0) {
        setSelectedCaseId(data[0].id);
      }
      setIsLoading(false);
    }
    loadClientCases();
  }, []);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  return (
    <div className="space-y-8">
      {/* Header Cliente */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido(a), {user?.fullName}</h1>
        <p className="mt-1 text-sm text-gray-600">
          Consulte a continuación la etapa actual y el historial de novedades de sus casos jurídicos.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Cargando información de sus casos..." />
      ) : cases.length === 0 ? (
        <Card className="text-center p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
            <FolderKanban className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">No tiene casos vinculados actualmente</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Si su abogado o asesor ya aperturó un caso para usted, verifique haber activado su cuenta con su Código de Verificación de 8 caracteres.
          </p>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Columna izquierda: Lista de casos */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Sus Casos Registrados ({cases.length})
            </h2>

            <div className="space-y-3">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`cursor-pointer rounded-xl border p-5 transition-all ${
                    selectedCaseId === c.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{c.caseCode}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        c.status === 'closed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.status === 'closed' ? 'Finalizado' : 'En Proceso'}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-1">{c.title}</h3>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Etapa: {c.stage}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha: Detalle del caso + Stepper + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {activeCase && (
              <>
                {/* Info General del Caso */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary">{activeCase.caseCode}</span>
                        <h2 className="text-xl font-bold text-gray-900 mt-1">{activeCase.title}</h2>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                          <Clock className="h-3.5 w-3.5" />
                          {activeCase.stage}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-sm text-gray-700 leading-relaxed">{activeCase.description}</p>

                    {/* Stepper visual de etapas para el cliente */}
                    <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                      <CaseStageStepper currentStage={activeCase.stage} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-gray-100 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserCheck className="h-4 w-4 text-primary shrink-0" />
                        <span>Abogado Asignado: <strong>{activeCase.assignedLawyerName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        <span>Servicio: <strong className="capitalize">{activeCase.serviceSlug.replace('-', ' ')}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline de Movimientos y Novedades */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Historial de Novedades
                    </h3>
                  </CardHeader>

                  <CardContent>
                    {!activeCase.updates || activeCase.updates.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-6">
                        No hay novedades registradas hasta el momento en este caso.
                      </p>
                    ) : (
                      <div className="relative pl-6 space-y-6 border-l-2 border-primary/20">
                        {activeCase.updates.map((update, index) => (
                          <div key={update.id} className="relative">
                            <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-sm">
                              {index + 1}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{update.title}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(update.createdAt).toLocaleDateString()} — {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <span className="inline-block mt-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {update.stageName}
                              </span>

                              <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {update.description}
                              </p>

                              <p className="mt-3 text-xs text-gray-400 italic">
                                Publicado por: {update.createdByName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
