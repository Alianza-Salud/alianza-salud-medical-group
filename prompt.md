## Contexto del proyecto

Estoy desarrollando como proyecto de prácticas académicas una plataforma web para:

**“Diseño y Desarrollo de una Plataforma Web para la Captación de Clientes y el Seguimiento de Casos Jurídicos en Alianza Salud Medical Group, Medellín, Colombia (Agosto de 2026).”**

La organización, **Alianza Salud Medical Group**, integra diferentes áreas, entre ellas una IPS/área de especialidades en salud y un área de consultoría jurídica.

La consultoría jurídica atiende casos relacionados con:

* Negligencia médica.
* Responsabilidad médica.
* Accidentes de tránsito.
* Indemnizaciones por accidentes de tránsito.
* Responsabilidad derivada de procedimientos o cirugías estéticas.
* Otros casos jurídicos relacionados con el ámbito médico y de responsabilidad.

El área jurídica se apoya en el área de especialidades en salud para obtener conceptos, valoraciones y veredictos médicos especializados que pueden ser necesarios para el análisis de determinados casos.

---

# Alcance de esta fase

En esta primera fase **NO quiero desarrollar todavía el sistema completo de gestión de casos**.

Quiero construir primero el **sitio web público**, funcional y bien estructurado, utilizando inicialmente datos estáticos/mock.

El objetivo es conseguir una primera versión navegable, responsive y profesional en estructura, pero sin invertir todavía demasiado tiempo en el diseño visual definitivo porque la empresa aún no me ha entregado toda su identidad gráfica, manual de marca, colores, tipografías, fotografías y demás recursos.

El diseño actual debe ser:

* Neutro.
* Limpio.
* Profesional.
* Moderno.
* Fácilmente personalizable posteriormente.

**IMPORTANTE:** aunque inicialmente los datos sean estáticos/mock, la arquitectura debe quedar preparada para que posteriormente puedan convertirse en datos dinámicos mediante un backend REST desarrollado con Node.js + Express.js y una base de datos MySQL, sin tener que rehacer la interfaz.

---

# Stack tecnológico obligatorio

Utiliza el siguiente stack:

## Frontend

* React.js.
* Vite para el entorno de desarrollo y build del frontend.
* JavaScript o TypeScript, manteniendo consistencia con el proyecto existente.
* Tailwind CSS.
* shadcn/ui cuando aporte valor.
* Lucide React para iconos.
* React Hook Form para formularios cuando sea necesario.
* Zod para validación cuando sea necesario.
* React Router para la navegación entre páginas.

## Backend

* Node.js.
* Express.js.
* API REST.
* CORS correctamente configurado para la comunicación frontend/backend cuando sea necesario.
* Variables de entorno mediante `.env`.

## Base de datos

* MySQL.

La base de datos debe contemplarse como parte de la arquitectura futura, pero **NO es necesario conectarla ni utilizarla durante esta primera fase si los datos pueden permanecer mock**.

## Principio importante

La Fase 1 debe ser principalmente frontend.

El backend debe quedar estructuralmente preparado para incorporarse posteriormente sin acoplar la interfaz a una implementación concreta de persistencia.

---

# Para esta primera fase NO necesito todavía

No implementar todavía:

* Base de datos MySQL conectada.
* Migraciones de base de datos.
* ORM obligatorio.
* Autenticación real.
* JWT.
* Sistema de roles.
* Dashboard administrativo.
* Dashboard de clientes.
* Gestión de casos.
* Gestión de clientes.
* Gestión de documentos.
* Sistema médico.
* Sistema jurídico completo.
* Notificaciones.
* Chat.
* Integraciones externas.
* Agenda real conectada a disponibilidad.
* API completa de producción.

Sin embargo, la arquitectura debe facilitar la incorporación posterior de estas funcionalidades.

---

# Objetivo principal de esta fase

Construir una primera versión completa del sitio web público que permita:

