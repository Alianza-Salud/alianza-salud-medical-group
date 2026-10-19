# Plan de remediación y endurecimiento — Alianza Salud Medical Group

Repositorio: `Alianza-Salud/alianza-salud-medical-group`  
Objetivo: corregir riesgos de seguridad y privacidad, endurecer autenticación/autorización, proteger documentos, limpiar el repositorio y mejorar mantenibilidad sin romper la funcionalidad existente.

---

## 0. Reglas de ejecución para el agente

1. Trabajar por fases y en ramas separadas o commits atómicos.
2. No abrir, leer, imprimir, copiar ni analizar el contenido de documentos reales ubicados en:
   - `server/uploads/`
   - `storage/documents/`
3. No incluir datos personales reales en tests, fixtures, logs, screenshots ni commits.
4. Usar datos sintéticos para pruebas.
5. Antes de cada cambio estructural, identificar dependencias y rutas afectadas.
6. Mantener compatibilidad con:
   - frontend React + TypeScript + Vite
   - backend Node.js + Express
   - MySQL
   - almacenamiento local y S3-compatible
7. Toda corrección de seguridad debe incluir una prueba que demuestre que el fallo quedó cerrado.
8. No introducir secretos reales en el repositorio.
9. Si una mitigación depende de una acción humana o de infraestructura, documentarla claramente en `SECURITY_REMEDIATION.md`.

---

# Fase 1 — Contención inmediata de exposición de datos

## Prioridad
**CRÍTICA**

## Problema

El repositorio público contiene archivos versionados bajo:

- `server/uploads/documents/`
- `storage/documents/`

Los nombres de varios archivos parecen corresponder a personas y documentación clínica/personal.

Además, el `.gitignore` raíz no excluye actualmente estos directorios.

## Objetivo

Evitar que nuevos documentos vuelvan a entrar al repositorio y preparar la eliminación del historial existente.

## Tareas

### 1.1 Actualizar `.gitignore`

Modificar el `.gitignore` raíz para añadir, como mínimo:

```gitignore
# Runtime uploads / private documents
server/uploads/
storage/
!storage/.gitkeep
!server/uploads/.gitkeep

# Local environment
.env
.env.*
!.env.example
```

Si se necesitan directorios vacíos versionados, usar archivos `.gitkeep`.

### 1.2 Eliminar archivos sensibles del índice Git

Eliminar del tracking, sin depender solo de `.gitignore`:

```bash
git rm -r --cached server/uploads
git rm -r --cached storage
```

No borrar archivos locales de producción si el entorno actual los necesita; el objetivo es quitarlos del repositorio.

### 1.3 Preparar limpieza de historial

Crear `SECURITY_REMEDIATION.md` con instrucciones para reescribir el historial utilizando `git filter-repo`.

Ejemplo de comandos sugeridos:

```bash
git filter-repo \
  --path server/uploads \
  --path storage \
  --invert-paths
```

Después de verificar:

```bash
git push --force --all
git push --force --tags
```

### 1.4 Acción manual obligatoria

Documentar como acciones humanas:

- considerar temporalmente poner el repositorio en privado mientras se limpia;
- revisar forks y clones conocidos;
- revisar artefactos, releases y Actions;
- tratar la exposición como incidente de privacidad;
- determinar si es necesario notificar internamente o a responsables legales/compliance;
- asumir que datos publicados pueden haber sido copiados aunque se eliminen del historial;
- rotar cualquier secreto real que alguna vez haya sido comprometido.

## Criterios de aceptación

- `git ls-files server/uploads storage` no devuelve documentos reales.
- Un nuevo archivo creado bajo `server/uploads/` o `storage/` no aparece en `git status`.
- El repositorio limpio ya no contiene esos archivos en la rama principal.
- Existe documentación explícita sobre la limpieza del historial.
- Ningún test usa datos reales.

---

# Fase 2 — Cerrar exposición pública de `/uploads`

