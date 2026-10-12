# NEXORA Full-Stack System Launcher (PowerShell)
# Author: Mohammed Khaja Saifuddin | Roll No: 24EG105P27

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   NEXORA — Smart Local Service Discovery System" -ForegroundColor White
Write-Host "   Author: Mohammed Khaja Saifuddin | Roll No: 24EG105P27 (CSE - P)" -ForegroundColor DarkCyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$env:ComSpec = "C:\WINDOWS\system32\cmd.exe"
$root = $PSScriptRoot

Write-Host "[1/3] Starting Spring Boot 3.3.5 Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k cd /d `"$root\backend`" && java -jar target\nexora-backend-1.0.0-SNAPSHOT.jar"

Start-Sleep -Seconds 4

Write-Host "[2/3] Starting React 18 Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k cd /d `"$root`" && npm run dev -- --host 127.0.0.1 --port 5173"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   NEXORA is running live!" -ForegroundColor Green
Write-Host "   Frontend Application: http://127.0.0.1:5173/" -ForegroundColor White
Write-Host "   Backend API Probe:    http://localhost:8080/api/health" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
