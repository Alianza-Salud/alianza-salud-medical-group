# Seguridad de la aplicación

- Autenticación: JWT HS256 de vida corta en cookie `HttpOnly`, `SameSite=Lax` y `Secure` en producción.
- Autorización: RBAC y ownership se verifican en Express, nunca se confía en la UI.
- CSRF: SameSite y validación de `Origin` en mutaciones de producción.
- Archivos: almacenamiento privado, descarga autenticada, `nosniff` y `Content-Disposition: attachment`.
- HTTP: Helmet, CORS exacto y payload JSON/urlencoded de 1 MiB.
- Abuso: límites diferenciados para login, registro y formularios públicos.

No registrar JWT, contraseñas, códigos de verificación, contenido clínico, cuerpos sensibles ni credenciales. Reportar vulnerabilidades por un canal privado al responsable del repositorio; no abrir issues públicos con datos personales.