## Prioridad
**CRÍTICA**

## Problema

En `server/src/app.js` existe una publicación directa de archivos:

```js
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

Esto puede permitir acceder a documentos por URL sin pasar por JWT ni autorización por expediente.

## Objetivo

Todo documento privado debe descargarse exclusivamente mediante un endpoint autenticado y autorizado.

## Tareas

### 2.1 Eliminar el static serving de uploads

En:

`server/src/app.js`

Eliminar:

```js
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

No sustituirlo por otra ruta pública.

### 2.2 Tratar `filePath` legacy como dato interno

En la tabla/documentación de documentos, `filePath` no debe utilizarse como URL pública.

Mantener únicamente:

- `storageKey`
- `originalName`
- `mimeType`
- `fileSize`
- `checksum`

`filePath` legacy puede mantenerse temporalmente para migración, pero nunca exponerse como URL navegable.

### 2.3 Endpoint único de descarga

Mantener la descarga mediante:

```text
GET /api/cases/:id/documents/:docId/download
```

El endpoint debe:

1. autenticar;
2. validar acceso al caso;
3. validar que el documento pertenece al caso;
4. validar visibilidad si el usuario es cliente;
5. devolver `Content-Disposition: attachment`;
6. utilizar `application/octet-stream` como fallback;
7. añadir `X-Content-Type-Options: nosniff`;
8. no revelar rutas físicas.

## Criterios de aceptación

- `/uploads/<archivo>` devuelve 404.
- Un usuario no autenticado no puede descargar documentos.
- Todas las descargas pasan por `/api/.../download`.
- Ninguna respuesta JSON incluye rutas físicas del servidor.

---

# Fase 3 — Corregir IDOR/BOLA en expedientes y documentos

## Prioridad
**CRÍTICA**

## Problema

La lectura de un caso verifica ownership para clientes, pero las operaciones sobre documentos no aplican de forma consistente la misma validación.

Rutas relevantes:

```text
GET /api/cases/:id
GET /api/cases/:id/documents
GET /api/cases/:id/documents/:docId/download
```

Archivos relevantes:

- `server/src/routes/caseRoutes.js`
- `server/src/controllers/caseController.js`
- `server/src/repositories/caseRepository.js`

## Objetivo

Centralizar la autorización de acceso a casos y reutilizarla en todos los endpoints.

## Tareas

### 3.1 Crear helper de autorización

Crear, por ejemplo:

`server/src/services/caseAccessService.js`

Responsabilidad sugerida:

```js
async function canUserAccessCase(user, caseData) {
  if (!user || !caseData) return false;

  if (user.role === 'admin' || user.role === 'auxiliar_admisiones') {
    return true;
  }

  if (user.role === 'lawyer') {
    return await isLawyerAssignedToCase(user, caseData);
  }

  if (user.role === 'client') {
    return (
      caseData.userId === user.id ||
      (
        caseData.clientEmail &&
        user.email &&
        caseData.clientEmail.toLowerCase() === user.email.toLowerCase()
      )
    );
  }

  return false;
}
```

Preferir IDs relacionales sobre email/nombre cuando sea posible.

### 3.2 Aplicar la comprobación a `getCaseById`

Reemplazar lógica duplicada por el helper central.

### 3.3 Aplicar autorización a `getCaseDocuments`

Antes de consultar o devolver documentos:

1. cargar el caso;
2. comprobar acceso del usuario;
3. si no tiene acceso, devolver 403;
4. para `client`, devolver únicamente documentos `visibleToClient = true`.

### 3.4 Aplicar autorización a `downloadCaseDocument`

Secuencia obligatoria:

```text
cargar caso
→ validar acceso al caso
→ cargar documento
→ verificar doc.caseId === caseId
→ si client: validar visibleToClient
→ descargar
```

Nunca validar solo el documento.

### 3.5 Revisar otras rutas por el mismo patrón

