import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldCheck, FileText, AlertCircle, Send, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { submitCaseReviewPetition } from '../../services/caseReviewService';

interface CaseReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCaseType?: string;
}

export function CaseReviewModal({ isOpen, onClose, defaultCaseType = 'Accidente de tránsito' }: CaseReviewModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [caseType, setCaseType] = useState(defaultCaseType);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const MAX_FILE_SIZE_MB = 25;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
      if (oversized.length > 0) {
        setErrorMsg(`Uno o más archivos exceden el tamaño máximo permitido de ${MAX_FILE_SIZE_MB} MB: ${oversized.map((f) => f.name).join(', ')}`);
      }
      const valid = selected.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);
      setFiles((prev) => [...prev, ...valid]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Por favor complete su nombre, teléfono y correo electrónico.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Debe autorizar la revisión confidencial de sus antecedentes y el tratamiento de datos.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('caseType', caseType);
      formData.append('description', description);
      files.forEach((f) => formData.append('documents', f));

      const res = await submitCaseReviewPetition(formData);
      setIsSubmitting(false);

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.message || 'Error al enviar la solicitud de revisión.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Error al enviar la solicitud de revisión.');
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setDescription('');
    setFiles([]);
    setAcceptTerms(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-200/90 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Encabezado Nocturno con Resplandor */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-7 text-white relative border-b border-slate-800">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Revisión Preliminar Sin Costo ni Compromiso</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Envía tu caso para revisión médica preliminar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed font-normal">
            Analizamos tus documentos disponibles, evaluamos secuelas y te orientamos sobre la viabilidad técnico-médica.
          </p>
        </div>

        {/* Contenido del Formulario o Confirmación de Éxito */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  ¡Solicitud Recibida Exitosamente!
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-3">
                  Gracias, {fullName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed mt-2">
                  Nuestra Unidad de Admisiones y Peritaje analizará preliminarmente tus antecedentes y se comunicará contigo en breve al número <strong>{phone}</strong>.
                </p>
              </div>

              <div className="pt-3">
                <Button onClick={handleReset} size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8">
                  Entendido y Cerrar
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold animate-in fade-in duration-150">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mario Restrepo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300/90 px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +57 300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-300/90 px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300/90 px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">Tipo de Caso *</label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full rounded-xl border border-gray-300/90 px-3 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none bg-white font-medium transition-all"
                  >
                    <option value="Accidente de tránsito">Accidente de Tránsito (Autos / Motos)</option>
                    <option value="Accidente laboral">Accidente Laboral</option>
                    <option value="Negligencia y responsabilidad médica">Negligencia y Responsabilidad Médica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Descripción breve del accidente o secuelas
                </label>
                <textarea
                  rows={3}
                  placeholder="Cuéntanos brevemente qué ocurrió (fracturas, cirugías, dolor, limitaciones para trabajar)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-300/90 p-3.5 text-xs sm:text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none resize-none transition-all"
                />
              </div>

              {/* Selector de Documentos Estilizado */}
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-4 sm:p-5 hover:border-emerald-500/50 transition-colors">
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Adjuntar Documentos Disponibles (Opcional para comenzar)
                </label>
                <p className="text-[11px] text-gray-500 mb-3">
                  Puedes adjuntar IPAT, Historia Clínica, Epicrisis, Incapacidades o Imágenes diagnósticas (.pdf, .jpg, .png, máx. 25 MB por archivo). <strong>No es obligatorio tener todos.</strong>
                </p>

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-emerald-500 cursor-pointer shadow-2xs transition-all">
                    <Upload className="h-4 w-4 text-emerald-600" />
                    <span>Seleccionar Archivos</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-500 font-medium">
                    {files.length === 0 ? 'Sin archivos seleccionados' : `${files.length} archivo(s) listo(s)`}
                  </span>
                </div>

                {files.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-36 overflow-y-auto">
                    {files.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200 text-xs shadow-2xs">
                        <span className="flex items-center gap-2 text-gray-700 font-semibold truncate">
                          <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">({Math.round(f.size / 1024)} KB)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold ml-2 shrink-0 cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Autorización y Confidencialidad */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="acceptTerms" className="text-xs text-gray-600 leading-tight cursor-pointer font-medium">
                  Autorizo a Alianza Salud a evaluar confidencialmente los antecedentes aportados para emitir una orientación médica preliminar. Entiendo que la revisión no garantiza resultados legales o montos de indemnización.
                </label>
              </div>

              {/* Botón de Envío */}
              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 py-3.5 rounded-xl border-none"
                >
                  {isSubmitting ? (
                    'Enviando solicitud de revisión...'
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar caso para revisión preliminar sin costo
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
