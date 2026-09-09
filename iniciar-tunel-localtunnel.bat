@echo off
title Alianza Salud - Alternativa LocalTunnel
echo ======================================================================
echo    ALIANZA SALUD MEDICAL GROUP - TUNEL ALTERNATIVO (LOCALTUNNEL)
echo ======================================================================
echo.

:: 1. Iniciar Backend si no esta corriendo
netstat -ano | findstr :3001 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo [*] Iniciando Backend en puerto 3001...
    start "Backend (Puerto 3001)" cmd /k "cd server && npm run dev"
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] Backend ya esta corriendo en el puerto 3001.
)

:: 2. Iniciar Frontend si no esta corriendo
netstat -ano | findstr :5173 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo [*] Iniciando Frontend Vite en puerto 5173...
    start "Frontend (Puerto 5173)" cmd /k "cd client && npm run dev"
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] Frontend ya esta corriendo en el puerto 5173.
)

echo.
echo ======================================================================
echo  Generando enlace publico HTTPS con LocalTunnel...
echo  (El frontend hace proxy automatico de /api y /uploads al backend)
echo ======================================================================
echo.

npx -y localtunnel --port 5173
pause
