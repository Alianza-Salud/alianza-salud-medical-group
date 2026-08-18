import { FileText, ShieldCheck, CheckCircle2, ArrowRight, UploadCloud, FileCheck, Stethoscope, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface PreliminaryReviewSectionProps {
  onOpenModal: () => void;
}

export function PreliminaryReviewSection({ onOpenModal }: PreliminaryReviewSectionProps) {
  const documentTypes = [
    { title: 'IPAT / Informe Tránsito', desc: 'Informe policial o de autoridad de accidentes de tránsito.' },
    { title: 'Historia Clínica', desc: 'Antecedentes, registros de urgencias y evoluciones médicas.' },
    { title: 'Epicrisis', desc: 'Resumen médico de egreso hospitalario o intervenciones quirúrgicas.' },
    { title: 'Incapacidades Médicas', desc: 'Soportes de tiempo de reposo e incapacidad otorgados.' },
    { title: 'Dictámenes Anteriores', desc: 'Valoraciones previas de ARL, AFP o Juntas de Calificación.' },
    { title: 'Imágenes Diagnósticas', desc: 'Radiografías, resonancias o tomografías de la zona afectada.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          {/* Columna Izquierda: Mensaje y CTA */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200 mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Revisión Preliminar Sin Costo ni Compromiso</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ¿Tu accidente te dejó secuelas?{' '}
              <span className="text-primary block mt-1">Revisamos gratuitamente tu caso</span>
            </h2>

            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Si después de un accidente de tránsito, accidente laboral o atención médica continúas con dolor, fracturas, cirugías o limitaciones para trabajar, realizamos un estudio inicial sin ningún costo de contratación previa.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">
                  <strong>Evaluamos la viabilidad:</strong> Analizamos los soportes que tengas y te indicamos si existe mérito para un dictamen pericial.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">
                  <strong>Orientación clara:</strong> Te explicamos qué documentos te faltan y el costo exacto antes de contratar.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">
                  <strong>Sin compromisos:</strong> Tú decides si continúas con la valoración médica presencial o remota.
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button size="lg" onClick={onOpenModal}>
                <UploadCloud className="h-5 w-5" />
                QUIERO QUE REVISEN MI CASO
              </Button>
            </div>
          </div>

          {/* Columna Derecha: Documentos Aceptados */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              ¿Qué documentos puedes enviarnos?
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              No es necesario que tengas todos los soportes para comenzar. Puedes enviarnos los que tengas disponibles a la mano.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {documentTypes.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-gray-200 shadow-2xs hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span>{doc.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-tight">{doc.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 font-medium">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Importante:</strong> La revisión preliminar es puramente orientativa y técnico-médica. No garantiza porcentajes fijos de PCLO ni promete montos de indemnización.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