Auditar:

- novedades del caso;
- actualización de etapa;
- asignación de abogados;
- cambio de visibilidad;
- creación de documentos;
- dashboard;
- clientes;
- abogados;
- usuarios;
- solicitudes de revisión.

Buscar cualquier endpoint que acepte `:id`, `caseId`, `clientId`, `userId`, `docId`, `lawyerId` desde el cliente.

## Tests obligatorios

Crear pruebas con al menos:

- Cliente A puede ver Caso A.
- Cliente A no puede ver Caso B.
- Cliente A no puede listar documentos de Caso B.
- Cliente A no puede descargar documento visible de Caso B.
- Cliente A no puede descargar documento oculto de Caso A.
- Admin sí puede acceder.
- Abogado asignado sí puede acceder.
- Abogado no asignado no puede acceder, si ese es el modelo de negocio deseado.

## Criterios de aceptación

No debe existir ninguna ruta sensible donde conocer un ID sea suficiente para acceder al recurso.

---

# Fase 4 — Endurecer JWT y configuración de secretos

## Prioridad
**ALTA**

## Problema

Existe un secreto JWT fallback dentro de:

- `server/src/middlewares/authMiddleware.js`
- `server/src/controllers/authController.js`

Actualmente:

```js
process.env.JWT_SECRET || 'alianza_salud_secret_key_2026_phase3'
```

También aparece un valor equivalente en `.env.example`.

## Objetivo

La aplicación debe fallar de forma segura si falta un secreto real.

## Tareas

### 4.1 Centralizar configuración JWT

Mover la configuración a `server/src/config/index.js`.

Ejemplo:

```js
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is required and must be at least 32 characters');
}
```

No usar fallback.

### 4.2 Limpiar `.env.example`

Cambiar:

```env
JWT_SECRET=alianza_salud_secret_key_2026_phase3
```

por:

```env
JWT_SECRET=replace_with_a_long_random_secret
```

### 4.3 Generar secretos correctamente

Documentar:

```bash
openssl rand -base64 48
```

### 4.4 Reducir vida del access token

Revisar el valor actual de 24h.

Sugerencia:

```env
JWT_EXPIRES_IN=15m
```

Si el producto necesita sesiones largas, implementar refresh tokens antes de reducirlo.

### 4.5 Validar algoritmo explícitamente

En `jwt.verify`:

```js
jwt.verify(token, JWT_SECRET, {
  algorithms: ['HS256'],
});
```

Y en `jwt.sign`:

```js
{
  expiresIn: JWT_EXPIRES_IN,
  algorithm: 'HS256',
}
```

## Criterios de aceptación

- El servidor no arranca sin `JWT_SECRET`.
- No existe secreto funcional hardcodeado en el código.
- `.env.example` solo contiene placeholders.
- Los tests verifican token inválido, expirado y manipulado.

---

# Fase 5 — Mejorar almacenamiento de sesión en frontend

## Prioridad
**ALTA**

## Problema

El frontend guarda:

```js
localStorage.setItem('auth_token', ...)
```

Archivo:

`client/src/context/AuthContext.tsx`

Un token accesible desde JavaScript aumenta el impacto de una vulnerabilidad XSS.

## Objetivo

Migrar a cookies seguras HttpOnly cuando sea viable.

## Estrategia recomendada

Usar cookie:

- `HttpOnly`
- `Secure` en producción
- `SameSite=Lax` o `Strict` según arquitectura
- `Path=/`
- duración corta

### Backend

En login:

```js
res.cookie('access_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000,
});
```

Agregar endpoint:

```text
POST /api/auth/logout
```

que expire la cookie.

### Frontend

Eliminar almacenamiento manual de JWT.

Configurar `fetch`/Axios con:

```js
credentials: 'include'
```

### Middleware

Leer primero cookie segura.

Si se mantiene compatibilidad temporal con Bearer tokens, marcarla como migración transitoria.

