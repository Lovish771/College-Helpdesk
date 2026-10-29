@echo off
setlocal enabledelayedexpansion

:: 1. Always force current working directory to the project root where this bat file resides
cd /d "%~dp0"

title Lovely Professional University Helpdesk - Frontend Dev Server

echo ====================================================================
echo   Lovely Professional University (LPU) Student Helpdesk Frontend
echo   Academic Session 2026-27 ^| Vite Dev Server ^(Port 5173^)
echo ====================================================================
echo.

:: 2. Ensure Node.js and npm are accessible in PATH (handling custom drive installations like F:\NodeJS)
where node.exe >nul 2>&1
if !errorlevel! neq 0 (
    if exist "F:\NodeJS\node.exe" (
        set "PATH=F:\NodeJS;!PATH!"
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;!PATH!"
    )
)

where node.exe >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js was not detected in your PATH or standard install directories.
    echo Please install Node.js LTS from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: 3. Verify node_modules presence
if not exist "node_modules\" (
    echo [*] Installing frontend npm packages first...
    call npm install
)

echo [*] Starting Vite development server on http://localhost:5173 ...
echo [*] Press Ctrl+C at any time to gracefully stop the server.
echo.

:: 4. Launch Vite using call so the batch script stays attached and never crashes closed
if exist "node_modules\.bin\vite.cmd" (
    call "node_modules\.bin\vite.cmd"
) else (
    call npm run dev
)

if !errorlevel! neq 0 (
    echo.
    echo [!] Frontend server exited with code !errorlevel!.
)

echo.
pause
