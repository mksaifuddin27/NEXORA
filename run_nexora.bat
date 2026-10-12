@echo off
title NEXORA — Smart Local Service Discovery System
color 0A
echo ======================================================================
echo    NEXORA — Smart Local Service Discovery System
echo    Author: Mohammed Khaja Saifuddin ^| Roll No: 24EG105P27 (CSE - P)
echo ======================================================================
echo.

:: Fix Windows ComSpec if misconfigured
set ComSpec=%SystemRoot%\system32\cmd.exe

echo [1/3] Checking MySQL 8.0 connection...
net start MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL80 service is active.
) else (
    echo [INFO] MySQL80 service already running or managed externally.
)

echo.
echo [2/3] Starting Spring Boot Backend (Port 8080)...
start "NEXORA Backend (Spring Boot 3.3.5)" cmd /k "cd /d "%~dp0backend" && java -jar target\nexora-backend-1.0.0-SNAPSHOT.jar"

timeout /t 5 /nobreak >nul

echo.
echo [3/3] Starting React Frontend (Port 5173)...
start "NEXORA Frontend (React 18 + Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ======================================================================
echo    Both servers have launched in dedicated windows!
echo    Frontend URL: http://127.0.0.1:5173/
echo    Backend Health: http://localhost:8080/api/health
echo ======================================================================
echo.
pause