1. Presentar la organización.
2. Presentar los servicios jurídicos.
3. Explicar el proceso de atención.
4. Generar confianza en el usuario.
5. Captar potenciales clientes.
6. Permitir contacto.
7. Permitir solicitar/programar una cita desde el sitio público.
8. Dejar preparada la navegación hacia un futuro inicio de sesión/registro.
9. Mantener una arquitectura escalable para las siguientes fases.

---

# Arquitectura general

Separar claramente el proyecto en:

```text
Frontend React
        │
        │ HTTP / REST API
        ▼
Backend Node.js + Express
        │
        │
        ▼
     MySQL
```

En la Fase 1:

```text
Frontend React
        │
        ▼
Datos mock centralizados
```

El frontend no debe depender directamente de MySQL.

En las siguientes fases:

```text
React
  │
  ▼
Express REST API
  │
  ▼
MySQL
```

Esto permitirá reemplazar los datos mock por llamadas HTTP al backend sin tener que modificar innecesariamente los componentes visuales.

---

# Estructura pública deseada

Crear como mínimo las siguientes páginas/secciones.

## 1. Inicio `/`

Debe incluir:

* Header/navbar.
* Hero principal.
* Propuesta de valor.
* CTA principal para solicitar asesoría/cita.
* Resumen de servicios.
* Sección explicando el respaldo médico + jurídico.
* Sección “Cómo funciona nuestro proceso”.
* Beneficios/diferenciales.
* CTA de contacto.
* Footer.

El Hero debe comunicar rápidamente que se brinda acompañamiento jurídico especializado, especialmente en casos relacionados con responsabilidad médica, accidentes y otros servicios jurídicos definidos por la empresa.

**NO inventar estadísticas, testimonios, certificaciones, años de experiencia, cifras de casos ganados ni afirmaciones legales que no hayan sido proporcionadas.**

Usar contenido placeholder claramente identificable cuando falten datos reales.

---

# 2. Servicios `/servicios`

Mostrar los servicios jurídicos mediante cards o una estructura equivalente.

Servicios iniciales sugeridos:

* Negligencia médica.
* Responsabilidad médica.
* Accidentes de tránsito.
* Indemnización por accidentes de tránsito.
* Responsabilidad relacionada con cirugías/procedimientos estéticos.
* Otros servicios.

Cada servicio debe tener:

* Nombre.
* Descripción corta.
* Icono.
* CTA.
* Slug.
* Posibilidad de evolucionar posteriormente hacia `/servicios/:slug`.

IMPORTANTE:

No presentar afirmaciones jurídicas como asesoramiento legal definitivo.

El contenido debe ser informativo y editable.

---

# 3. Detalle de servicio `/servicios/:slug`

Crear la estructura necesaria para que posteriormente cada servicio pueda tener una página individual.

Por ahora puede utilizar datos mock.

Debe contemplar:

* Título.
* Descripción.
* Situaciones que puede abarcar.
* Proceso de atención.
* CTA para solicitar asesoría.
* CTA para agendar cita.

Preparar la arquitectura para que posteriormente el contenido pueda provenir del backend.

Ejemplo futuro:

```text
GET /api/services
GET /api/services/:slug
```

Estas APIs **NO necesitan implementarse todavía** si la Fase 1 funciona con datos mock.

---

# 4. Sobre nosotros `/nosotros`

Incluir:

* Presentación de Alianza Salud Medical Group.
* Explicación general del área jurídica.
* Explicación de la articulación entre el área jurídica y el área de especialidades en salud.
* Espacios para información institucional pendiente.
* CTA.

No inventar información corporativa.

---

# 5. Proceso `/proceso`

Crear una representación clara y visual del proceso general de atención.

Ejemplo conceptual:

1. Primer contacto.
2. Solicitud/agendamiento de cita.
3. Evaluación inicial del caso.
4. Revisión jurídica.
5. Análisis médico especializado cuando aplique.
6. Definición de ruta de atención.
7. Seguimiento del caso.
8. Cierre o etapa correspondiente.

