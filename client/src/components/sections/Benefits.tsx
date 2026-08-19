import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, FileCheck, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { SpotlightCard } from '../ui/SpotlightCard';

export function Benefits() {
  const benefits = [
    {
      num: '01',
      icon: Award,
      title: 'Peritaje Médico de Alto Rigor',
      description:
        'Dictámenes estructurados bajo normativa técnico-legal colombiana y baremos vigentes para calificación de pérdida de capacidad laboral.',
    },
    {
      num: '02',
      icon: FileCheck,
      title: 'Evaluación Técnica Independiente',
      description:
        'Nuestros informes aportan pruebas médico-científicas objetivas para sustentar controversias ante aseguradoras, juntas o juzgados.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      title: 'Gestión Administrativa Agilizada',
      description:
        'La auxiliar de admisiones coordina la recepción de historias clínicas y el agendamiento eficiente de valoraciones.',
    },
    {
      num: '04',
      icon: Users,
      title: 'Opción de Derivación Jurídica',
      description:
        'Si el cliente no cuenta con abogado representante, ofrecemos la alternativa de acompañamiento jurídico especializado complementario.',
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Mensaje Principal */}
          <div className="lg:col-span-5 space-y-4">
            <Reveal variant="fadeUp" delay={0}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
                Diferencial Institucional
              </span>
            </Reveal>

            <Reveal variant="blurReveal" delay={80}>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl leading-tight">
                Respaldamos su caso con evidencia médica sólida
              </h2>
            </Reveal>

            <Reveal variant="fadeUp" delay={160}>
              <p className="text-base text-gray-600 leading-relaxed font-normal">
                En Alianza Salud Medical Group unimos la práctica médica pericial y el rigor científico para entregar calificaciones de PCLO e Informes Periciales Médicos de máxima confiabilidad.
              </p>
            </Reveal>

            <Reveal variant="fadeUp" delay={240}>
              <div className="pt-2">
                <Link to="/nosotros">
                  <Button variant="outline" size="lg" className="font-bold">
                    Conocer sobre la institución
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Grid de Beneficios con Spotlight Cards */}
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {benefits.map((b, index) => {
              const Icon = b.icon;
              return (
                <Reveal key={index} variant="fadeUp" delay={200 + index * 80}>
                  <SpotlightCard className="h-full group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono font-extrabold text-gray-400 group-hover:text-emerald-600 transition-colors">
                        {b.num}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-base group-hover:text-primary transition-colors mb-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {b.description}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
