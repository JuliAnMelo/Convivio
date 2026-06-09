@echo off
echo ===================================================
echo Iniciando Convivio (Base de Datos, Backend y Frontend)
echo ===================================================
echo.

echo [1/3] Levantando Base de Datos (PostgreSQL en Docker)...
docker-compose up -d
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudo iniciar Docker. Asegurate de que Docker Desktop este abierto.
    pause
    exit /b
)
echo Base de datos en linea.
echo.

echo [2/3] Iniciando Servidor Backend (Flask)...
start "Backend - Convivio" cmd /k "cd backend & call iniciar_backend.bat"
echo Servidor backend lanzandose en una nueva ventana.
echo.

echo [3/3] Iniciando Frontend (App Movil - Expo)...
start "Frontend - Convivio" cmd /k "cd front && npm install && npm start"
echo Frontend lanzandose en una nueva ventana.
echo.

echo ===================================================
echo Todo esta corriendo.
echo Revisa las dos ventanas nuevas que se acaban de abrir:
echo  1. La del Backend (mostrara logs del servidor).
echo  2. La del Frontend (mostrara el codigo QR para Expo Go).
echo.
echo NOTA: La app usa la IP 10.0.2.2 por defecto (ideal para simulador Android).
echo Si vas a escanear el QR con tu telefono fisico, busca la IP WiFi de
echo tu computador (ej. 192.168.1.5) y cambiala en los archivos del frontend.
echo ===================================================
pause
