# Plan de profesionalización del sistema de gestión de documentos

## 1. Objetivo

Actualmente, los documentos se almacenan directamente en una carpeta dentro del proyecto del backend.

El objetivo de esta mejora es profesionalizar la gestión de documentos **sin romper la funcionalidad existente**, realizando la migración de forma gradual y controlada.

La nueva arquitectura deberá:

* Mantener funcionando las subidas actuales durante la transición.
* Mantener funcionando las descargas existentes.
* Separar los metadatos de los archivos físicos.
* Evitar que los documentos privados sean accesibles directamente mediante una URL pública.
* Preparar el sistema para migrar posteriormente a almacenamiento externo como Amazon S3 o Cloudflare R2.
* Evitar acoplar los controllers y servicios directamente al sistema de archivos.
* Permitir migrar los documentos existentes sin pérdida de información.
* Mantener compatibilidad con los registros actuales de MySQL.
* Permitir realizar rollback si alguna etapa presenta problemas.

---

# 2. Regla principal: no hacer un cambio "big bang"

**No se debe reemplazar de una vez el sistema actual.**

El cambio debe realizarse por etapas:

```text
Sistema actual
    ↓
Crear nueva arquitectura
    ↓
Mantener almacenamiento actual
    ↓
Crear StorageService
    ↓
Adaptar nuevas subidas
    ↓
Adaptar descargas
    ↓
Migrar documentos existentes
    ↓
Verificar integridad
    ↓
Eliminar dependencia del sistema antiguo
    ↓
Opcionalmente migrar a S3/R2
```

Durante la transición, el sistema debe continuar funcionando.

---

# 3. Arquitectura objetivo

La arquitectura final deberá separar claramente:

```text
                  React
                    │
                    ▼
                Express API
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
       MySQL             StorageService
     metadatos                 │
                               ▼
                       File Storage
```

MySQL **no debe almacenar el contenido binario del documento**, sino únicamente sus metadatos.

El almacenamiento físico debe ser responsabilidad de `StorageService`.

Esto permitirá comenzar utilizando el filesystem local y posteriormente cambiar a S3, Cloudflare R2 u otro proveedor sin modificar la lógica principal de la aplicación.

---

# 4. Primera etapa: auditar el sistema actual

Antes de modificar código, identificar:

* Dónde se reciben actualmente los archivos.
* Qué middleware se utiliza para recibir `multipart/form-data`.
* Dónde se genera el nombre del archivo.
* Dónde se crea la carpeta.
* Dónde se guarda la ruta en MySQL.
* Cómo se descargan actualmente los documentos.
* Qué endpoints realizan estas operaciones.
* Qué tablas contienen información de documentos.
* Qué partes del frontend dependen de las rutas actuales.
* Si existen documentos almacenados con rutas absolutas o relativas.
* Si existen documentos que utilizan directamente el nombre original.

No eliminar ni modificar todavía el sistema actual.

---

# 5. Segunda etapa: crear un modelo de documento consistente

La tabla de documentos debe contener metadatos y no depender directamente de la ubicación física del archivo.

Como referencia:

```sql
CREATE TABLE documents (
    id CHAR(36) PRIMARY KEY,
    user_id BIGINT NOT NULL,

    original_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(512) NOT NULL,

    mime_type VARCHAR(100) NOT NULL,
    size BIGINT UNSIGNED NOT NULL,

    checksum CHAR(64) NULL,

    status ENUM(
        'uploading',
        'processing',
        'ready',
        'rejected',
        'deleted'
    ) NOT NULL DEFAULT 'uploading',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_documents_user_id (user_id),
    INDEX idx_documents_status (status)
);
```

## Importante

Si ya existe una tabla que contiene documentos, **no crear otra tabla innecesariamente**.

Primero analizar la estructura existente y agregar únicamente las columnas necesarias.

Por ejemplo:

```text
original_name
storage_key
mime_type
size
checksum
status
```

La migración debe conservar los IDs y relaciones existentes siempre que sea posible.

---

# 6. Tercera etapa: introducir `StorageService`

Crear una abstracción que sea responsable exclusivamente de gestionar archivos.

Estructura sugerida:

```text
src/
├── storage/
│   ├── StorageService.js
│   └── LocalStorage.js
│
├── services/
│   └── document.service.js
│
├── repositories/
│   └── document.repository.js
│
├── controllers/
│   └── document.controller.js
│
├── routes/
│   └── document.routes.js
│
└── middlewares/
    ├── auth.js
    └── upload.js
```

