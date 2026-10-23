@echo off
title AetherFlow Python Setup Helper
echo ========================================
echo         AetherFlow Python Setup
echo ========================================
echo.

echo Checking for Python installation...
echo.

REM Try different Python commands
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [SUCCESS] Python found: 
    python --version
    echo.
    echo Python is ready! You can now run AetherFlow.
    echo.
    pause
    exit /b 0
)

python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo [SUCCESS] Python3 found:
    python3 --version
    echo.
    echo Python is ready! You can now run AetherFlow.
    echo.
    pause
    exit /b 0
)

py --version >nul 2>&1
if %errorlevel% == 0 (
    echo [SUCCESS] Python Launcher found:
    py --version
    echo.
    echo Python is ready! You can now run AetherFlow.
    echo.
    pause
    exit /b 0
)

echo [ERROR] Python not found in PATH
echo.
echo AetherFlow requires Python 3.8 or higher to run.
echo.
echo Please follow these steps:
echo 1. Go to https://python.org/downloads
echo 2. Download Python 3.8 or higher
echo 3. During installation, CHECK "Add Python to PATH"
echo 4. After installation, restart your computer
echo 5. Run this script again to verify
echo.
echo Alternative: You can also install Python from Microsoft Store
echo.
pause

REM Ask if user wants to open Python download page
echo.
set /p choice="Would you like to open the Python download page? (y/n): "
if /i "%choice%"=="y" (
    start https://python.org/downloads
)

pause
