@echo off
title Alianza Salud - Servidor + Cliente + Tunel E2E
echo ======================================================================
echo    ALIANZA SALUD MEDICAL GROUP - ENTORNO END-TO-END REMOTO
echo ======================================================================
echo.

:: 1. Compilar frontend si no existe client\dist
if not exist "client\dist\index.html" (
    echo [*] Compilando frontend para produccion...
    cd client && call npx vite build && cd ..
)

:: 2. Iniciar Backend (que sirve tanto la API como el Frontend en puerto 3001)
netstat -ano | findstr :3001 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo [*] Iniciando Servidor Fullstack en puerto 3001...
    start "Servidor Fullstack (Puerto 3001)" cmd /k "cd server && npm run dev"
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] Servidor Fullstack ya esta activo en el puerto 3001.
)

echo.
echo ======================================================================
echo  INICIANDO TUNEL DE CLOUDFLARE AL SERVIDOR FULLSTACK...
echo  (Sirve la web, assets estaticos, /api y /uploads en alta velocidad)
echo.
echo  Copia la URL "https://xxxx.trycloudflare.com" que aparecera abajo
echo  y compartela con tu supervisor.
echo.
echo  Si Cloudflare presenta un timeout temporal, el script reintentara
echo  automaticamente en 4 segundos.
echo ======================================================================
echo.

:REINTENTAR_TUNEL
cloudflared tunnel --edge-ip-version 4 --protocol http2 --url http://127.0.0.1:3001

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] El servidor de Cloudflare tuvo una demora temporal.
    echo Reintentando conexion en 4 segundos... (Presiona Ctrl+C para salir)
    timeout /t 4 /nobreak >nul
    goto REINTENTAR_TUNEL
)

pause
