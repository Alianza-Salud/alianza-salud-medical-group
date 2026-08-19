import { useState } from 'react';
import { ChevronDown, HelpCircle, FileSearch, ShieldCheck, Stethoscope } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

const faqs = [
  {
    question: '¿La revisión preliminar de mi caso tiene algún costo?',
    answer:
      'No. La revisión preliminar de antecedentes y soportes médicos es 100% gratuita y sin ningún compromiso legal o de contratación. Evaluamos tus documentos disponibles y te indicamos si existe viabilidad pericial.',
  },
  {
    question: '¿Necesito tener la historia clínica completa para que revisen mi caso?',
    answer:
      'No es obligatorio tener la historia clínica completa para comenzar. Puedes adjuntarnos los documentos que tengas a la mano (IPAT, Epicrisis, Incapacidades, etc.) y nuestros profesionales te indicarán si se requiere solicitar algún soporte adicional.',
  },
  {
    question: '¿Qué es una Calificación de Pérdida de Capacidad Laboral (PCLO)?',
    answer:
      'Es la evaluación médico-científica que determina objetivamente el porcentaje de secuela o pérdida funcional que sufrió una persona tras un accidente o enfermedad, respaldada mediante dictamen pericial oficiales.',
  },
  {
    question: '¿Cómo se lleva a cabo la valoración médica presencial o remota?',
    answer:
      'Contamos con atención presencial en nuestras sedes médicas y valoración remota especializada para la revisión de antecedentes, análisis físico-funcional y consolidación del informe pericial.',
  },
  {
    question: '¿En cuánto tiempo entregan el informe pericial o dictamen?',
    answer:
      'Una vez revisados los soportes completos y realizada la valoración especializada, el informe pericial oficial se expide en plazos ágiles y con estricto rigor técnico-científico.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <Reveal variant="fadeUp" delay={0}>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Preguntas Frecuentes
            </span>
          </Reveal>

          <Reveal variant="blurReveal" delay={80}>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Resuelve tus dudas sobre la revisión preliminar
            </h2>
          </Reveal>

          <Reveal variant="fadeUp" delay={160}>
            <p className="text-base text-gray-600">
              Información clara sobre el proceso de evaluación de secuelas corporales y dictámenes periciales.
            </p>
          </Reveal>
        </div>

        {/* Acordeón Interactivo */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={idx} variant="fadeUp" delay={180 + idx * 60}>
                <div className="rounded-2xl border border-gray-200/90 bg-white overflow-hidden transition-all duration-300 shadow-2xs hover:border-emerald-500/40">
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3 pr-4">
                      <HelpCircle className={`h-5 w-5 shrink-0 transition-colors ${isOpen ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 p-5 pt-0 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal pt-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
