@echo off
setlocal enabledelayedexpansion

:: 1. Always force current working directory to the project root where this bat file resides
cd /d "%~dp0"

title Lovely Professional University Helpdesk - Backend API Server

echo ====================================================================
echo   Lovely Professional University (LPU) Student Helpdesk Backend
echo   Academic Session 2026-27 ^| Flask REST API ^(Port 5000^)
echo ====================================================================
echo.

set "PY_CMD="

:: 2. Check virtual environment python
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PY_CMD=.venv\Scripts\python.exe"
    )
)

:: 3. Fallback to system python
if not defined PY_CMD (
    python --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PY_CMD=python"
    )
)

:: 4. Fallback to Windows py launcher
if not defined PY_CMD (
    py --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PY_CMD=py"
    )
)

if not defined PY_CMD (
    echo [ERROR] Python 3 was not detected in PATH or .venv.
    echo Please install Python 3.11+ from https://www.python.org and add it to your system PATH.
    echo.
    pause
    exit /b 1
)

echo [*] Using Python interpreter: !PY_CMD!
echo [*] Starting Flask backend server on http://localhost:5000 ...
echo [*] Press Ctrl+C at any time to gracefully shut down.
echo.

!PY_CMD! backend/run.py

if !errorlevel! neq 0 (
    echo.
    echo [!] Server exited with code !errorlevel!.
    echo Attempting fallback with system python directly...
    python backend/run.py
)

echo.
pause