La aplicación no debería llamar directamente a `fs` desde controllers.

En lugar de:

```js
fs.writeFile(...)
```

o:

```js
fs.unlink(...)
```

debe utilizar:

```js
storage.upload(...)
storage.delete(...)
storage.get(...)
```

---

# 7. Implementar primero almacenamiento local

No migrar todavía a S3/R2.

Primero crear un `LocalStorage` que utilice una carpeta privada fuera de la estructura pública de React.

Por ejemplo:

```text
project/
├── backend/
│   ├── src/
│   └── storage/
│       └── documents/
│
├── frontend/
└── ...
```

La carpeta de almacenamiento debe ser considerada **privada**.

No debe estar expuesta mediante:

```js
app.use(express.static(...))
```

ni mediante una ruta pública equivalente.

El objetivo inicial es:

```text
StorageService
      │
      ▼
LocalStorage
      │
      ▼
backend/storage/documents
```

Más adelante:

```text
StorageService
      │
      ▼
S3Storage
      │
      ▼
Amazon S3 / Cloudflare R2
```

La lógica de documentos no debería tener que cambiar cuando ocurra esa migración.

---

# 8. Generar nombres internos

No utilizar el nombre original del usuario como nombre físico del archivo.

Actualmente puede existir algo como:

```text
uploads/Contrato de Juan.pdf
```

La nueva implementación debe utilizar un identificador generado por el servidor.

Ejemplo:

```text
storage_key:
documents/2026/08/01J8X7K3M4Q9F2A8Z6R5.pdf
```

Mientras que MySQL conserva:

```text
original_name:
Contrato de Juan.pdf
```

La separación debe ser:

```text
Nombre mostrado al usuario:
Contrato de Juan.pdf

Nombre interno:
01J8X7K3M4Q9F2A8Z6R5.pdf
```

El nombre original nunca debe utilizarse para construir directamente rutas del filesystem.

---

# 9. No cambiar inicialmente la respuesta del frontend

Para evitar romper React, durante la primera migración mantener el contrato de la API actual siempre que sea posible.

Si actualmente el frontend recibe:

```json
{
    "id": 123,
    "name": "Contrato.pdf",
    "url": "..."
}
```

no cambiar inmediatamente la estructura.

Primero hacer que el backend internamente utilice:

```text
DocumentController
        ↓
DocumentService
        ↓
StorageService
        ↓
LocalStorage
```

pero mantener la respuesta compatible con React.

Una vez estabilizado el backend, se puede modernizar el contrato de la API en una segunda fase.

---

# 10. Separar Controller, Service y Repository

La responsabilidad de cada capa debe ser:

## Controller

Gestiona HTTP.

```text
Request
↓
validación básica
↓
Service
↓
Response
```

No debe contener lógica compleja de almacenamiento.

## Service

Contiene la lógica de negocio.

Ejemplo conceptual:

```text
subir documento
↓
validar
↓
generar storage key
↓
guardar archivo
↓
guardar metadata
↓
devolver documento
```

## Repository

Se ocupa exclusivamente de MySQL.

Ejemplo:

```text
DocumentRepository.create()
DocumentRepository.findById()
DocumentRepository.findByUser()
DocumentRepository.update()
DocumentRepository.delete()
```

## StorageService

Se ocupa exclusivamente de los archivos.

Ejemplo:

```text
StorageService.upload()
StorageService.delete()
StorageService.exists()
StorageService.getDownloadUrl()
```

---

# 11. Flujo nuevo de subida

La subida deberá terminar siguiendo este flujo:

```text
React
  │
  │ POST /api/documents
  ▼
Express
  │
  ├── autenticación
  ├── autorización
  ├── validación
  ├── límite de tamaño
  └── validación del archivo
          │
          ▼
   DocumentService
          │
          ├── genera storage_key
          │
          ├── StorageService.upload()
          │
          └── DocumentRepository.create()
          │
          ▼
        MySQL
```

---

# 12. Validación de archivos

No confiar únicamente en el `Content-Type` enviado por el navegador.

Implementar una allowlist de formatos permitidos.

Por ejemplo, si el sistema solo necesita PDF:

```text
PDF
```

Si necesita documentos adicionales:

```text
PDF
DOCX
XLSX
```

No permitir formatos que la aplicación no necesite.

Se debe validar como mínimo:

* extensión.
* MIME type.
* tamaño.
* contenido real del archivo cuando sea posible.
* cantidad de archivos.
* nombre del archivo.

Para documentos sensibles se recomienda incorporar antivirus/antimalware antes de marcar el documento como `ready`.

---

# 13. Estados del documento

Introducir un estado para evitar asumir que cualquier archivo recibido está automáticamente listo.

Ejemplo:

```text
uploading
    ↓
processing
    ↓
ready
```

Si falla:

```text
rejected
```

Esto permitirá posteriormente agregar:

* antivirus.
* OCR.
* extracción de texto.
* generación de thumbnails.
* procesamiento de documentos.
* indexación.

---

# 14. Descarga segura

La descarga no debe depender de una URL pública como:

```text
/uploads/documento.pdf
```

Para documentos privados debe existir una ruta como:

```http
GET /api/documents/:id/download
```

El flujo debe ser:

```text
React
  │
  ▼
GET /api/documents/:id/download
  │
  ▼
Autenticación
  │
  ▼
Autorización
  │
  ▼
Buscar documento en MySQL
  │
  ▼
Comprobar storage_key
  │
  ▼
StorageService
  │
  ▼
Descargar archivo
```

Nunca debe bastar con conocer el ID del documento para acceder a él.

Debe comprobarse que el usuario autenticado tiene permiso para acceder al documento.

---

# 15. Mantener compatibilidad con las descargas actuales

Esta parte es especialmente importante.

No eliminar inmediatamente las rutas antiguas.

Durante la migración, el backend debe poder determinar si un documento pertenece al sistema nuevo o al sistema anterior.

Por ejemplo:

```text
Documento nuevo
    ↓
storage_key disponible
    ↓
StorageService
```

Documento antiguo:

```text
Documento antiguo
    ↓
legacy_path
    ↓
sistema anterior
```

De esta forma, los documentos existentes seguirán funcionando mientras se realiza la migración.

---

# 16. Migración de documentos existentes

Una vez implementado el nuevo sistema, crear un script de migración.

Ejemplo conceptual:

```text
Documento antiguo
        │
        ▼
Leer ruta actual
        │
        ▼
Comprobar que existe
        │
        ▼
Generar nuevo storage_key
        │
        ▼
Copiar archivo al nuevo storage
        │
        ▼
Calcular checksum
        │
        ▼
Actualizar MySQL
```

Durante la primera migración es preferible **copiar**, no mover.

Es decir:

```text
ANTES:

uploads/contrato.pdf


DURANTE:

uploads/contrato.pdf
        +
storage/documents/01J8...pdf
```

Una vez verificado que el nuevo archivo funciona correctamente, se podrá eliminar el archivo antiguo.

Esto permite hacer rollback.

---

# 17. El script de migración debe ser idempotente

Si se ejecuta:

```bash
npm run migrate:documents
```

y el proceso falla después de 500 archivos, no debería comenzar nuevamente desde cero ni duplicar archivos.

El script debe comprobar si cada documento ya fue migrado.

Por ejemplo:

```text
storage_key existe
    ↓
omitir

storage_key no existe
    ↓
migrar
```

También debe registrar:

```text
total
procesados
migrados
omitidos
errores
```

Ejemplo:

```text
Document migration

Total:      1248
Migrados:   1203
Omitidos:      40
Errores:       5
```

Los errores deben quedar registrados para poder corregirlos posteriormente.

---

# 18. Verificación mediante checksum

Durante la migración calcular SHA-256 del archivo.

Ejemplo:

```text
archivo original
      ↓
SHA-256
      ↓
ABC123...
```

Después de copiarlo:

```text
archivo nuevo
      ↓
SHA-256
      ↓
ABC123...
```

Si ambos hashes coinciden, el archivo fue copiado correctamente.

Guardar el checksum en MySQL:

```text
checksum = ABC123...
```

Esto proporciona una forma objetiva de verificar la integridad de la migración.

---

# 19. No eliminar el sistema antiguo inmediatamente

Después de migrar:

```text
Sistema nuevo
    ↓
funcionando
```

mantener temporalmente:

```text
Sistema antiguo
```

como fallback.

Durante este período comprobar:

* subida.
* descarga.
* eliminación.
* permisos.
* documentos antiguos.
* documentos nuevos.
* archivos inexistentes.
* errores.
* logs.
* rendimiento.

Solo después de verificar que todo funciona se podrá eliminar definitivamente la implementación antigua.

---

# 20. Manejo de eliminación

