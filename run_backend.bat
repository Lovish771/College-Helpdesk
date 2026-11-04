@echo off
echo Starting Lovely Professional University (LPU) Helpdesk Backend...
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" backend/run.py
) else (
    python backend/run.py
)
pause
