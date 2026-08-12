# Alianza Salud Medical Group

Plataforma web para la captación de clientes y el seguimiento de casos jurídicos.

## Estructura del proyecto

```
├── client/     # Frontend React + Vite + TypeScript
└── server/     # Backend Node.js + Express (estructura preparada)
```

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
# Instalar dependencias del frontend
cd client
npm install

# Instalar dependencias del backend
cd ../server
npm install
```

## Desarrollo

### Frontend

```bash
cd client
npm run dev
```

El frontend se ejecuta en `http://localhost:5173`.

### Backend

```bash
cd server
npm run dev
```

El backend se ejecuta en `http://localhost:3001`.

### Compartir puertos (forward ports)

Para exponer el frontend y backend a otra persona:

1. Comparte el puerto `5173` del cliente.
2. Comparte el puerto `3001` del servidor.

El frontend usa proxy de Vite (`/api`) hacia el backend local, así que si solo compartes `5173` en un entorno donde ambos puertos están en la misma máquina remota, la app seguirá funcionando.

### Variables de entorno

- `client/.env.example` contiene `VITE_API_URL=/api`
- `server/.env.example` contiene `PORT=3001` y `CORS_ORIGIN=http://localhost:5173`

## Stack tecnológico

### Frontend
- React.js + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Lucide React (iconos)
- React Hook Form + Zod (formularios)

### Backend
- Node.js
- Express.js
- CORS, Helmet

### Base de datos (fases futuras)
- MySQL

## Fase actual

**Fase 1** — Sitio web público con datos mock centralizados.

La arquitectura está preparada para evolucionar hacia:
- Fase 2: API REST con Express + MySQL
- Fase 3: Autenticación + roles
- Fase 4: Dashboard de cliente
- Fase 5: Dashboard administrativo

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/servicios` | Listado de servicios jurídicos |
| `/servicios/:slug` | Detalle de servicio |
| `/nosotros` | Sobre la organización |
| `/proceso` | Proceso de atención |
| `/citas` | Solicitar cita |
| `/contacto` | Contacto |
| `/login` | Acceso (placeholder) |
