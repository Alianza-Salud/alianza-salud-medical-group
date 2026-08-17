
## Alianza Salud Medical Group — Nuevo enfoque médico-pericial

> **INSTRUCCIÓN IMPORTANTE:** Este documento reemplaza el enfoque funcional anterior. Ya existe avance previo de la aplicación. **No empieces el proyecto desde cero ni borres funcionalidades útiles sin analizarlas primero.** Inspecciona el repositorio y adapta la arquitectura, navegación, contenido y componentes existentes al nuevo enfoque.

---

# 1. Nuevo enfoque del proyecto

El proyecto corresponde a las prácticas académicas y tiene como título:

**“Diseño y Desarrollo de una Plataforma Web para Captación de Clientes y Seguimiento de Casos Jurídicos en Alianza Salud Medical Group, Medellín, Colombia (Agosto 2026).”**

Después de una toma de requerimientos más profunda, el enfoque inicial cambió.

El enfoque anterior estaba centrado en la oferta de servicios jurídicos y la gestión de procesos judiciales. **Ese ya no es el objetivo principal.**

La plataforma debe estar orientada principalmente a la **captación, atención y gestión de clientes que requieren servicios médicos especializados de carácter pericial**, específicamente:

- **Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO).**
- **Informe médico especializado de tipo pericial.**

Los principales contextos de atención son:

1. Lesiones por accidentes de tránsito.
2. Lesiones por accidentes laborales.
3. Lesiones por negligencia y responsabilidad médica.

La propuesta principal de la plataforma es:

> **Captar personas que necesitan una evaluación médica especializada y/o un informe médico pericial para respaldar procesos relacionados con lesiones, pérdida de capacidad laboral y ocupacional u otros procedimientos correspondientes.**

La plataforma debe percibirse principalmente como un servicio **médico-pericial**, no como una firma jurídica.

---

# 2. Papel del componente jurídico

El componente jurídico continúa existiendo, pero es **complementario**.

Si un cliente requiere acompañamiento jurídico y todavía no cuenta con abogado, la empresa puede ofrecerle esta alternativa.

El flujo conceptual es:

```text
CAPTACIÓN
    ↓
NECESIDAD MÉDICO-PERICIAL
    ↓
Evaluación / PCLO / Informe pericial
    ↓
Resultado y documentación
    ↓
¿Necesita abogado?
    ├── No → Entrega/cierre
    └── Sí → Oferta o derivación jurídica
```

No convertir el área jurídica en el centro de la plataforma.

---

# 3. Objetivos funcionales

La plataforma debe permitir:

1. Captar potenciales clientes desde el sitio público.
2. Explicar claramente los servicios médico-periciales.
3. Permitir solicitar información o agendar una valoración.
4. Registrar y gestionar la información inicial del cliente.
5. Permitir que una auxiliar de admisiones gestione la recepción del caso.
6. Gestionar el proceso de evaluación médico-pericial.
7. Registrar etapas y novedades del caso.
8. Gestionar documentos relacionados con el caso.
9. Cargar documentos resultantes del proceso.
10. Permitir al cliente consultar y descargar documentos autorizados.
11. Permitir al administrador gestionar clientes, casos, citas, documentos y usuarios.
12. Permitir a la auxiliar de admisiones gestionar la admisión y seguimiento operativo, clientes.
13. Registrar si el cliente ya cuenta con abogado.
14. Registrar la necesidad de acompañamiento jurídico cuando corresponda.
15. Mantener una arquitectura escalable para futuras funcionalidades.

---

# 4. Stack tecnológico

Mantener el stack definido hasta ahora.

No reemplazar tecnologías existentes sin necesidad.

Si la primera fase todavía utiliza datos mock, mantenerlos separados de los componentes para poder sustituirlos posteriormente por llamadas a la API.

---

# 5. Usuarios y roles

## Administrador

Debe tener control global sobre:

- Usuarios.
- Clientes.
- Casos.
- Citas.
- Etapas.
- Novedades.
- Documentos.
- Servicios.
- Configuración.


