# PROMPT PARA GEMINI — MEJORA DE LA PÁGINA WEB PÚBLICA
## Alianza Salud Medical Group — Injury Management

## 1. Contexto

Estoy desarrollando una plataforma web para Alianza Salud Medical Group, Medellín, Colombia, como parte de mis prácticas académicas.

Stack:
- React
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- MySQL

En esta etapa debes trabajar **únicamente sobre la página web pública**.

---

## 2. Tarea principal

Debes **mejorar la página pública existente, NO reconstruirla desde cero**.

Antes de modificar código:

1. Inspecciona completamente el repositorio.
2. Identifica páginas y componentes existentes.
3. Identifica componentes reutilizables.
4. Identifica el sistema visual.
5. Identifica las secciones actuales.
6. Identifica funcionalidades existentes.
7. Identifica textos y contenidos.
8. Determina qué mantener, modificar, agregar y reubicar.

Primero analiza y después implementa.

**No elimines componentes funcionales solamente porque puedan hacerse de otra manera.**

---

## 3. Objetivo estratégico

La página debe evolucionar de una página principalmente informativa hacia una página orientada a:

> **CAPTACIÓN DE CLIENTES CON NECESIDADES MÉDICO-PERICIALES**

El visitante debe entender rápidamente que:
- Puede enviar su caso.
- Puede enviar los documentos disponibles.
- Existe una revisión preliminar sin costo.
- El equipo puede revisar preliminarmente la información.
- Puede recibir orientación sobre los siguientes pasos.
- Puede recibir una cotización antes de contratar.
- Puede agendar una valoración cuando corresponda.

CTA principal:

> **QUIERO QUE REVISEN MI CASO**

El botón **Agendar valoración** debe mantenerse como alternativa.

No eliminar funcionalidades existentes que continúen siendo útiles.

---

## 4. Concepto central: Injury Management

La empresa se considera conceptualmente una organización de:

> **INJURY MANAGEMENT / MANEJO DE LESIONES**

El proceso general es:

```text
1. Análisis de viabilidad
   / estudio inicial de nexo causal
              ↓
2. Valoración y exámenes
   complementarios con especialistas
              ↓
3. Informe técnico y pericial
              ↓
4. Entrega
```

Este debe ser el proceso principal comunicado por la página.

No presentar la empresa principalmente como una firma jurídica.

El componente jurídico es complementario.

---

## 5. Servicios principales

Mantener:

### Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO)

### Informe médico especializado de tipo pericial

No es necesario que estos servicios dominen el Hero. Primero debe comunicarse el problema del usuario y después explicar los servicios técnicos.

---

## 6. Tipos principales de casos

Usar exactamente estas tres categorías:

1. **Accidentes de tránsito**
2. **Accidentes laborales**
3. **Negligencia y responsabilidad médica**

**Importante:** no separar negligencia médica y responsabilidad médica en categorías diferentes.

---

## 7. Idea principal de captación

Una de las ideas de la toma de requerimientos es:

### ¿TU ACCIDENTE TE DEJÓ SECUELAS?

> Revisamos gratuitamente tu caso.

Puede tratarse de personas con:
- Fracturas.
- Cirugías.
- Dolor persistente.
- Limitaciones para trabajar.
- Dificultades para movilizarse.
- Otras secuelas.

CTA:

> **QUIERO QUE REVISEN MI CASO**

---

## 8. Revisión preliminar

El usuario puede comenzar enviando los documentos que tenga disponibles:

- IPAT o informe de accidente de tránsito.
- Epicrisis.
- Historia clínica.
- Incapacidades.
- Dictámenes o valoraciones anteriores.
- Imágenes diagnósticas.
- Otros soportes.

No es necesario tener todos los documentos.

La página debe reducir la fricción para iniciar el proceso.

---

## 9. Qué ocurre después

### 1. Envíanos tus documentos

El usuario proporciona la información disponible.

### 2. Revisamos preliminarmente el caso

Se puede orientar sobre:
- Antecedentes médicos relevantes.
- Lesiones y posibles secuelas documentadas.
- Documentación disponible.
- Documentación que podría faltar.
- Conveniencia de una valoración especializada.
- Ruta que podría corresponder.
- Costo de continuar.

### 3. Recibes orientación y cotización

Si existen elementos suficientes:
- Se explica el proceso.
- Se explica el alcance.
- Se informa el costo/honorarios.
- El cliente decide si continúa.

**No afirmar que la revisión preliminar garantiza indemnización, porcentaje de pérdida de capacidad laboral o resultado favorable.**

---

## 10. Campañas que deben inspirar la estructura

No colocar necesariamente las campañas completas en la página principal. Deben servir como inspiración para mensajes, segmentación, CTA y futuras landing pages.

### Campaña — General

**¿Tu accidente te dejó secuelas?**

### Campaña — Motociclistas