No realizar únicamente:

```text
DELETE FROM documents
```

porque podría dejar archivos huérfanos.

La eliminación debe contemplar:

```text
Solicitud DELETE
      ↓
Autenticación
      ↓
Autorización
      ↓
Actualizar/eliminar metadata
      ↓
Eliminar archivo del Storage
```

Para sistemas más grandes, la eliminación física puede realizarse mediante una cola/background job.

---

# 21. Preparar el sistema para S3/R2

Una vez que `StorageService` funcione correctamente con filesystem local, crear otra implementación:

```text
src/storage/
├── StorageService.js
├── LocalStorage.js
└── S3Storage.js
```

La aplicación no debería hacer:

```js
if (process.env.STORAGE === 's3') {
   // lógica de documentos
} else {
   // otra lógica de documentos
}
```

por todo el proyecto.

La selección del proveedor debe estar centralizada:

```text
StorageService
       │
       ├── LocalStorage
       │
       └── S3Storage
```

Así el cambio de proveedor no afecta a React ni a la lógica de negocio.

---

# 22. Segunda evolución: URLs firmadas

Cuando se migre a S3/R2, para archivos privados utilizar URLs firmadas/temporales.

El flujo será:

```text
React
  │
  │ GET /api/documents/:id/download
  ▼
Express
  │
  ├── autenticación
  ├── autorización
  └── generar URL temporal
          │
          ▼
      S3 / R2
          │
          ▼
        Archivo
```

La URL deberá tener una duración limitada.

Por ejemplo:

```text
5 minutos
```

El tiempo exacto dependerá de los requisitos de seguridad y experiencia de usuario.

---

# 23. Variables de entorno

No almacenar rutas o credenciales directamente en código.

Utilizar variables de entorno:

```env
STORAGE_DRIVER=local
STORAGE_PATH=./storage/documents
```

Más adelante:

```env
STORAGE_DRIVER=s3
S3_BUCKET=...
S3_REGION=...
S3_ENDPOINT=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

Nunca subir credenciales al repositorio.

Agregar las variables necesarias al `.env.example`, pero nunca los secretos reales.

---

# 24. Logging

Registrar operaciones importantes:

```text
DOCUMENT_UPLOAD_STARTED
DOCUMENT_UPLOAD_COMPLETED
DOCUMENT_UPLOAD_FAILED
DOCUMENT_DOWNLOAD
DOCUMENT_DELETE
DOCUMENT_MIGRATION
DOCUMENT_MIGRATION_FAILED
```

No registrar información sensible innecesaria ni credenciales.

Los logs deberían permitir responder:

```text
¿Qué pasó?
¿Cuándo pasó?
¿Con qué documento?
¿Con qué usuario?
¿La operación fue exitosa?
¿Por qué falló?
```

---

# 25. Manejo de errores

La subida debe contemplar errores como:

```text
Archivo demasiado grande
Formato no permitido
Archivo corrupto
Storage no disponible
Error de MySQL
Error de permisos
Archivo inexistente
Usuario sin autorización
```

No devolver stack traces al frontend en producción.

El frontend debería recibir respuestas consistentes:

```json
{
    "success": false,
    "error": {
        "code": "FILE_TOO_LARGE",
        "message": "El archivo supera el tamaño máximo permitido."
    }
}
```

Los códigos de error pueden adaptarse a la convención existente del proyecto.

---

# 26. Pruebas obligatorias antes de retirar el sistema antiguo

Probar como mínimo:

## Subida

* PDF válido.
* Archivo demasiado grande.
* Extensión no permitida.
* MIME incorrecto.
* Nombre con caracteres especiales.
* Nombre extremadamente largo.
* Dos archivos con el mismo nombre.
* Usuario sin autenticación.
* Usuario sin permisos.

## Descarga

* Usuario autorizado.
* Usuario no autorizado.
* Documento inexistente.
* Documento eliminado.
* Documento antiguo.
* Documento nuevo.

## Migración

* Archivo existente.
* Archivo inexistente.
* Archivo corrupto.
* Archivo ya migrado.
* Error de filesystem.
* Error de base de datos.
* Reejecución del script.

---

# 27. Orden recomendado de implementación

Seguir exactamente este orden para minimizar riesgos:

```text
[ ] 1. Auditar implementación actual.

[ ] 2. Documentar cómo funciona actualmente la subida y descarga.

[ ] 3. Revisar la tabla actual de documentos.