IMPORTANTE:

Este es un flujo conceptual para el sitio público.

No asumir que todos los casos siguen exactamente las mismas etapas.

Debe quedar preparado para que posteriormente el flujo real de cada caso sea gestionado dinámicamente desde el backend.

---

# 6. Agendar cita `/citas`

Crear una primera versión funcional de la interfaz de solicitud/programación de citas.

Por ahora los datos pueden ser estáticos/mock.

El formulario debería contemplar como mínimo:

* Nombre completo.
* Correo electrónico.
* Teléfono.
* Tipo de servicio/caso.
* Fecha preferida.
* Hora preferida o espacio disponible.
* Mensaje/motivo de consulta.
* Aceptación de política/aviso correspondiente, si se define posteriormente.

En esta fase **NO implementar todavía una agenda real conectada a MySQL**.

Pero estructurar el componente para que posteriormente pueda consumir disponibilidad desde el backend.

Ejemplo conceptual futuro:

```http
GET /api/appointments/availability
POST /api/appointments
```

No es necesario implementar esas APIs ahora.

---

# 7. Contacto `/contacto`

Incluir:

* Información de contacto mediante placeholders editables.
* Teléfono.
* Correo.
* Dirección, si posteriormente se proporciona.
* Horarios, si posteriormente se proporcionan.
* Formulario de contacto.
* CTA para solicitar cita.

El formulario puede ser estático/mock en esta fase, pero debe tener validación básica.

Posteriormente podrá utilizar una API como:

```http
POST /api/contact
```

---

# 8. Login/registro — preparación

Todavía **NO desarrollar autenticación**.

Sin embargo, dejar preparado el header para que posteriormente exista:

* Iniciar sesión.
* Registrarse.

El botón puede apuntar temporalmente a:

```text
/login
```

La página `/login` puede mostrar una pantalla placeholder indicando que el acceso estará disponible próximamente.

**NO implementar JWT ni autenticación real todavía.**

---

# Arquitectura y escalabilidad

La arquitectura es MUY importante.

El proyecto posteriormente evolucionará aproximadamente así:

```text
FASE 1
Sitio público React + datos mock

        ↓

FASE 2
React + Node.js + Express + MySQL
Datos dinámicos mediante API REST

        ↓

FASE 3
Autenticación + registro + roles

        ↓

FASE 4
Dashboard de cliente + gestión de casos

        ↓

FASE 5
Dashboard administrativo/jurídico
Clientes + casos + etapas + novedades + citas
```

Por eso:

* Evita hardcodear contenido directamente dentro de componentes grandes.
* Separa los datos mock de la presentación.
* Crea tipos/interfaces para las entidades que posteriormente serán persistidas.
* Usa componentes reutilizables.
* Evita duplicación.
* No acoples componentes visuales a una fuente de datos específica.
* No hagas que los componentes dependan directamente de MySQL.
* La comunicación con el backend debe estar aislada mediante una capa de servicios.
* Evita una arquitectura que obligue a reescribir el frontend al incorporar Express/MySQL.
* Mantén clara la separación entre UI, datos y lógica.

---

# Estructura sugerida

Puedes adaptar esta estructura según las convenciones actuales de React/Vite y Node/Express, pero mantén estos principios:

```text
alianza-salud/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── navigation/
│   │   │   ├── sections/
│   │   │   ├── services/
│   │   │   ├── process/
│   │   │   ├── appointments/
│   │   │   ├── forms/
│   │   │   └── ui/
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Services/
│   │   │   ├── ServiceDetail/
│   │   │   ├── About/
│   │   │   ├── Process/
│   │   │   ├── Appointments/
│   │   │   ├── Contact/
│   │   │   └── Login/
│   │   │
│   │   ├── data/
│   │   │   ├── services.js
│   │   │   ├── process.js
│   │   │   └── site.js
│   │   │
│   │   ├── types/
│   │   │   ├── service.js
│   │   │   ├── appointment.js
│   │   │   └── process.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── serviceService.js
│   │   │   └── appointmentService.js
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── router/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── database/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

No es obligatorio copiar exactamente esta estructura.

Si el repositorio existente ya tiene una estructura funcional, inspeccionarla primero y reutilizarla cuando sea apropiado.

No crear carpetas o capas innecesarias únicamente por seguir esta estructura.

---

# Datos mock

Crear datos mock centralizados.

Por ejemplo:

```js
export const services = [
  {
    slug: "negligencia-medica",
    name: "Negligencia médica",
    shortDescription: "...",
    description: "...",
    icon: "...",
  },
  // ...
];
```

NO repetir estos datos manualmente en múltiples componentes.

Los componentes deben consumir los datos desde una fuente centralizada.

Posteriormente estos mocks deben poder reemplazarse por consultas al backend sin modificar la estructura visual de las páginas.

Por ejemplo, la arquitectura debería permitir pasar de:

```js
import { services } from "../data/services";
```

a una capa como:

```js
import { getServices } from "../services/serviceService";
```

sin tener que rediseñar `ServiceCard`, `ServiceGrid` o las páginas.

---

# Capa de servicios del frontend

Crear una separación clara entre:

* Componentes.
* Datos.
* Lógica.
* Comunicación HTTP.

No realizar llamadas `fetch` directamente dentro de múltiples componentes si puede evitarse.

Preparar una capa de servicios para futuras APIs.

Ejemplo conceptual:

```text
services/
├── api.js
├── serviceService.js
├── appointmentService.js
└── contactService.js
```

En la Fase 1 estas funciones pueden devolver datos mock.

Posteriormente podrán realizar peticiones HTTP al backend Express.

---

# Backend Node.js + Express

Aunque la Fase 1 no necesita una API completa, la estructura del backend debe quedar preparada.

Crear una estructura modular basada en:

```text
server/src/
├── config/
├── controllers/
├── routes/
├── services/
├── repositories/
├── models/
├── middlewares/
└── app.js
```

Principios:

* `routes` define endpoints.
* `controllers` maneja requests/responses.
* `services` contiene lógica de negocio.
* `repositories` puede encargarse posteriormente del acceso a MySQL.
* `models` representa las entidades cuando se incorpore persistencia.
* `middlewares` contiene middlewares reutilizables.
* `config` centraliza configuración.

No implementar una arquitectura excesivamente compleja para esta fase.

---

# API futura

La arquitectura debe permitir endpoints similares a:

```http
GET    /api/services
GET    /api/services/:slug

GET    /api/appointments/availability
POST   /api/appointments

POST   /api/contact

POST   /api/auth/register
POST   /api/auth/login