## Auxiliar de admisiones

Debe poder:

- Recibir solicitudes.
- Registrar clientes.
- Revisar información inicial.
- Gestionar citas.
- Crear/actualizar casos.
- Hacer seguimiento de admisión.
- Solicitar y recibir documentos iniciales.
- Actualizar estados permitidos.
- Gestionar información operativa.

No debe tener automáticamente todos los permisos del administrador.

## Cliente

Debe poder:

- Registrarse/iniciar sesión.
- Consultar sus datos.
- Consultar sus casos.
- Ver el estado del proceso.
- Ver etapas autorizadas.
- Consultar novedades autorizadas.
- Consultar citas.
- Solicitar/agendar citas.
- Consultar documentos.
- Descargar documentos autorizados.
- Subir documentos cuando se soliciten.
- Consultar información relacionada con su servicio.
- Ver información sobre acompañamiento jurídico cuando corresponda.

Nunca debe acceder a información interna ni a datos de otros clientes.

---

# 6. Servicios principales

## 6.1 Calificación de Pérdida de Capacidad Laboral y Ocupacional (PCLO)

Debe ser uno de los servicios principales del sitio.

La página debe explicar, con información oficial de la empresa cuando esté disponible:

- Qué es el servicio.
- Para quién está dirigido.
- En qué situaciones puede ser requerido.
- Qué evaluación se realiza.
- Qué documentación puede necesitarse.
- Cómo solicitar el servicio.
- Qué ocurre después de la solicitud.

No inventar información médica o jurídica.

## 6.2 Informe médico especializado de tipo pericial

Debe ser el segundo servicio principal.

Debe explicar que se trata de un servicio médico especializado orientado a la elaboración del informe correspondiente para procesos donde se requiere soporte médico-pericial.

Los contextos principales son:

- Accidentes de tránsito.
- Accidentes laborales.
- Negligencia y responsabilidad médica.

No presentar afirmaciones clínicas o legales que no hayan sido proporcionadas oficialmente.

---

# 7. Captación

El sitio público debe estar diseñado principalmente para convertir visitantes en potenciales clientes.

Los CTA principales pueden ser:

- Solicitar valoración.
- Agendar cita.
- Solicitar información.
- Iniciar proceso.
- Hablar con un asesor.

El CTA debe conducir a un flujo de captación/agendamiento claro.

Evitar que la web parezca principalmente una página de servicios jurídicos.

---

# 8. Página de inicio

La estructura recomendada:

```text
HEADER
├── Inicio
├── Servicios
├── Cómo funciona
├── Nosotros
├── Preguntas frecuentes
└── Agendar valoración

HERO
├── Propuesta de valor médico-pericial
├── Explicación breve
└── CTA principal

SERVICIOS
├── PCLO
└── Informe médico especializado de tipo pericial

TIPOS DE CASOS
├── Accidentes de tránsito
├── Accidentes laborales 
└── Negligencia y Responsabilidad médica

¿CÓMO FUNCIONA?
├── Solicitud
├── Admisión
├── Valoración
├── Elaboración del informe
└── Entrega de resultados

RESPALDO / DIFERENCIAL
└── Articulación médico-pericial

ACOMPAÑAMIENTO JURÍDICO
└── Servicio complementario

CTA FINAL

FOOTER
```

---

# 9. Nuevo flujo de casos

El flujo anterior de “caso jurídico” debe ser sustituido por un flujo médico-pericial.

Propuesta inicial:

```text
1. Captación
       ↓
2. Solicitud / contacto
       ↓
3. Admisión
       ↓
4. Revisión inicial
       ↓
5. Agendamiento de valoración
       ↓
6. Valoración médica especializada
       ↓
7. Análisis / elaboración del informe
       ↓
8. Revisión / finalización
       ↓
9. Carga del documento resultante
       ↓
10. Disponibilidad para el cliente
       ↓
11. Descarga / entrega
       ↓
12. Cierre
```