**¿Accidente en moto?**

Orientada a personas con fracturas, cirugías, dolores, limitaciones o secuelas.

CTA conceptual:
> Envíanos tu IPAT o historia clínica.

### Campaña — Dinero / derechos

> ¿Tuviste un accidente de tránsito y no sabes si puedes reclamar una indemnización?

No adivines. Haz revisar tu caso por profesionales.

### Campaña — Segunda oportunidad

> ¿Ya te dijeron que tu accidente "no era para tanto"?

Si continúas con dolor, limitaciones o secuelas, puedes solicitar una revisión especializada del caso.

---

## 11. No convertir la página principal en publicidad

Las campañas deben inspirar:
- Mensajes.
- Segmentación.
- CTA.
- Secciones.
- Futuras landing pages.

No llenar la página principal con cuatro bloques publicitarios extensos.

---

## 12. Estructura recomendada

Usa la página existente como base:

```text
HEADER
├── Inicio
├── Servicios
├── Cómo funciona
├── Casos
├── Nosotros
├── Preguntas frecuentes
├── [QUIERO QUE REVISEN MI CASO]
└── Iniciar sesión

HERO
├── Problema del usuario
├── Injury Management
├── Revisión preliminar sin costo
├── [QUIERO QUE REVISEN MI CASO]
└── [AGENDAR CITA]

INJURY MANAGEMENT
└── Explicación sencilla

REVISIÓN PRELIMINAR
├── Envíanos tus documentos
├── Revisamos tu caso
├── Te orientamos
└── Te explicamos el siguiente paso
└── [QUIERO QUE REVISEN MI CASO]

TIPOS DE CASOS
├── Accidentes de tránsito
├── Accidentes laborales
└── Negligencia y responsabilidad médica

SERVICIOS
├── PCLO
└── Informe médico especializado de tipo pericial

DOCUMENTOS
└── Qué puedes enviarnos

PROCESO
├── 1. Viabilidad / nexo causal
├── 2. Valoración + especialistas
├── 3. Informe técnico y pericial
└── 4. Entrega

DIFERENCIALES / ¿POR QUÉ NOSOTROS?
└── Reutilizar y mejorar contenido actual

CAMPAÑAS / SITUACIONES
├── Accidentes de tránsito
├── Motociclistas
├── ¿No sabes si puedes reclamar?
└── Segunda oportunidad

ACOMPAÑAMIENTO JURÍDICO
└── Servicio complementario

PREGUNTAS FRECUENTES

CTA FINAL
├── QUIERO QUE REVISEN MI CASO
└── AGENDAR CITA

CONTACTO
FOOTER
```

Es una guía, no una obligación rígida. Si el proyecto existente tiene una organización mejor, reutilízala.

---

## 13. Hero

El Hero debe cambiar significativamente.

No debe ser exclusivamente técnico ni comenzar con una explicación larga de PCLO.

Conceptualmente:

> ## ¿TU ACCIDENTE TE DEJÓ SECUELAS?
>
> Si después de un accidente tienes dolor, limitaciones, fracturas, cirugías u otras secuelas, podemos realizar una revisión preliminar de tu caso sin costo.
>
> Analizamos la información disponible y te orientamos sobre los siguientes pasos.

CTA principal:
> **QUIERO QUE REVISEN MI CASO**

CTA secundario:
> **AGENDAR VALORACIÓN**

Debe quedar claro que la revisión preliminar no implica contratar inmediatamente el servicio.

---

## 14. Sección Injury Management

Crear o adaptar una sección:

> **INJURY MANAGEMENT**
> **Manejo integral de lesiones**

Explicar de forma sencilla que la empresa acompaña el proceso desde el análisis inicial hasta la elaboración y entrega del informe técnico y pericial.

No utilizar lenguaje innecesariamente técnico.

---

## 15. Sección "¿Quieres que revisemos tu caso?"

Debe ser muy visible.

Mensaje central:

> **Revisión preliminar sin costo**

Puede comenzar con los documentos disponibles.

Mostrar ejemplos de documentos.

CTA:
> **QUIERO QUE REVISEN MI CASO**

Diseñar esta sección pensando que posteriormente el botón abrirá un formulario funcional.

---

## 16. Preparar el futuro formulario

Aunque ahora pueda ser estático, preparar la interfaz para posteriormente implementar:

```text
Nombre
Apellido
Teléfono
Correo
Tipo de caso
Descripción breve
Documentos
Autorizaciones
```

Tipos de caso:

```text
Accidente de tránsito
Accidente laboral
Negligencia y responsabilidad médica
```

No desarrollar todavía el backend completo si el alcance actual es frontend.

---

## 17. Agendamiento

**NO eliminar el agendamiento actual.**

Debe existir como alternativa:

```text
¿QUÉ NECESITAS?

[QUIERO QUE REVISEN MI CASO]

o

[QUIERO AGENDAR UNA CITA]
```

El primer camino es el principal.

---

## 18. Proceso de Injury Management

Adaptar la sección actual a las cuatro etapas:

### 01 — Análisis de viabilidad
Estudio inicial del caso y análisis del nexo causal.

### 02 — Valoración y exámenes complementarios
Valoración médica y participación de especialistas cuando corresponda.

### 03 — Informe técnico y pericial
Análisis y elaboración del informe correspondiente.

### 04 — Entrega
Entrega de resultados y documentación correspondiente.

Si la página actual tiene "admisión y documentación", no es obligatorio eliminarlo. Puede formar parte de la recepción:

```text
ENVÍAS TU CASO
      ↓
ADMISIÓN Y REVISIÓN INICIAL
      ↓
1. VIABILIDAD
      ↓
2. VALORACIÓN
      ↓
3. INFORME
      ↓
4. ENTREGA
```

---

## 19. Tipos de casos

Crear una sección clara:

### Accidentes de tránsito

Fracturas, cirugías, dolor persistente, limitaciones funcionales y otras secuelas.

### Accidentes laborales

Lesiones derivadas de accidentes ocurridos en el contexto laboral.

### Negligencia y responsabilidad médica

Situaciones en las que una persona considera que una atención o procedimiento médico pudo haber generado lesiones o secuelas.

**No inventar información médica, legal o clínica.**

---

## 20. Documentos

Crear:

### ¿Qué documentos puedes enviarnos?

Mostrar:
- IPAT.
- Historia clínica.
- Epicrisis.
- Incapacidades.
- Dictámenes anteriores.
- Imágenes diagnósticas.
- Otros soportes.

Mensaje:

> No necesitas tener todos los documentos para comenzar. Puedes enviarnos los que tengas disponibles.

CTA:
> **QUIERO QUE REVISEN MI CASO**

---

## 21. Servicios

Mantener la sección actual de servicios.

Los servicios centrales son:
- PCLO.
- Informe médico especializado de tipo pericial.

No eliminar esta sección. Reubicarla dentro de la narrativa si es necesario.

---

## 22. Acompañamiento jurídico

**NO eliminar.**

Reducir su protagonismo y dejarlo claramente como servicio complementario.

Conceptualmente:

> Si durante tu proceso necesitas orientación o acompañamiento jurídico y aún no cuentas con abogado, podemos informarte sobre las opciones disponibles.

No presentar la empresa como una firma jurídica.

No afirmar que siempre se asignará un abogado.

---

## 23. Diferenciales

Mantener y mejorar la sección actual.

Puede incluir:
- Evaluación integral.
- Rigor médico-pericial.
- Valoración especializada.
- Participación de especialistas.
- Gestión del proceso.
- Soporte técnico-pericial.
- Acompañamiento.
- Confidencialidad.

No inventar certificaciones, experiencia, cifras o credenciales.

---

## 24. Confidencialidad

Mantener una sección clara:

### Tu información es confidencial

Los documentos médicos contienen información sensible.

Comunicar que la información será tratada conforme a las autorizaciones correspondientes y las normas aplicables.

No hacer afirmaciones legales específicas no confirmadas por la empresa.

---

## 25. Aviso de alcance

Mantener un aviso similar a:

> La revisión preliminar es orientativa y no garantiza un porcentaje de pérdida de capacidad laboral ni el reconocimiento de una indemnización. Cada caso debe ser evaluado individualmente por profesionales competentes.

No prometer:
- Indemnizaciones.
- Porcentajes.
- Resultados favorables.
- Éxito jurídico.
- Reconocimiento de derechos.

---

## 26. Campañas futuras

Preparar la arquitectura para futuras landing pages:

```text
/
 /campanas
    /motociclistas
    /accidentes-transito
    /segunda-oportunidad
    /revision-indemnizacion
```

No implementarlas ahora salvo que ya exista una estructura adecuada para ello.

---

## 27. Diseño visual

La identidad gráfica definitiva todavía no está completamente disponible.

Por tanto:
- Mantener la identidad visual actual si funciona.
- Mantener colores y componentes existentes cuando sean apropiados.
- No rehacer completamente el branding.
- No inventar una nueva identidad corporativa.
- Priorizar estructura, jerarquía, UX y conversión.
- Mantener diseño médico/profesional.
- Mantener responsive.
- Mantener accesibilidad razonable.

Objetivo actual:

> **Mejorar funcionalidad, estructura y experiencia antes del refinamiento visual definitivo.**

---

## 28. Qué NO hacer

