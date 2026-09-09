# Guía de Túnel Cloudflare para Pruebas Remotas End-to-End (E2E)

Esta configuración permite exponer tanto el **Frontend (Vite/React)** como el **Backend (Node.js/Express API)** a través de un **único enlace público HTTPS seguro de Cloudflare**, sin necesidad de abrir puertos en tu router ni configurar certificados SSL manualmente.

---

## 🏗️ ¿Cómo funciona la arquitectura?

1. **Un solo origen (Sin problemas de CORS ni HTTPS Mixto):**
   - El túnel apunta a `http://127.0.0.1:5173` (Frontend Vite).
   - Vite está configurado con `allowedHosts: true` para aceptar cualquier subdominio de Cloudflare (`*.trycloudflare.com`).
   - Vite tiene un **proxy reverso interno** que redirige automáticamente todas las peticiones a `/api/*` y `/uploads/*` al servidor Express en `http://127.0.0.1:3001`.
2. **Tu supervisor solo necesita 1 URL:**
   - Al abrir `https://<nombre-aleatorio>.trycloudflare.com`, el supervisor carga la interfaz gráfica completa.
   - Todas las llamadas a la API (`/api/auth/login`, `/api/cases`, `/api/health`, etc.) se resuelven en el mismo dominio bajo HTTPS de forma transparente y con estado de sesión intacto.

---

## 🚀 Cómo iniciar el entorno (Opción 1 Click)

En la raíz del proyecto, simplemente ejecuta:

```bat
.\iniciar-tunel-e2e.bat
```

*(O haz doble clic sobre el archivo `iniciar-tunel-e2e.bat` en el explorador de Windows)*

El script automáticamente:
1. Verifica si el Backend (puerto 3001) está corriendo; si no lo está, lo inicia.
2. Verifica si el Frontend (puerto 5173) está corriendo; si no lo está, lo inicia.
3. Lanza `cloudflared tunnel` y te mostrará la URL pública:
   ```
   https://tu-nombre-generado.trycloudflare.com
   ```
4. Copias esa URL y se la envías a tu supervisor.

---

## 🛠️ Cómo iniciar manualmente (Paso a paso)

Si prefieres tener terminales separadas:

### Terminal 1: Backend
```powershell
cd server
npm run dev
```

### Terminal 2: Frontend
```powershell
cd client
npm run dev
```

### Terminal 3: Túnel de Cloudflare
```powershell
npm run tunnel
# o directamente:
cloudflared tunnel --url http://127.0.0.1:5173
```

---

## 👥 Credenciales de Prueba para el Supervisor

| Rol | Correo Electrónico | Contraseña | Perfil |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@alianzasalud.com` | `admin123` | Gestión total del sistema |
| **Abogado / Médico** | `santiago@alianzasalud.com` | `expertpass123` | Dr. Santiago Ospina |
| **Cliente** | `gabriel@example.com` | `gabriel123` | Gabriel Morales (Código: SEZSND72) |
| **Cliente** | `laura@example.com` | `cliente123` | Laura Gómez |

---

## 🩺 Endpoints para Verificación Rápida

- **Frontend:** `https://<tu-url>.trycloudflare.com/`
- **Health Check API:** `https://<tu-url>.trycloudflare.com/api/health`