Este flujo es una propuesta inicial y debe poder modificarse posteriormente.

No asumir que todos los tipos de caso tienen exactamente las mismas etapas.

---

# 10. Tipo de servicio vs. tipo de caso

Separar estas dos cosas en el modelo.

**Importante:** El negocio maneja **3 tipos principales de caso**, no 4. “Negligencia médica” y “responsabilidad médica” deben tratarse como una única categoría denominada **“Negligencia y responsabilidad médica”**. No crear categorías independientes para ellas salvo que la empresa lo solicite expresamente en una futura toma de requerimientos.

### Servicio

- PCLO.
- Informe médico especializado de tipo pericial.

### Tipo de caso / origen de lesión

- Accidente de tránsito.
- Accidente laboral.
- Negligencia médica.
- Responsabilidad médica.
- Otro.

Ejemplo:

```text
Servicio:
Informe médico especializado de tipo pericial

Tipo de caso:
Accidente de tránsito
```

o:

```text
Servicio:
PCLO

Tipo de caso:
Accidente laboral
```

---

# 11. Citas

Las citas son una funcionalidad central de captación y atención.

## Público

El usuario debe poder:

- Solicitar cita.
- Seleccionar servicio.
- Seleccionar tipo de caso.
- Elegir disponibilidad.
- Introducir información básica.
- Enviar solicitud.

## Auxiliar / administrador

Debe poder:

- Ver solicitudes.
- Confirmar.
- Reprogramar.
- Cancelar.
- Cambiar estado.
- Consultar agenda.

## Cliente autenticado

Debe poder:

- Ver sus citas.
- Consultar estado.
- Solicitar nuevas citas.
- Ver fecha y hora.
- Consultar información asociada.

No integrar calendarios externos salvo requerimiento posterior.

---

# 12. Documentos

La gestión documental es ahora una funcionalidad central.

Conceptualmente:

```text
CASO
├── Documentos recibidos
├── Documentos generados
└── Documentos entregables
```

Un documento debería poder tener:

- ID.
- Caso asociado.
- Nombre.
- Tipo.
- Descripción.
- Ruta/referencia de almacenamiento.
- Fecha de carga.
- Usuario que lo cargó.
- Estado.
- Visibilidad.
- Fecha de disponibilidad.
- Metadatos necesarios.

## Cliente

Debe poder:

- Ver documentos disponibles.
- Descargar documentos autorizados.
- Subir documentos cuando se soliciten.

## Personal interno

Debe poder:

- Cargar documentos.
- Asociarlos a un caso.
- Definir si son visibles para el cliente.
- Consultar documentos.
- Actualizar/reemplazar documentos según reglas futuras.

No guardar documentos sensibles dentro del repositorio Git.

Preparar una abstracción de almacenamiento para poder utilizar posteriormente almacenamiento local seguro o un servicio especializado.

---

# 13. Información sensible y seguridad

La plataforma puede manejar información personal, jurídica y médica.

Por ello:

- No mostrar información médica en la página pública.
- No usar datos reales en mocks.
- No incluir documentos reales en el repositorio.
- No incluir credenciales en código.
- Separar información pública y privada.
- Preparar control de acceso por rol.
- Registrar acciones importantes cuando se implemente el backend.
- Evitar exposición de información sensible mediante endpoints.

La seguridad deberá reforzarse especialmente al implementar autenticación, documentos y MySQL.

---

# 14. Componente jurídico complementario

Debe aparecer como una posibilidad secundaria.

Ejemplo conceptual:

> “Si durante tu proceso necesitas orientación o representación legal y aún no cuentas con un abogado, podremos informarte sobre las opciones de acompañamiento disponibles.”

No afirmar que siempre se asignará un abogado.

Registrar en el caso:

```text
¿Tiene abogado?
├── Sí
└── No

¿Desea información sobre acompañamiento jurídico?
├── Sí
└── No
```

Posteriormente podrá existir una derivación jurídica.

---