NO:
- Reconstruir toda la aplicación desde cero.
- Eliminar componentes útiles.
- Eliminar el agendamiento.
- Eliminar Servicios.
- Eliminar Nosotros.
- Eliminar Contacto.
- Eliminar el acceso de clientes.
- Convertir la web en una firma jurídica.
- Inventar información.
- Inventar especialistas.
- Inventar certificaciones.
- Inventar estadísticas.
- Inventar testimonios.
- Hacer promesas de indemnización.
- Separar negligencia médica y responsabilidad médica.
- Implementar todavía todo el backend.
- Implementar todavía los paneles privados.
- Sobrecargar la página principal con campañas.

---

## 29. Qué SÍ hacer

SÍ:
- Reutilizar la página actual.
- Mejorar la jerarquía.
- Mejorar el Hero.
- Convertir "Quiero que revisen mi caso" en CTA principal.
- Mantener "Agendar valoración" como CTA secundario.
- Incorporar Injury Management.
- Incorporar revisión preliminar sin costo.
- Incorporar envío de documentos como puerta de entrada.
- Mantener PCLO.
- Mantener informe médico-pericial.
- Mostrar los 3 tipos de casos.
- Adaptar el proceso a 4 etapas.
- Mantener acompañamiento jurídico como servicio complementario.
- Mantener las secciones útiles actuales.
- Preparar la arquitectura para captación futura.
- Preparar componentes para formularios.
- Mantener escalabilidad.
- Mantener responsive.
- Mantener código limpio y modular.

---

## 30. Arquitectura futura

La página pública debe quedar preparada para:

```text
Página pública
      ↓
Formulario de captación
      ↓
Backend Express
      ↓
MySQL
      ↓
Lead / Caso
      ↓
Auxiliar de admisiones
      ↓
Proceso de Injury Management
      ↓
Cliente
```

Posteriormente:

```text
Cliente
├── Estado del caso
├── Etapas
├── Novedades
├── Citas
├── Documentos
└── Descargas
```

Y:

```text
Administrador
├── Clientes
├── Casos
├── Usuarios
├── Citas
├── Documentos
└── Configuración
```

No implementar estas áreas ahora.

---

## 31. Criterios de aceptación

La mejora es correcta si:

- La página continúa funcionando.
- No se rompe la navegación existente.
- Se conserva el diseño visual base.
- Se conserva responsive.
- Se mantiene el acceso de inicio de sesión.
- Se mantiene el agendamiento.
- Se mantienen servicios y contacto.
- Injury Management queda claro.
- La captación se convierte en el objetivo principal.
- "QUIERO QUE REVISEN MI CASO" es el CTA principal.
- La revisión preliminar sin costo queda claramente explicada.
- El envío de documentos queda contemplado.
- Los tres tipos de casos están correctamente representados.
- PCLO e informe médico-pericial continúan visibles.
- El proceso refleja las cuatro etapas.
- El componente jurídico queda claramente como complementario.
- No existen promesas o afirmaciones no verificadas.
- La arquitectura queda preparada para futuras funcionalidades.
- El código sigue siendo modular y mantenible.

---

## 32. Forma de trabajo obligatoria

Antes de escribir código, entrega un diagnóstico breve:

```text
## Mantener
- ...

## Modificar
- ...

## Agregar
- ...

## Reubicar
- ...

## Eliminar únicamente si es necesario
- ...

## Componentes reutilizables
- ...

## Componentes nuevos necesarios
- ...
```

Después del diagnóstico, implementa los cambios directamente.

No esperes confirmación después del diagnóstico.

Trabaja sobre el código existente.

Prioridad:

1. Funcionalidad.
2. Estructura.
3. UX.
4. Captación.
5. Responsive.
6. Diseño visual.

No sobreingenierices.

No hagas cambios innecesarios.

---

## 33. Nuevo posicionamiento

La página debe evolucionar desde:

> **"Conoce nuestros servicios médico-periciales y agenda una valoración."**

hacia:

> **"¿Tu accidente te dejó secuelas? Envíanos tu caso. Realizamos una revisión preliminar y te orientamos sobre los siguientes pasos."**

Detrás de esta captación está:

```text
REVISIÓN PRELIMINAR
        ↓
ANÁLISIS DE VIABILIDAD
        ↓
VALORACIÓN + ESPECIALISTAS
        ↓
INFORME TÉCNICO Y PERICIAL
        ↓
ENTREGA
```

Concepto central:

> **INJURY MANAGEMENT — MANEJO DE LESIONES**

La página debe ser profesional, clara, confiable y principalmente orientada a **convertir visitantes en personas que envían su caso para una revisión preliminar**.

---

# INSTRUCCIÓN FINAL

**Inspecciona primero el proyecto existente y mejora sobre esa base.**

No reconstruyas la aplicación desde cero.

No elimines funcionalidades útiles.

No inventes información.

No implementes todavía las áreas privadas.

El resultado debe sentirse como una **evolución natural y profesional de la página actual**, pero con una estrategia de captación mucho más clara y alineada con el concepto de Injury Management.