## Protección CSRF

Si se utilizan cookies para acciones mutables:

- usar `SameSite=Lax/Strict`;
- validar `Origin`/`Referer` en mutaciones;
- considerar CSRF token si el flujo lo requiere.

## Criterios de aceptación

- No hay access token persistente en `localStorage`.
- Logout invalida/borra cookie.
- Login funciona en desarrollo y producción.
- Las llamadas cross-origin autorizadas envían credenciales correctamente.

---

# Fase 6 — Endurecer subida de archivos

## Prioridad
**ALTA**

## Archivo principal

`server/src/middlewares/uploadMiddleware.js`

## Problemas actuales

Hay límite de tamaño, pero falta una política estricta de tipos.

## Objetivo

Aceptar solo documentos realmente permitidos.

## Tareas

### 6.1 Definir formatos permitidos

Ejemplo inicial:

```text
application/pdf
image/jpeg
image/png
```

Ajustar según negocio.

### 6.2 Implementar `fileFilter`

Validar:

- extensión;
- MIME declarado;
- nombre;
- número máximo de archivos.

No confiar únicamente en `file.mimetype`.

### 6.3 Verificar magic bytes

Añadir validación del contenido real del archivo.

Para PDF:

```text
%PDF-
```

Para JPEG/PNG, validar firmas conocidas.

Preferir una librería mantenida para detección de tipos basada en bytes.

### 6.4 Limitar cantidad

Evitar `upload.any()` cuando sea posible.

Preferir:

```js
upload.array('documents', 10)
```

o campos definidos explícitamente.

### 6.5 Escaneo antimalware

Diseñar punto de integración para:

- ClamAV;
- servicio antivirus;
- pipeline de análisis.

Los archivos deben quedar en estado:

```text
pending_scan
```

y solo pasar a:

```text
ready
```

después de validación.

Si no se implementa AV ahora, documentar como deuda crítica.

### 6.6 No confiar en filename

El nombre de almacenamiento ya usa aleatoriedad; conservar esta práctica.

El nombre original debe ser solo metadata.

## Criterios de aceptación

- `.exe`, `.js`, `.html`, `.svg`, `.php`, scripts y ejecutables son rechazados.
- spoofing simple de extensión no funciona.
- más de N archivos en una petición es rechazado.
- archivos > límite configurado son rechazados.

---

# Fase 7 — Corregir acceso al almacenamiento local

## Prioridad
**ALTA**

## Archivo

`server/src/storage/LocalStorage.js`

## Objetivo

Evitar path traversal de forma robusta.

## Problema

La normalización actual intenta eliminar `../`, pero una validación basada únicamente en reemplazos puede ser frágil.

## Implementación recomendada

Resolver la ruta final y comprobar que permanece dentro de `baseDir`.

Ejemplo conceptual:

```js
getAbsolutePath(storageKey) {
  const root = path.resolve(this.baseDir);
  const candidate = path.resolve(root, storageKey);

  if (!candidate.startsWith(root + path.sep)) {
    throw new Error('Invalid storage key');
  }

  return candidate;
}
```

Manejar también el caso exacto del directorio raíz según necesidad.

## Tests

Probar claves como:

```text
../../etc/passwd
..\..\secret.txt
documents/../../../secret
/documents/file.pdf
```

Todas deben ser rechazadas.

---

# Fase 8 — Rate limiting y protección contra abuso

## Prioridad
**ALTA**

## Objetivo

Proteger autenticación, registro y formularios públicos.

## Dependencia sugerida

```bash
npm install express-rate-limit
```

## Endpoints prioritarios

```text
POST /api/auth/login
POST /api/auth/register
POST /api/contact
POST /api/appointments
POST /api/case-reviews
```

## Configuración inicial sugerida

Login:

```text
5-10 intentos / 15 minutos / IP
```

Registro/código:

```text
5 intentos / 30 minutos / IP
```

