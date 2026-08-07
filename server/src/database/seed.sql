-- =============================================
-- BASE DE DATOS: alianza_salud
-- Datos Iniciales / Seeds
-- =============================================

USE `alianza_salud`;

-- ---------------------------------------------
-- Poblar servicios jurídicos
-- ---------------------------------------------
INSERT INTO `services` (`slug`, `name`, `short_description`, `description`, `icon`, `situations`, `process_steps`, `cta_text`, `is_active`)
VALUES
(
  'negligencia-medica',
  'Negligencia Médica',
  'Asesoría y representación jurídica en casos donde se presuma que un profesional de la salud no proporcionó el estándar de cuidado adecuado.',
  'Si usted o un familiar ha sufrido daños como consecuencia de una presunta negligencia por parte de un profesional o institución de salud, nuestro equipo jurídico, respaldado por especialistas médicos, puede evaluar su caso para determinar si existió una desviación del estándar de cuidado esperado. Ofrecemos acompañamiento integral durante todo el proceso.',
  'Stethoscope',
  '["Diagnósticos presuntamente errados o tardíos", "Errores presuntos durante procedimientos quirúrgicos", "Administración inadecuada de medicamentos", "Falta de seguimiento post-operatorio", "Infecciones asociadas a la atención en salud", "Alta prematura sin evaluación completa"]',
  '["Evaluación inicial gratuita de su caso", "Revisión de la historia clínica y documentación", "Concepto médico especializado", "Análisis jurídico del caso", "Definición de la estrategia legal", "Representación y seguimiento"]',
  'Solicitar evaluación de caso',
  1
),
(
  'responsabilidad-medica',
  'Responsabilidad Médica',
  'Evaluación y acompañamiento jurídico en casos de presunta responsabilidad por parte de profesionales o instituciones de salud.',
  'La responsabilidad médica abarca situaciones en las que un profesional o institución de salud puede ser considerado responsable por daños causados a un paciente. Nuestro equipo evalúa cada caso de manera integral, combinando el análisis jurídico con valoraciones médicas especializadas para determinar la viabilidad de la reclamación.',
  'ShieldCheck',
  '["Daños derivados de tratamientos médicos", "Complicaciones no informadas al paciente", "Falta de consentimiento informado", "Demoras injustificadas en la atención", "Deficiencias en la prestación del servicio de salud", "Responsabilidad institucional de clínicas y hospitales"]',
  '["Consulta inicial para conocer su situación", "Recopilación de documentación clínica", "Evaluación médica por especialistas", "Dictamen jurídico sobre viabilidad", "Inicio de acciones legales si procede", "Seguimiento integral del proceso"]',
  'Consultar sobre mi caso',
  1
),
(
  'accidentes-transito',
  'Accidentes de Tránsito',
  'Representación jurídica para víctimas de accidentes de tránsito, incluyendo la gestión de reclamaciones y procesos asociados.',
  'Si usted ha sido víctima de un accidente de tránsito, nuestro equipo jurídico le ofrece acompañamiento integral para la gestión de su caso. Evaluamos las circunstancias del accidente, la responsabilidad de las partes involucradas y los daños sufridos para definir la mejor estrategia de reclamación.',
  'Car',
  '["Colisiones vehiculares con lesiones personales", "Atropellamientos", "Accidentes en motocicleta", "Accidentes con vehículos de transporte público", "Siniestros con daños materiales y personales", "Fallecimiento como consecuencia de un accidente vial"]',
  '["Atención inmediata de su caso", "Recopilación de evidencias y documentación", "Evaluación médica de las lesiones", "Análisis de responsabilidad", "Gestión de reclamaciones", "Representación legal y seguimiento"]',
  'Reportar mi caso',
  1
),
(
  'indemnizaciones-accidentes',
  'Indemnización por Accidentes de Tránsito',
  'Gestión de procesos de indemnización y reclamación económica por daños sufridos en accidentes de tránsito.',
  'Más allá de la representación legal inmediata, nuestro equipo se especializa en la gestión de indemnizaciones por accidentes de tránsito. Evaluamos los daños físicos, psicológicos y económicos para buscar una compensación justa que cubra los perjuicios sufridos.',
  'Scale',
  '["Lesiones personales con incapacidad temporal o permanente", "Gastos médicos derivados del accidente", "Lucro cesante por incapacidad laboral", "Daño moral y psicológico", "Daños a terceros", "Reclamaciones ante aseguradoras"]',
  '["Evaluación integral de los daños", "Valoración médica de las secuelas", "Cálculo de la indemnización potencial", "Negociación con las partes responsables", "Proceso judicial si es necesario", "Seguimiento hasta la resolución"]',
  'Consultar sobre indemnización',
  1
),
(
  'cirugia-estetica',
  'Responsabilidad por Cirugías Estéticas',
  'Asesoría jurídica en casos de presunta responsabilidad derivada de procedimientos o cirugías estéticas.',
  'Los procedimientos estéticos conllevan riesgos que deben ser debidamente informados al paciente. Cuando los resultados se desvían significativamente de lo acordado o se producen complicaciones por presunta mala praxis, nuestro equipo jurídico, con apoyo de especialistas médicos, evalúa la viabilidad de la reclamación.',
  'HeartPulse',
  '["Resultados no conformes con lo pactado", "Complicaciones post-operatorias por presunta mala praxis", "Falta de consentimiento informado adecuado", "Procedimientos realizados por personal no cualificado", "Infecciones o daños derivados del procedimiento", "Publicidad engañosa sobre procedimientos estéticos"]',
  '["Análisis de la documentación previa al procedimiento", "Evaluación del consentimiento informado", "Valoración médica especializada del resultado", "Determinación de la viabilidad jurídica", "Inicio de acciones legales correspondientes", "Acompañamiento hasta la resolución"]',
  'Evaluar mi caso',
  1
),
(
  'otros-servicios',
  'Otros Servicios Jurídicos',
  'Consultoría jurídica en otros casos relacionados con el ámbito médico, de salud y responsabilidad civil.',
  'Además de nuestras áreas principales de especialización, Alianza Salud Medical Group ofrece consultoría jurídica en otros casos relacionados con el ámbito médico y de responsabilidad. Si su situación no encaja exactamente en las categorías anteriores, no dude en contactarnos para una evaluación personalizada.',
  'Briefcase',
  '["Casos de responsabilidad civil relacionados con salud", "Reclamaciones ante entidades de salud", "Casos de derechos del paciente", "Situaciones no contempladas en las categorías anteriores"]',
  '["Contacto inicial para describir su situación", "Evaluación preliminar del caso", "Orientación sobre las opciones disponibles", "Definición del plan de acción", "Acompañamiento personalizado"]',
  'Contactar para evaluación',
  1
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------------------------------------------
-- Poblar información institucional / site_info
-- ---------------------------------------------
INSERT INTO `site_info` (`setting_key`, `setting_value`)
VALUES
('company_name', 'Alianza Salud Medical Group'),
('tagline', 'Acompañamiento jurídico especializado con respaldo médico integral'),
('phone', '+57 (XXX) XXX-XXXX'),
('email', 'contacto@alianzasalud.com.co'),
('address', 'Medellín, Colombia'),
('city', 'Medellín, Colombia'),
('schedule', 'Lunes a Viernes: 8:00 AM - 6:00 PM'),
('history', 'Alianza Salud Medical Group nació con la visión de integrar la práctica médica especializada y la consultoría jurídica en Medellín, Colombia.'),
('mission', 'Brindar soluciones y asesoría jurídica integral respaldada por conceptos médicos científicos de alta calidad.'),
('vision', 'Ser la organización líder en Colombia en el acompañamiento interdisciplinario en responsabilidad médica y derecho de la salud.'),
('values', '["Ética profesional", "Excelencia técnica", "Empatía con las víctimas", "Transparencia", "Rigor científico"]')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);
