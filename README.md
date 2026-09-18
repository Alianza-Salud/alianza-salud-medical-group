# Alianza Salud Medical Group

Plataforma de gestión médico-legal con sitio público, expedientes privados, documentos, citas, notificaciones y paneles por rol.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS y React Router.
- Backend: Node.js, Express y MySQL (`utf8mb4`).
- Sesión: JWT HS256 de corta duración en cookie HttpOnly.
- Almacenamiento: disco local privado o S3-compatible (incluido Cloudflare R2).
- Integraciones opcionales: correo transaccional y Google Calendar/Meet.

## Desarrollo

Requiere Node.js 20+, npm y MySQL 8.

```bash
cd client
npm ci
npm run dev
```

```bash
cd server
copy .env.example .env
# Reemplazar placeholders; generar JWT_SECRET con: openssl rand -base64 48
npm ci
npm run dev
```

El cliente usa `http://localhost:5173` y proxifica `/api` a `http://localhost:3001`. La API no arranca si `JWT_SECRET` falta o tiene menos de 32 caracteres.

## Configuración, roles y documentos

Consulta [server/.env.example](server/.env.example). Los roles canónicos son `admin`, `auxiliar_admisiones`, `lawyer` y `client`; sus permisos están en [docs/RBAC_MATRIX.md](docs/RBAC_MATRIX.md).

`server/uploads` es temporal y `storage` es privado; ninguno se versiona o sirve por HTTP. Toda descarga pasa por un endpoint autenticado y autorizado. Consulta [docs/STORAGE.md](docs/STORAGE.md).

## Migraciones y pruebas

Los cambios de base de datos nuevos están en `server/migrations/` y se aplican en orden después de un backup. No se modifican migraciones ya desplegadas.

```bash
cd server
npm run migrate
```

```bash
cd server
npm test

cd ../client
npm run lint
npm run build
```

CI ejecuta lint, build, pruebas de seguridad y auditoría de dependencias. Nunca se usan documentos reales como fixtures o artifacts.

## Despliegue y seguridad

Usa HTTPS, bucket privado, secretos administrados por la plataforma y dominios CORS explícitos. La respuesta al incidente y limpieza del historial está en [SECURITY_REMEDIATION.md](SECURITY_REMEDIATION.md). Más detalles: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y [docs/SECURITY.md](docs/SECURITY.md).