Formularios públicos:

```text
20-30 solicitudes / hora / IP
```

Ajustar con métricas reales.

## Recomendación adicional

Evitar mensajes que permitan enumerar cuentas/códigos.

Por ejemplo, donde sea razonable, no distinguir públicamente entre:

- email inexistente;
- password incorrecto.

## Criterios de aceptación

- repetidos intentos de login generan 429;
- el rate limiter no bloquea el health check;
- headers de rate limiting están configurados correctamente.

---

# Fase 9 — Fortalecer registro y códigos de verificación

## Prioridad
**ALTA**

## Archivo principal

`server/src/controllers/authController.js`

## Cambios

### 9.1 Contraseñas

Elevar mínimo de 6 caracteres.

Sugerencia:

```text
mínimo 10-12 caracteres
```

No imponer reglas absurdas de complejidad; priorizar longitud.

### 9.2 Código de verificación

El código de 8 caracteres debe:

- generarse criptográficamente;
- ser de uso único;
- expirar;
- tener límite de intentos;
- no almacenarse en texto plano si puede evitarse.

Añadir columnas si no existen:

```text
verification_code_hash
verification_code_expires_at
verification_code_used_at
verification_attempts
```

### 9.3 Invalidación atómica

Registrar usuario y marcar código como usado dentro de una transacción.

Evitar condición de carrera donde dos requests utilicen el mismo código.

## Criterios de aceptación

- un código usado no puede reutilizarse;
- un código vencido falla;
- múltiples requests concurrentes no crean dos usuarios.

---

# Fase 10 — Revisión RBAC completa

## Prioridad
**ALTA**

## Objetivo

Crear una matriz explícita de permisos.

## Roles detectados

```text
admin
auxiliar_admisiones
lawyer
client
```

El frontend también contiene compatibilidad con `cliente`; decidir un único identificador canónico.

## Entregable

Crear:

`docs/RBAC_MATRIX.md`

Ejemplo:

| Recurso | Acción | admin | auxiliar | lawyer | client |
|---|---|---:|---:|---:|---:|
| Casos | listar todos | Sí | Sí | Asignados | Propios |
| Casos | crear | Sí | Sí | revisar | No |
| Casos | cambiar etapa | Sí | Sí | revisar | No |
| Documentos | subir | Sí | Sí | revisar | No |
| Documentos | descargar | Sí | Sí | Asignados | Propios + visibles |
| Usuarios | administrar | Sí | revisar | No | No |

No asumir permisos: confirmar comportamiento existente y preservar reglas de negocio.

## Implementación

Crear helpers reutilizables:

```text
canReadCase
canModifyCase
canReadDocument
canManageUsers
canManageLawyers
```

No depender del frontend para seguridad.

---

# Fase 11 — Validación de entradas

## Prioridad
**MEDIA-ALTA**

## Problema

El proyecto usa Zod en frontend, pero el backend debe validar por sí mismo.

## Objetivo

Validar todos los cuerpos, params y queries en el servidor.

## Opción recomendada

Añadir Zod también al backend.

Crear:

```text
server/src/schemas/
server/src/middlewares/validateRequest.js
```

Ejemplo:

```js
const createCaseSchema = z.object({
  body: z.object({
    clientId: z.coerce.number().int().positive(),
    serviceSlug: z.string().min(1).max(100),
    title: z.string().min(3).max(200),
    description: z.string().min(1).max(5000),
  }),
});
```

Aplicar a:

- auth;
- casos;
- documentos;
- usuarios;
- clientes;
- abogados;
- citas;
- contacto;
- solicitudes de revisión;
- configuración.

## Criterios de aceptación

Datos mal formados devuelven 400 y nunca llegan al repositorio.

---

# Fase 12 — Seguridad HTTP y CORS

## Prioridad
**MEDIA-ALTA**

## Archivo

`server/src/app.js`

## Cambios

### 12.1 CORS

