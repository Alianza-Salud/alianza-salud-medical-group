import { FileText, ShieldCheck, CheckCircle2, UploadCloud, FileCheck, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface PreliminaryReviewSectionProps {
  onOpenModal: () => void;
}

export function PreliminaryReviewSection({ onOpenModal }: PreliminaryReviewSectionProps) {
  const documentTypes = [
    { title: 'IPAT / Informe Tránsito', desc: 'Informe policial o de autoridad de tránsito.' },
    { title: 'Historia Clínica', desc: 'Registros de urgencias y evoluciones.' },
    { title: 'Epicrisis Hospitalaria', desc: 'Resumen egreso u operaciones.' },
    { title: 'Incapacidades Médicas', desc: 'Soportes de reposo asignados.' },
    { title: 'Dictámenes Anteriores', desc: 'Valoraciones previas ARL/AFP.' },
    { title: 'Imágenes Diagnósticas', desc: 'Radiografías o tomografías.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Columna Izquierda: Mensaje y CTA */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal variant="fadeUp" delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Revisión Preliminar Sin Costo ni Compromiso</span>
              </div>
            </Reveal>

            <Reveal variant="blurReveal" delay={80}>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl leading-tight">
                ¿Tienes secuelas?{' '}
                <span className="text-primary block mt-1">Revisamos gratuitamente tus antecedentes</span>
              </h2>
            </Reveal>

            <Reveal variant="fadeUp" delay={160}>
              <p className="text-base text-gray-600 leading-relaxed">
                Si tras un accidente de tránsito, accidente laboral o atención médica tienes secuelas, dolor persistente o cirugías, realizamos un estudio inicial sin ningún compromiso de contratación.
              </p>
            </Reveal>

            <Reveal variant="fadeUp" delay={240}>
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">
                    <strong>Evaluamos la viabilidad:</strong> Analizamos los soportes que tengas y te indicamos si existe mérito pericial.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">
                    <strong>Orientación transparente:</strong> Te explicamos qué documentos faltan y el costo exacto antes de contratar.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">
                    <strong>Sin compromisos:</strong> Tú decides si continúas con la valoración técnica.
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal variant="fadeUp" delay={320}>
              <div className="pt-3">
                <Button size="lg" onClick={onOpenModal} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20">
                  <UploadCloud className="h-5 w-5" />
                  QUIERO QUE REVISEN MI CASO
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Columna Derecha: Tarjetas Flotantes de Documentos */}
          <div className="lg:col-span-6">
            <Reveal variant="fadeScale" delay={200}>
              <div className="rounded-3xl border border-gray-200/90 bg-gray-50/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
                
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Soportes y Documentos Aceptados
                </h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  Puedes adjuntar los documentos que tengas a mano. <strong>No es obligatorio tener todos para comenzar.</strong>
                </p>

                {/* Grid con Animación Flotante al Hover */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {documentTypes.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500/50 hover:-translate-y-1 hover:rotate-[0.5deg] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                        <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-tight">{doc.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 font-medium">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transparencia:</strong> La revisión preliminar es exclusivamente médico-orientativa. No sustituye trámites judiciales ni promete porcentajes fijos de PCLO.
                  </span>
                </div>

              </div>
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  );
}