GET    /api/cases
GET    /api/cases/:id
```

Los endpoints de autenticación y casos pertenecen a fases futuras.

No implementarlos ahora.

---

# MySQL

MySQL será la base de datos prevista para las fases posteriores.

En esta primera fase:

**NO es obligatorio conectar MySQL.**

Sin embargo, diseñar las entidades de manera que posteriormente puedan persistirse.

Entidades futuras potenciales:

```text
users
clients
services
appointments
cases
case_stages
case_updates
documents
contacts
```

No crear tablas ni modelos innecesarios durante la Fase 1 si todavía no existe funcionalidad que las utilice.

La prioridad es dejar una arquitectura preparada, no implementar funcionalidades futuras prematuramente.

---

# Componentes reutilizables

Crear componentes reutilizables para:

* Navbar.
* Footer.
* Hero.
* SectionHeading.
* ServiceCard.
* ServiceGrid.
* CTA.
* ProcessTimeline.
* ContactForm.
* AppointmentForm.
* Button variants.
* Cards.
* Alertas.
* Loading states cuando tengan sentido.
* Empty states cuando tengan sentido.

No crear un único componente o página gigante.

---

# Diseño visual de esta primera versión

Todavía NO tenemos la identidad visual definitiva.

Por lo tanto:

* Usar una estética profesional.
* Limpia.
* Sobria.
* Moderna.
* Relacionada con servicios jurídicos y salud.
* Mucho espacio en blanco.
* Buena jerarquía visual.
* Excelente legibilidad.
* Responsive.
* Accesible.

No establecer una identidad de marca definitiva.

Usar una paleta neutra y variables/configuración fáciles de modificar posteriormente.

Evitar:

* Gradientes excesivos.
* Animaciones innecesarias.
* Diseños demasiado llamativos.
* Glassmorphism excesivo.
* Efectos visuales que resten seriedad.
* Dependencia de imágenes que todavía no existen.

Cuando no haya imágenes oficiales, utilizar placeholders o recursos genéricos apropiados y dejar claro dónde deberán reemplazarse.

---

# Responsive

La aplicación debe funcionar correctamente en:

* Mobile.
* Tablet.
* Desktop.

Diseñar mobile-first.

Prestar especial atención a:

* Navbar móvil.
* Formularios.
* Cards.
* Timeline.
* CTAs.
* Espaciado.
* Tipografía.
* Botones táctiles.

---

# SEO básico

Implementar desde esta primera fase:

* Metadata por página.
* Titles.
* Descriptions.
* Open Graph básico cuando corresponda.
* URLs limpias.
* Estructura semántica HTML.
* Un único H1 principal por página cuando sea apropiado.
* Alt text para imágenes.

No hacer SEO avanzado todavía.

En React/Vite, utilizar una estrategia apropiada para manejar metadata por ruta sin introducir complejidad innecesaria.

---

# Accesibilidad

Aplicar buenas prácticas básicas:

* HTML semántico.
* Labels asociados a inputs.
* Estados de foco visibles.
* Contraste adecuado.
* Navegación mediante teclado.
* `aria-*` solamente cuando realmente sea necesario.
* No depender exclusivamente del color para comunicar estados.

---

# Formularios

Los formularios deben:

* Validar campos.
* Mostrar errores claros.
* Mostrar estado de envío.
* Evitar envíos duplicados.
* Tener mensajes de éxito/error.

En esta fase no necesitan persistir información.

Usar:

* React Hook Form.
* Zod.

cuando corresponda.

La validación debe estar separada de la presentación cuando resulte conveniente.

---

# Seguridad

Aunque sea una primera fase pública:

* No incluir secretos en el frontend.
* No colocar credenciales.
* No asumir que esconder un elemento equivale a seguridad.
* Preparar correctamente variables de entorno.
* No almacenar datos sensibles en localStorage innecesariamente.
* No exponer credenciales de MySQL en el frontend.
* El frontend nunca debe conectarse directamente a MySQL.
* Las futuras credenciales de base de datos deben existir únicamente en el backend.
* Configurar CORS de forma controlada cuando exista comunicación frontend/backend.
* No incluir archivos `.env` reales en el repositorio.

En las siguientes fases la seguridad deberá ampliarse considerablemente porque la plataforma manejará información personal, jurídica y potencialmente médica.

---

# Qué NO quiero ahora

No implementar todavía:

* Dashboard.
* Gestión de casos.
* Gestión de clientes.
* Roles.
* Autenticación real.
* JWT.
* MySQL conectado.
* Migraciones.
* ORM obligatorio.
* API completa.
* Subida de documentos.
* Notificaciones.
* Chat.
* Integraciones externas.
* Sistema médico.
* Sistema jurídico completo.

Solo dejar la arquitectura preparada para ello.

**NO implementar funcionalidades de fases futuras únicamente “por si acaso”.**

Quiero una base preparada, no sobreingeniería.

---

# Criterios de aceptación de esta fase

Consideraré terminada esta fase cuando:

1. El proyecto ejecute correctamente en local.
2. El frontend React funcione correctamente.
3. Todas las rutas públicas principales funcionen.
4. La navegación sea consistente.
5. El sitio sea responsive.
6. Los servicios se carguen desde datos mock centralizados.
7. Exista página de detalle de servicio.
8. Exista flujo visual de proceso.
9. Exista formulario de contacto.
10. Exista interfaz de solicitud de cita.
11. Exista placeholder de login.
12. No haya errores relevantes de TypeScript/JavaScript.
13. No haya errores relevantes de lint.
14. El proyecto pueda generar correctamente su build.
15. No existan componentes gigantes innecesariamente.
16. Los datos mock estén separados de los componentes.
17. La comunicación futura con backend esté conceptualmente separada mediante una capa de servicios.
18. La estructura permita posteriormente incorporar Node.js + Express.js + MySQL.
19. El frontend no esté acoplado a MySQL.
20. El código sea claro y mantenible.
21. La arquitectura permita evolucionar hacia autenticación, usuarios, clientes, casos, citas y dashboards.

---

# Forma de trabajo

Antes de modificar archivos:

1. Inspecciona el repositorio existente.
2. Identifica si ya existe una aplicación React.
3. Identifica si utiliza Vite u otra herramienta.
4. Identifica la versión de React.
5. Identifica las dependencias existentes.
6. Identifica si ya existe un backend Node.js/Express.
7. Identifica si existe alguna configuración relacionada con MySQL.
8. No reemplaces configuraciones existentes sin necesidad.
9. Reutiliza lo que ya esté correctamente implementado.
10. Evita instalar dependencias innecesarias.

Después:

1. Propón brevemente la estructura que vas a implementar.
2. Implementa la Fase 1.
3. Ejecuta las comprobaciones disponibles:

   * JavaScript/TypeScript.
   * Linter.
   * Build del frontend.
   * Comprobaciones del backend si existe.
4. Corrige errores.
5. Revisa rutas y navegación.
6. Revisa responsive.
7. Revisa formularios.
8. Revisa que los datos mock estén centralizados.
9. Revisa que no existan componentes innecesariamente grandes.
10. Entrega un resumen de lo implementado.
11. Indica claramente qué quedó preparado para futuras fases.
12. Indica cualquier decisión técnica relevante.

---

# Principio fundamental

**Primero funcionalidad y estructura; después diseño visual.**

La prioridad actual es:

1. Arquitectura.
2. Navegación.
3. Estructura de contenido.
4. Componentización.
5. Responsive.
6. Formularios funcionales a nivel de interfaz.
7. Separación entre frontend, datos y lógica.
8. Preparación para API REST.
9. Escalabilidad.
10. Validación técnica.

El diseño visual definitivo se realizará posteriormente cuando Alianza Salud Medical Group proporcione su identidad corporativa, logotipo, colores, tipografías, fotografías y demás lineamientos.

---

# Regla final

**No avances todavía a funcionalidades completas de backend, base de datos ni autenticación real.**

La Fase 1 debe entregar un sitio público funcional en **React.js**, con una arquitectura limpia y preparada para evolucionar posteriormente hacia:

**React.js → Node.js + Express.js → MySQL → autenticación → gestión de usuarios/clientes → gestión de casos → dashboards.**

Comienza inspeccionando el proyecto actual.

Si no existe una aplicación, crea la estructura base adecuada con:

* React.js.
* Vite.
* Tailwind CSS.
* React Router.
* shadcn/ui cuando aporte valor.
* Lucide React.
* React Hook Form.
* Zod.
* Node.js.
* Express.js preparado para futuras APIs.
* MySQL contemplado para las siguientes fases, pero sin conexión obligatoria en esta primera fase.

No avances todavía a backend funcional, base de datos ni autenticación real si no son necesarios para cumplir la Fase 1.
