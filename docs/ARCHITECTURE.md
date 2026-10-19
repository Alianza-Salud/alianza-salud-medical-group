# Arquitectura

El frontend React/TypeScript se compila con Vite y consume `/api` enviando cookies con `credentials: include`. Express aplica seguridad HTTP, autenticación y autorización antes de delegar en controladores y repositorios MySQL.

Los casos enlazan clientes y abogados mediante IDs (`clients.user_id`, `lawyers.user_id`, `case_lawyers`). El fallback por email solo se conserva temporalmente para clientes históricos sin `cases.user_id`; los abogados no usan fallback por nombre/email.

Los documentos se guardan mediante `StorageService`, con proveedor local privado o S3-compatible. Las notificaciones se envían mediante proveedores configurados por variables de entorno. Google Calendar/Meet es una integración opcional y sus credenciales nunca pertenecen al repositorio.
