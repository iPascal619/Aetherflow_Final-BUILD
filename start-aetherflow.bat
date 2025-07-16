@echo off
title AetherFlow - Sickle Cell Crisis Assessment
echo Starting AetherFlow...
echo.

REM Start AI server in background
echo Starting AI Model Server...
start /B python model\inference_api.py

REM Wait for server to start
timeout /t 3 /nobreak >nul

REM Start web server
echo Starting Web Interface...
start /B python -m http.server 8080

REM Wait for web server
timeout /t 2 /nobreak >nul

REM Open browser
echo Opening AetherFlow in your browser...
start http://localhost:8080

echo.
echo AetherFlow is now running!
echo - Web Interface: http://localhost:8080
echo - Close this window to stop the application
echo.
pause

REM Cleanup - kill background processes
taskkill /F /IM python.exe >nul 2>&1