[ ] 4. Agregar los nuevos campos necesarios a MySQL.

[ ] 5. Crear StorageService.

[ ] 6. Crear LocalStorage.

[ ] 7. Implementar nombres internos seguros.

[ ] 8. Implementar validaciones de archivos.

[ ] 9. Implementar DocumentService.

[ ] 10. Implementar DocumentRepository.

[ ] 11. Adaptar nuevas subidas al nuevo sistema.

[ ] 12. Mantener temporalmente compatibilidad con documentos antiguos.

[ ] 13. Adaptar descargas al nuevo flujo seguro.

[ ] 14. Implementar autorización para descargas.

[ ] 15. Crear script de migración.

[ ] 16. Ejecutar migración sobre entorno de pruebas.

[ ] 17. Verificar checksums e integridad.

[ ] 18. Probar frontend completo.

[ ] 19. Ejecutar migración en producción.

[ ] 20. Mantener fallback durante un período de observación.

[ ] 21. Confirmar que no quedan documentos dependiendo del sistema antiguo.

[ ] 22. Retirar gradualmente la implementación antigua.

[ ] 23. Opcional: implementar S3/R2.

[ ] 24. Opcional: implementar URLs firmadas.

[ ] 25. Documentar la nueva arquitectura.
```

---

# 28. Criterio de "terminado"

La migración se considerará correctamente realizada cuando:

* [ ] Ningún controller dependa directamente de `fs` para gestionar documentos.
* [ ] Existe `StorageService`.
* [ ] MySQL almacena metadatos y no el archivo.
* [ ] Los archivos tienen nombres internos generados por el servidor.
* [ ] Los nombres originales se conservan únicamente como metadata.
* [ ] Los archivos privados no están expuestos mediante una carpeta pública.
* [ ] Las descargas requieren autenticación/autorización.
* [ ] Los documentos antiguos siguen funcionando durante la transición.
* [ ] Existe un script de migración.
* [ ] El script de migración puede ejecutarse nuevamente sin duplicar archivos.
* [ ] Se verifica la integridad de los archivos migrados.
* [ ] Existe rollback/fallback durante la transición.
* [ ] El frontend continúa funcionando sin cambios innecesarios.
* [ ] La configuración del almacenamiento está en variables de entorno.
* [ ] La implementación queda preparada para S3/R2.
* [ ] Existen pruebas para subida, descarga, autorización y migración.

---

# 29. Principio arquitectónico final

La implementación debe terminar conceptualmente así:

```text
                         ┌──────────────┐
                         │    React     │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Express    │
                         └──────┬───────┘
                                │
                                ▼
                     ┌────────────────────┐
                     │ DocumentController │
                     └─────────┬──────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │ DocumentService  │
                     └───────┬──────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
          DocumentRepository      StorageService
                  │                     │
                  ▼                     ▼
               MySQL              LocalStorage
                                      │
                                      │
                              Futuro: S3 / R2
```

La decisión arquitectónica más importante es:

> **La lógica de negocio no debe saber dónde físicamente se almacena un archivo.**

Debe decir:

```js
await storage.upload(...)
```

y no:

```js
await fs.writeFile('./uploads/...')
```

De esta forma puedes mejorar el sistema progresivamente sin tener que volver a escribirlo cuando crezca.

---

# 30. Estrategia de migración recomendada

La estrategia final debe ser:

```text
FASE 1
Sistema actual
      ↓
No romper nada


FASE 2
Nueva arquitectura
      ↓
StorageService + LocalStorage
      ↓
Sistema antiguo todavía disponible


FASE 3
Nuevos archivos
      ↓
Nuevo StorageService


FASE 4
Descargas
      ↓
Nueva autorización
      ↓
Compatibilidad con archivos antiguos


FASE 5
Migración
      ↓
Copiar documentos antiguos
      ↓
Verificar checksum
      ↓
Actualizar MySQL


FASE 6
Validación
      ↓
Probar todo
      ↓
Observar errores


FASE 7
Limpieza
      ↓
Eliminar sistema antiguo
      ↓
Eliminar archivos legacy


FASE 8 — OPCIONAL
Storage local
      ↓
S3 / Cloudflare R2
      ↓
URLs firmadas
```

**No se debe saltar directamente de la Fase 1 a la Fase 7.**

El objetivo no es solamente "cambiar dónde se guardan los archivos", sino introducir una capa de almacenamiento independiente que permita evolucionar el sistema sin volver a acoplar la aplicación al filesystem.
