@echo off
title Push NEXORA to GitHub
color 0B
echo ======================================================================
echo    Pushing NEXORA to GitHub: https://github.com/mksaifuddin27/NEXORA
echo ======================================================================
echo.

set ComSpec=%SystemRoot%\system32\cmd.exe

cd /d "%~dp0"

echo [1/3] Verifying Git Status...
git status

echo.
echo [2/3] Setting Main Branch...
git branch -M main

echo.
echo [3/3] Pushing to GitHub (origin main)...
echo If a GitHub login window appears, please click "Sign in with your browser".
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [INFO] If your repository already has initial files, attempting forced update...
    git push -u origin main --force
)

echo.
echo ======================================================================
echo    Done! Check your repository at:
echo    https://github.com/mksaifuddin27/NEXORA
echo ======================================================================
echo.
pause