Actualmente se acepta cualquier dominio:

```js
cleanOrigin.endsWith('.vercel.app')
```

Eliminar wildcard implícito de Vercel en producción.

Usar una whitelist explícita:

```env
CORS_ORIGIN=https://app.example.com,https://admin.example.com
```

Permitir excepciones amplias solo en desarrollo.

### 12.2 Helmet

Mantener Helmet y revisar CSP.

Evitar desactivar políticas salvo necesidad demostrada.

### 12.3 Payload limits

Configurar:

```js
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

Los uploads deben usar Multer, no JSON.

### 12.4 Trust proxy

Si se despliega detrás de proxy/CDN:

```js
app.set('trust proxy', 1);
```

Configurar según infraestructura real para que rate limiting y HTTPS detection funcionen correctamente.

---

# Fase 13 — Logging seguro y auditoría

## Prioridad
**MEDIA-ALTA**

## Objetivo

Registrar acciones sensibles sin registrar información clínica ni secretos.

## Crear logger estructurado

Sugerencias:

- `pino`
- `winston`

## Nunca registrar

- JWT;
- passwords;
- verification codes;
- contenidos de documentos;
- credenciales S3;
- datos clínicos completos;
- cuerpos de requests sensibles.

## Registrar eventos

```text
AUTH_LOGIN_SUCCESS
AUTH_LOGIN_FAILURE
CASE_VIEW
DOCUMENT_UPLOAD
DOCUMENT_DOWNLOAD
DOCUMENT_VISIBILITY_CHANGED
CASE_STAGE_CHANGED
USER_ROLE_CHANGED
USER_DISABLED
```

Campos sugeridos:

```text
timestamp
event
actorUserId
actorRole
resourceType
resourceId
result
ipHash / requestId
```

Evitar PII innecesaria.

## Auditoría

Idealmente crear tabla:

```text
audit_logs
```

con retención definida.

---

# Fase 14 — Revisar notificaciones y correo

## Prioridad
**MEDIA**

## Archivos relevantes

```text
server/src/services/notifications/
server/src/config/emailConfig.js
```

## Revisar

- que API keys vengan solo de variables de entorno;
- que errores no impriman secretos;
- que templates escapen contenido dinámico;
- que campos controlados por usuario no permitan HTML arbitrario;
- que enlaces generados apunten al dominio oficial;
- que los correos no adjunten documentos sensibles directamente salvo requisito explícito.

---

# Fase 15 — Base de datos y migraciones

## Prioridad
**MEDIA**

## Problema

Hay múltiples scripts SQL sueltos dentro de:

`server/src/database/`

y scripts de corrección de encoding.

## Objetivo

Formalizar migraciones reproducibles.

## Propuesta

Crear:

```text
server/migrations/
```

Nombrar:

```text
001_initial_schema.sql
002_add_case_lawyers.sql
003_add_document_storage.sql
004_add_verification_code_security.sql
...
```

Añadir tabla:

```text
schema_migrations
```

o adoptar herramienta de migraciones.

## Reglas

- migraciones inmutables;
- cambios nuevos = archivo nuevo;
- backups antes de migración en producción;
- charset `utf8mb4`;
- foreign keys donde correspondan;
- índices en claves de búsqueda.

---

# Fase 16 — Consistencia de identidad y relaciones

## Prioridad
**MEDIA**

## Problema

En algunos puntos el sistema relaciona abogados/clientes por:

- ID
- email
- nombre

Ejemplo observado en la selección de casos de abogados.

## Objetivo

Usar IDs como fuente de verdad.

## Cambios

Para `lawyer`:

- relacionar `users.id` con `lawyers.user_id`;
- no depender de coincidencia por `email` o `fullName`.

Para `client`:

- relacionar `users.id` con `clients.user_id`;
- evitar fallback por email cuando la migración haya finalizado.

## Fase transitoria

Mantener fallback temporal solo mientras se migran datos existentes.

Después eliminarlo.

---

# Fase 17 — Pruebas automatizadas

## Prioridad
**ALTA**

Actualmente debe añadirse una base de pruebas para evitar regresiones de seguridad.

## Backend

Sugerencia:

```bash
npm install -D vitest supertest
```

o Jest + Supertest.

## Suites mínimas

### Auth

- login correcto;
- password incorrecto;
- usuario desactivado;
- token inválido;
- token expirado;
- registro con código inválido;
- reutilización de código;
- rate limiting.

### RBAC

Probar cada rol.

### Casos

- ownership;
- acceso abogado asignado;
- acceso abogado no asignado;
- cambios de etapa.

### Documentos

- upload permitido;
- extensión bloqueada;
- magic bytes inválidos;
- archivo grande;
- descarga propia;
- descarga ajena;
- documento oculto;
- path traversal.

### Público

- contacto;
- citas;
- solicitudes;
- rate limits.

## Criterio de CI

No hacer merge si fallan pruebas de seguridad.

---

# Fase 18 — CI/CD y análisis automático

## Prioridad
**MEDIA**

Crear GitHub Actions.

Archivo sugerido:

`.github/workflows/ci.yml`

Ejecutar:

```text
client npm ci
client npm run lint
client npm run build
server npm ci
server tests
npm audit --omit=dev
```

Añadir análisis:

- Dependabot;
- CodeQL;
- secret scanning;
- push protection si está disponible.

No permitir artifacts de CI con documentos reales.

---

# Fase 19 — Limpieza del repositorio

## Prioridad
**MEDIA**

## Elementos a revisar

### `cftunnel.exe`

Hay un binario grande en la raíz.

No versionar binarios de herramientas externas.

Eliminarlo del repo y documentar instalación oficial de `cloudflared`.

Añadir a `.gitignore` si existe riesgo de recrearlo.

### CSS duplicado/versionado

Revisar:

```text
client/src/index.css
client/src/index2.css
client/src/index3.css
client/src/index4.css
client/src/index5.css
```

Determinar cuál se usa realmente.

Eliminar archivos obsoletos después de validar build y UI.

### Scripts de reparación

Revisar scripts como:

```text
fix_case_types_encoding.js
server/src/database/fix_all_encoding_issues.js
server/src/database/fix_case_types_encoding.js
```

Mover utilidades necesarias a:

```text
scripts/
```

o eliminarlas si ya cumplieron su función.

### `scratch/`

Eliminar experimentos que no formen parte del producto.

---

# Fase 20 — Actualizar documentación

## Prioridad
**MEDIA**

El README actual está desactualizado respecto al estado real del sistema.

Actualizar:

`README.md`

Debe describir:

- frontend;
- backend;
- MySQL;
- JWT/cookies;
- roles;
- dashboard;
- almacenamiento;
- S3/R2;
- notificaciones;
- Google Calendar/Meet;
- variables de entorno;
- migraciones;
- tests;
- despliegue;
- política de documentos privados.

Crear además:

```text
docs/ARCHITECTURE.md
docs/RBAC_MATRIX.md
docs/STORAGE.md
docs/SECURITY.md
SECURITY_REMEDIATION.md
```

---

# Fase 21 — Dependencias y supply chain

## Prioridad
**MEDIA**

Ejecutar en frontend y backend:

```bash
npm audit
npm outdated
```

No actualizar majors a ciegas.

Por cada cambio:

1. revisar changelog;
2. ejecutar tests;
3. ejecutar build;
4. verificar regresiones.

Eliminar dependencias no utilizadas.

---

# Fase 22 — Checklist de despliegue seguro

Antes de desplegar:

```text
[ ] repositorio sin documentos reales
[ ] historial sensible reescrito
[ ] JWT_SECRET rotado
[ ] DB_PASSWORD seguro
[ ] credenciales S3/R2 rotadas si aplica
[ ] Google OAuth credentials revisadas/rotadas si aplica
[ ] CORS con dominios explícitos
[ ] NODE_ENV=production
[ ] HTTPS obligatorio
[ ] /uploads no público
[ ] rate limiting activo
[ ] logs sin PII sensible
[ ] backups MySQL configurados
[ ] bucket privado
[ ] acceso S3 de mínimo privilegio
[ ] tests de RBAC pasando
[ ] tests IDOR pasando
[ ] tests upload pasando
[ ] npm audit revisado
[ ] CI verde
```

---

# Orden recomendado de implementación

## Bloque A — Contención

1. eliminar documentos del tracking;
2. `.gitignore`;
3. quitar `/uploads` público;
4. limpiar historial;
5. rotar secretos.

## Bloque B — Autorización

6. centralizar `canUserAccessCase`;
7. corregir documentos;
8. revisar todas las rutas con IDs;
9. formalizar RBAC.

## Bloque C — Autenticación

10. eliminar fallback JWT;
11. rate limiting;
12. fortalecer registro;
13. migrar token a cookie HttpOnly.

## Bloque D — Archivos

14. MIME whitelist;
15. magic bytes;
16. límites;
17. path traversal;
18. antivirus / estado de escaneo.

## Bloque E — Plataforma

19. validación backend;
20. CORS;
21. logging/auditoría;
22. migraciones;
23. normalización de relaciones por ID.

## Bloque F — Calidad

24. tests;
25. CI;
26. dependencias;
27. limpieza;
28. documentación.

---

# Pull Requests sugeridos

Para reducir riesgo, dividir en PRs:

```text
PR-01 security: stop tracking private uploads
PR-02 security: remove public uploads route
PR-03 security: enforce case/document ownership
PR-04 security: harden JWT configuration
PR-05 security: add auth/public rate limiting
PR-06 security: harden file uploads
PR-07 security: harden local storage paths
PR-08 auth: migrate access token to HttpOnly cookie
PR-09 security: formalize RBAC and backend validation
PR-10 platform: audit logging and migrations
PR-11 quality: tests and CI
PR-12 cleanup: remove obsolete files and update docs
```

Cada PR debe incluir:

```text
- explicación del riesgo;
- archivos modificados;
- tests añadidos;
- cómo probar manualmente;
- impacto/migración;
- rollback.
```

---

# Definition of Done

La remediación se considera completa cuando:

1. no hay documentos privados versionados;
2. no existen rutas públicas hacia uploads;
3. todas las operaciones sobre casos/documentos verifican ownership/RBAC;
4. el servidor falla si faltan secretos obligatorios;
5. no hay JWT persistente en `localStorage` si ya se completó la migración a cookies;
6. uploads aceptan únicamente tipos permitidos y contenido válido;
7. existe rate limiting;
8. toda entrada relevante del backend se valida;
9. CORS es explícito en producción;
10. hay logs de auditoría sin PII innecesaria;
11. relaciones de autorización dependen de IDs;
12. existen tests de seguridad automatizados;
13. CI ejecuta lint/build/tests;
14. README y documentación reflejan la arquitectura real;
15. el repositorio queda limpio de binarios, residuos y datos runtime.

---

# Instrucción final para Codex

Implementa las fases en orden de criticidad. No hagas una refactorización cosmética antes de cerrar los riesgos de exposición de documentos y autorización.

Para cada fase:

1. inspecciona el código afectado;
2. crea un commit pequeño y reversible;
3. añade pruebas;
4. ejecuta build/lint/tests;
5. documenta cualquier paso manual;
6. no uses documentos reales para probar;
7. no asumas que una protección del frontend equivale a autorización del backend.

Si una decisión depende de una regla de negocio no inferible del código —por ejemplo, si un abogado puede ver únicamente casos asignados o todos los casos— conserva el comportamiento más restrictivo y documenta la decisión como pendiente de confirmación.
